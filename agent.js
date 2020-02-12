import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'
import getConfig from 'next/config'


const { publicRuntimeConfig } = getConfig()

const superagent = superagentPromise(_superagent, global.Promise)
const responseBody = res => res.body

const validateResponse = body => {
  if (body.error) {
    throw new Error(body.error)
  }

  return body
}

let token = null
let companyId = null
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', token)
  }

  // if (companyId) {
  //   req.query({ companyId })
  // }
}

const handleUnauthorized = err => {
  console.dir(err)
  if (err.status === 401) {
    // if(process.browser) {
    //   window.location = '/'
    //   eraseCookie('token')
    // }
  } else {
    return Promise.reject(err)
  }
}

class Requester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  del = url =>
    superagent
      .del(`${this.baseUrl}${url}`)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized);

  get = url =>
    superagent
      .get(`${this.baseUrl}${url}`)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized);

  put = (url, body) =>
    superagent
      .put(`${this.baseUrl}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized);

  patch = (url, body) =>
    superagent
      .patch(`${this.baseUrl}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized);

  post = (url, body) => {
    return superagent
      .post(`${this.baseUrl}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized)
  };
}

const encode = encodeURIComponent

function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999;`
}

const env = publicRuntimeConfig.NODE_ENV || 'dev'

if (env !== 'production') {
  console.log('starting client...')
  console.log(
    'Env',
    env
  )
}

const _api = publicRuntimeConfig.API_URL

console.log('RUNTIME CONFIG', publicRuntimeConfig)
// const _api = (env !== 'production' || )
//   ? 'http://localhost:4000'
//   : `https://hz1na8c8n3.execute-api.us-east-1.amazonaws.com/${env}`

const apiUrl = url => _api + url

const requests = {
  del: url =>
    superagent
      .del(`${_api}${url}`)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized),
  get: url =>
    superagent
      .get(`${_api}${url}`)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized),
  put: (url, body) =>
    superagent
      .put(`${_api}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized),
  patch: (url, body) =>
    superagent
      .patch(`${_api}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized),
  post: (url, body) => {
    return superagent
      .post(`${_api}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized)
  },
  upload: (url, file, onProgress) =>
    superagent
      .post(`${_api}${url}`)
      .timeout({
        response: 1 * 3600 * 1000, // Wait 1 hour seconds for the server to start sending,
        deadline: 1 * 3600 * 1000, // but allow 1 hour for the file to finish loading.
      })
      .attach('file', file)
      .use(tokenPlugin)
      .catch(handleUnauthorized),
  uploads3: (s3path, file, type) =>
    superagent
      .put(s3path)
      .set('Content-Type', type)
      .set('Content-Disposition', 'inline')
      .set('x-amz-acl', 'public-read')
      .send(file)
      .catch(handleUnauthorized),
}

const Upload = {
  getSignedUrl: (filename, filetype) =>
    requests.post('/files/upload', { filename, filetype }),

  putFile: (s3Url, key, file) =>
    requests.uploads3(s3Url, file, file.type).then(() => ({
      key,
      name: file.name,
    })),

  publish: data => requests.put('/files/publish', data),

  extractData: data => requests.post('/files/extract', data),
}

const Files = {
  ready: (key, timeout = 1000) => {
    return new Promise(async (resolve, reject) => {
      const Item = await requests.post('/files/ready', { key })

      if (Item) {
        if (Item.file_status === 'uploaded') {
          setTimeout(() => {
            Files.ready(key, timeout)
              .then(res => resolve(res))
              .catch(err => reject(err))
          }, timeout)
        } else {
          resolve(Item)
        }
      } else {
        reject(Error('No such document found'))
      }
    })
  },
}

const formatListParams = (url, pageSize, offset, filters, sort) => {
  url += '?'

  url += `limit=${pageSize}`

  if (offset) {
    url += '&'
    url += `offset=${offset}`
  }

  if (filters) {
    url += '&'
    url += `filters=${encodeURIComponent(JSON.stringify(filters))}`
  }

  if (sort) {
    url += '&'
    url += `sort=${encodeURIComponent(JSON.stringify(sort))}`
  }

  return url
}

const Tables = {
  manual: data => requests.post('/manual', data),
  getAll: (pageSize = 5, offset, filters, sort) =>
    requests.get(formatListParams('/consumptions/tables', pageSize, offset, filters, sort)),
  getExportAll: (filters, sort) =>
    requests.get(formatListParams('/consumptions/exportTables',null,null,filters, sort)),
}

const AlarmingTables = {
  getAll: (pageSize = 50,page=0,month=2019-10,diff,sort) =>
    // eslint-disable-next-line max-len
    requests.get(`/consumptions/energyConsumptionComparison?page=${page}&pageSize=${pageSize}&month=${month}&diff=${diff}&sort=${sort}`),
  getListWithProjectLevel:(pageSize = 50,page=0,topWorst,month=2019-10,diff,sort) =>
    // eslint-disable-next-line max-len
    requests.get(`/consumptions/projectLevelConsumptionComparison?page=${page}&pageSize=${pageSize}&month=${month}&diff=${diff}&topWorst=${topWorst}&sort=${sort}`),
}
const PoorProjectList = {
  getAll: () =>
    requests.get('/consumptions/worstPerformingAccounts'),
}

const List = {
  getAll: (pageSize = 5, lastKey) =>
    requests.get(formatListParams('/files/list', pageSize, lastKey)),
}

const Portfolio = {
  info: () => requests.get('/projects/portfolio'),
}

const Meters = {
  load: id => requests.get(`/meters/${id}`),
  update: (id, data) => requests.put(`/meters/${id}`, data),
  rejectUnmapped: (meterId) =>
    requests.get(`/consumptions/values?type=unmappedReject&meterId=${meterId}`),
  unmappedSave: (meterId, data) =>
    requests.get(
      `/consumptions/values?type=unmappedSave&meterId=${meterId}&project_id=${data.project_id}&premise_number=${data.premise_number}&account_number=${data.account_number}&meter_number=${data.meter_number}&fuel_type=${data.fuel_type}&utility=${data.utility}&meter_name=${data.meter_name}`
    ),
  loadUnmapped: () =>
    requests.get('/consumptions/values?type=unmapped'),
}

const Projects = {
  create: data => requests.post('/projects', data),
  get: id => requests.get(`/projects/${id}`),
  update: (id, data) => requests.put(`/projects/${id}`, data),
  updateEquation: (id, data) => requests.put(`/projects/${id}?type=equation`, data),
  loadInfoSet: (companyIds) => requests.post('/projects/info', { companyIds }),
  getSpecificProjectInfo: (id) => requests.get(`/projects/${id}/info`),
  loadInfo: (projectId, startDate) => requests.get(
    `/projects/${projectId}/info${startDate ? '?startDate='+startDate : ''}`
  ),
  getAll: (pageSize = 5, page = 0, filters = []) =>
    requests.get(
      `/projects?pageSize=${pageSize}&page=${page}&filters=${encodeURIComponent(JSON.stringify(filters))}`
    ),
  getAllByZone: () => requests.get('/projects/byZone'),
  projectConsumptionByYears: (projectId, meters = []) =>
    requests.get(
      `/zones/1/yoy?type=projectConsumptionByYears&projectId=${projectId}&meters=${meters}`
    ),
  energyConsumptionPerMeter: (delta = 12, projectId) =>
    requests.get(
      `/zones/1/yoy?type=projectEnergyConsumptionPerMeter&delta=${delta}&projectId=${projectId}`
    ),
  benchmarks: (zoneId,occupancyType,coolingType,squareFootage) =>
    requests.get(`/projects/benchmark?zoneId=${zoneId}&occupancyType=${occupancyType}&coolingType=${coolingType}&squareFootage=${squareFootage}`),
}

const MV = {
  variables: () =>
    requests.get(
      '/mv/variables'
    ),
  calculations: (projectId, month, year) =>
    requests.get(
      `/mv/calculations?projectId=${projectId}&month=${month}&year=${year}`
    ),
  consumptionHistory: (projectId, month, year, type = 'electricity') =>
    requests.get(
      `/mv/consumptionHistory?projectId=${projectId}&month=${month}&year=${year}&type=${type}`
    ),
  consumption: (projectId, month, year, type = 'electricity') =>
    requests.get(
      `/mv/consumption?projectId=${projectId}&month=${month}&year=${year}&type=${type}`
    ),
  yoyConsumption: (projectId, month, year, type = 'electricity') =>
    requests.get(
      `/mv/yoyConsumption?projectId=${projectId}&month=${month}&year=${year}&type=${type}`
    ),
  forecastConsumption: (projectId, month, year, type = 'electricity') =>
    requests.get(
      `/mv/forecastConsumption?projectId=${projectId}&month=${month}&year=${year}&type=${type}`
    ),
  forecastVsActual: (projectId, month, year, type = 'electricity') =>
    requests.get(
      `/mv/forecastVsActual?projectId=${projectId}&month=${month}&year=${year}&type=${type}`
    ),
  loadAllDailyProjects: () =>
    requests.get('/projects/iot'),
  loadDailyProjectData: (id) =>
    requests.get(`/projects/${id}/iot`),
}

const ProjectsMeters = {
  lookup: value => requests.get(`/meters?value=${value}&type=lookup`),
  load: id => requests.get(`/meters/${id}`),
  loadAll: (pageSize = 5, page = 1, filters) =>
    requests.get(
      `/meters?page=${page}&pageSize=${pageSize}&filters=${encodeURIComponent(JSON.stringify(filters))}`
    ),
  update: (id, data) => requests.put(`/meters/${id}`, data),
}

const MissingConsumption = {
  lookup: value => requests.get(`/meters/projectMetersMissingConsumptionList?value=${value}&type=lookup`),
  loadMissingConsumption: (pageSize = 50, page = 1, filters) =>
    requests.get(
      // eslint-disable-next-line max-len
      `/meters/projectMetersMissingConsumptionList?page=${page}&pageSize=${pageSize}&filters=${encodeURIComponent(JSON.stringify(filters))}`
    ),
}

const Zones = {
  all: () => requests.get('/zones/'),
  group: () => requests.get('/zones/group'),
  buildings: id => requests.get(`/zones/${id}/projects`),
  consumptionPerFuel: (id, ids = [], delta = 6) =>
    requests.get(`/zones/${id}/consumptionPerFuel?projects=${ids}&delta=${delta}`),
  costPerFuel: (id, ids = [], delta = 6) =>
    requests.get(`/zones/${id}/costPerFuel?projects=${ids}&delta=${delta}`),
  costPerProject: (id, ids = [], delta = 6) =>
    requests.get(`/zones/${id}/costPerProject?projects=${ids}&delta=${delta}`),
  benchmarks: (id, ids = []) =>
    requests.get(`/zones/${id}/benchmark?projects=${ids}`),
  info: (id, ids = []) => requests.get(`/zones/${id}/info?projects=${ids}`),
  consumptionByBuildingPerFuel: (id, ids = [], delta = 6) =>
    requests.get(
      `/zones/${id}/consumptionByBuildingPerFuel?projects=${ids}&delta=${delta}`
    ),
  load: id => requests.get(`/zones/${id}`),
}

function addParam(url, param, key) {
  return param ? `${url}&${key}=${param}` : url
}

const Buildings = {
  mapPins: () => requests.get('/buildings/map'),
}

const Metrics = {
  meters: () => requests.get('/metrics/meters'),
  projects: () => requests.get('/metrics/projects'),
  bills: () => requests.get('/metrics/utility'),
  metersPerMonth: (delta = 12) =>
    requests.get(`/metrics/metersPerMonth?delta=${delta}`),
  yearsZoneConsumption: () =>
    requests.get('/zones/1/yoy?type=yearsZoneConsumption'),
  consumptionFuel: (delta = 1, fuelType = 'Energy', projectId) =>
    requests.get(
      addParam(
        `/metrics/consumptionFuel?delta=${delta}&fuel=${fuelType}`,
        projectId,
        'projectId'
      )
    ),
  consumptionFuelByDateRange: (startDate, endDate, fuelType = 'Energy', projectId) =>
    requests.get(
      addParam(
        `/metrics/consumptionFuel?startDate=${startDate}&endDate=${endDate}&fuel=${fuelType}`,
        projectId,
        'projectId'
      )
    ),
  costPerFuel: (delta = 1, projectId) =>
    requests.get(
      addParam(`/metrics/costPerFuel?delta=${delta}`, projectId, 'projectId')
    ),
  consumptionZoneFuel: (delta = 1, projectId) =>
    requests.get(
      addParam(
        `/metrics/consumptionZoneFuel?delta=${delta}`,
        projectId,
        'projectId'
      )
    ),
  energy: (type = 'eui', year, projectId) =>
    requests.get(
      `/calculations/energy?type=${type}&year=${year}&projectId=${projectId}`
    ),
  consumptionByMDB: (projectId, delta = 12) =>
    requests.get(
      `/metrics/consumptionByMDB?delta=${delta}&projectId=${projectId}`
    ),
  projectScore: (projectId, delta = 12) =>
    requests.get(
      `/benchmarks/projectScore?projectId=${projectId}&delta=${delta}`
    ),
  consumptionByZone: (countFor, delta) =>
    requests.get(
      `/zones/1/yoy?type=consumptonByZone&countFor=${countFor}&delta=${delta}`
    ),
  consumptions: (delta = 3) =>
    requests.get(`/zones/1/yoy?type=consumptions&delta=${delta}`),
  portfolioConsumptionByYears: (zoneIds = []) =>
    requests.get(`/zones/1/yoy?type=zonesConsumptionByYears&zones=${zoneIds}`),
}

const Users = {
  create: data => new Requester(_api).post('/users', data),
  get: id => new Requester(_api).get(`/users/${id}`),
  update: (id, data) => new Requester(_api).patch(`/users/${id}`, data),
  getAll: (pageSize = 5, page, filters = {}) =>
    new Requester(_api).get(formatListParams('/users', pageSize, page, filters)),
  delete: id => new Requester(_api).del(`/users/${id}`),
}

const Companies = {
  get: id => new Requester(`${_api}`).get(`/companies/${id}`),
  create: (data) => new Requester(`${_api}`).post('/companies', data),
  update: (id, data) => new Requester(`${_api}`).patch(`/companies/${id}`, data),
  getAll: () =>
    new Requester(`${_api}`).get('/companies'),
}

const Baseline = {
  loadByDateRange: (start, end, projectId, actual = false) =>
    requests.get(
      `/baseline/project?id=${projectId}&start=${start}&end=${end}&actual=${actual}`
    ),
  projectMeters: projectId =>
    requests.get(
      `/zones/1/yoy?type=baselineProjectMeters&projectId=${projectId}`
    ),
  values: projectId =>
    requests.get(
      `/zones/1/yoy?type=projectBaselineValues&projectId=${projectId}`
    ),
  update: (projectId, data) =>
    requests.put(`/projects/${projectId}?type=baseline`, data),
}

const Heatmap = {
  heatMapValues: (zoneId, delta = 6,fuel) =>
    requests.get(
      `/zones/${zoneId}/perMeterAccount?delta=${delta}&fuel_type=${fuel}`
    ),

}
const Customers = {
  create: data => new Requester(`${_api}`).post('/customers', data),
  get: id => new Requester(`${_api}`).get(`/customers/${id}`),
  update: (id, data) =>
    new Requester(`${_api}`).patch(`/customers/${id}`, data),
  getAll: (pageSize = 5, page) =>
    new Requester(`${_api}`).get(
      `/customers?perPage=${pageSize}&page=${page}`
    ),
  delete: id => new Requester(`${_api}`).del(`/customers/${id}`),
}

const Consumptions = {
  getManualValues: (projectId, year) =>
    requests.get(`/consumptions/values?projectId=${projectId}&year=${year}`),
  updateManualValues: (projectId, year, data) =>
    requests.post(
      `/consumptions/update?projectId=${projectId}&year=${year}`,
      data
    ),
}

const csvFile = {
  create: data =>
    new Requester(`${_api}`).post('/files/csv-upload', data),
}
const Auth = {
  signUp: data => new Requester(`${_api}`).post('/auth/sign-up', data),
  token: data => new Requester(`${_api}`).post('/auth/token', data),
  exchange: data => new Requester(`${_api}`).post('/auth/exchange', data),
  me: () => new Requester(`${_api}`).get('/auth/me'),
  requestResetPassword: (data) => new Requester(`${_api}`).post('/auth/request-reset', data),
  resetPassword: (data) => new Requester(`${_api}`).post('/auth/reset', data),
}

const Reports = {
  info: (type, year, month, id) =>
    requests.get(`/reports/info?type=${type}&year=${year}&month=${month}&id=${id}`),
  energy: (type, year, month, id) =>
    requests.get(`/reports/energy?type=${type}&year=${year}&month=${month}&id=${id}`),
  energyConsumptionByYears: (type, year, month, id) =>
    requests.get(`/reports/energyConsumptionByYears?type=${type}&year=${year}&month=${month}&id=${id}`),
  energyCost: (type, year, month, id) =>
    requests.get(`/reports/energyCost?type=${type}&year=${year}&month=${month}&id=${id}`),
  energyConsumptionByLevel: (type, year, month, id) =>
    requests.get(`/reports/energyConsumptionByLevel?type=${type}&year=${year}&month=${month}&id=${id}`),
  energyConsumptionActualBaseline: (type, year, month, id) =>
    requests.get(`/reports/energyBaselineVSActual?type=${type}&year=${year}&month=${month}&id=${id}`),
  energyYOYConsumption: (type, year, month, id) =>
    requests.get(`/reports/energyYOYConsumption?type=${type}&year=${year}&month=${month}&id=${id}`),
}

const EuiScoresBaselines = {
  get: () =>
    requests.get('/eui_scores_baselines'),
  create: data => requests.post('/eui_scores_baselines', data),
  update: data => requests.put('/eui_scores_baselines', data),

}

const pipdrive = {
  list: ({ start, limit }) => superagent
    .get(`https://api.pipedrive.com/v1/deals?start=${start}&limit=${limit}&api_token=c41ccaa9e5858a6671040541eb7aee412ad57e81`)
    .then(responseBody),
  fields: () => superagent
    .get('https://api.pipedrive.com/v1/dealFields?api_token=c41ccaa9e5858a6671040541eb7aee412ad57e81')
    .then(responseBody),
}

const verifyToken = () =>
  superagent
    .get(`${_api}/verify`)
    .use(tokenPlugin)
    .catch(e => {
      e
    })

export default {
  _requests: requests,
  Upload,
  Files,
  Meters,
  Tables,
  AlarmingTables,
  List,
  Portfolio,
  Projects,
  ProjectsMeters,
  MissingConsumption,
  Baseline,
  Heatmap,
  Buildings,
  Metrics,
  Zones,
  Users,
  Companies,
  Customers,
  Consumptions,
  Reports,
  csvFile,
  Auth,
  MV,
  EuiScoresBaselines,
  verifyToken,
  pipdrive,
  PoorProjectList,
  FieldComments: new Requester(`${_api}/field-comments`),
  EEMSurvey: new Requester(`${_api}/ed-api/eem-survey`),
  EndUseProfiles: new Requester(`${_api}/ed-api/end-use-profiles`),
  BaselineProfiles: new Requester(`${_api}/ed-api/baseline-profiles`),
  setToken: _token => {
    token = _token
  },
  setCompanyId: _companyId => {
    companyId = _companyId
  },
}
