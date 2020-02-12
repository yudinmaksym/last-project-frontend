import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()


const superagent = superagentPromise(_superagent, global.Promise)
const responseBody = res => res.body
const responseText = res => res.text

const validateResponse = (body) => {
  // if (body.error) {
  //   throw new Error(body.error)
  // }

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

const handleUnauthorized = (err) => {
  // console.dir(err)
  if (err.status === 401) {
    // if(process.browser) {
    //   window.location = '/'
    //   eraseCookie('token')
    // }
  } else {
    return Promise.reject(err)
  }
}

const encode = encodeURIComponent

function eraseCookie(name) {
  document.cookie = name+'=; Max-Age=-99999999;'  
}

const _apiAmazon = publicRuntimeConfig.API_URL

const _zendeskToken = '672112168409adb57a67ca78bf64a4cb0912dc8f10bf5ffc92b2822148ca7bb9'
const _zendeskApi = 'https://myselfcompany.zendesk.com'

const _api = 'https://iot-api.takatechnology.com'
const _apiInflux = 'https://influx.takatechnology.com/api/v2/query?org=Taka Technology'
// const _apiInflux = 'https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?org=rav@risebt.com.au'
const _apiInfluxToken = 'EmmS9eozsWs0nJuu5TrmFb-hwQli_8NOeZUdEVCYkobZ0QsDxvqKFsgQgAsGwdRZGWlmodmyLmmZMz35Lbhe9A=='
// const _apiInfluxToken = 'FNhGdHCgZbuf91n8rXJ5yJ0IoW4euVRHPPySwk6Pdgm5i5kDJxykWFKWzpEDd6PahGLMQUkpIinC2Q0HaboQlw=='
const _apiWeather = 'https://api.openweathermap.org/'
// const _apiAmazon = 'https://b6vuf0u05b.execute-api.us-east-1.amazonaws.com/stage'

const apiUrl = url => _api + url

const requests = {
  get: url =>
    superagent
      .get(`${_api}${url}`)
      .use(tokenPlugin)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized),
  getWeather: url =>
    superagent
      .get(`${_apiWeather}${url}`)
      .then(responseBody),
  getAmazon: url =>
    superagent
      .get(`${_apiAmazon}${url}`)
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
  postInflux: (body) => {
    return superagent
      .post(`${_apiInflux}`, body)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/vnd.flux')
      .set('Authorization', 'Token ' + _apiInfluxToken)
      .then(responseText)
      .catch(handleUnauthorized)
  },
  zendesk: (url) => {
    return superagent
      .get(`${_zendeskApi}${url}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + _zendeskToken)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized)
  },
  zendeskPost: (url, body) => {
    return superagent
      .post(`${_zendeskApi}${url}`, body)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + _zendeskToken)
      .then(responseBody)
      .then(validateResponse)
      .catch(handleUnauthorized)
  }
}

const Zendesk = {
  getFieldsList: () => 
    requests.zendesk('/api/v2/ticket_fields.json'),
  createTicket: (body) =>
    requests.zendeskPost('/api/v2/requests.json', body),
}

const Influx = {
  loadInfluxData: (body) =>
    requests.postInflux(body),
}

const Default = {
  loadAllProjects: (companyId = 2) =>
    requests.getAmazon(`/projects/iot?companyId=${companyId}`),
}

const Daily = {
  loadAllDailyProjects: () =>
    requests.getAmazon('/projects/iot'),
  loadAllMdbListForCurrentProject: (projectId, companyId = 2) =>
    requests.getAmazon(`/meters/iot?companyId=${companyId}&projectId=${projectId}`),
  loadTotalConsumption: (range, id) => 
    requests.getAmazon(`/baseline/daily?project=${id}&topic=Total Consumption Baseline&start=${range.startDate}&end=${range.endDate}`),
  loadDailyForecast: (range, id) =>
    requests.getAmazon(`/baseline/daily?project=${id}&topic=Forecast Consumption&start=${range.startDate}&end=${range.endDate}`),
  loadTenantBaseline: (range, project) => 
    requests.get(`/baseline/${project}/daily/Tenant%20Baseline?start=${range.startDate}&end=${range.endDate}`),
  loadSubjectCdd: (region, cdd, range) => 
    requests.getAmazon(`/degreedays/total?region=${region}&topic=${cdd}&start=${range.startDate}&end=${range.endDate}`),
  loadWholeBuildingsEnergy: (body) => 
    requests.postInflux(body),
  loadTotalEnergyConsumption: (body) =>
    requests.postInflux(body),
  loadMdbPower: (body) =>
    requests.postInflux(body),
  loadMdbPowerSum: (body) =>
    requests.postInflux(body),
  loadCHWTemp: (body) =>
    requests.postInflux(body),
}

const Summary = {
  loadMdbSavingTotal: (startDate, endDate, project, mdbName) => 
    requests.get(`/baseline/${project}/total/${mdbName}?start=${startDate}&end=${endDate}`),
  loadMdbBaseline: (startDate, endDate, project, mdbName) => 
    requests.get(`/baseline/${project}/daily/${mdbName}?start=${startDate}&end=${endDate}`),
  loadMdbTotalEnergy: (body) => 
    requests.postInflux(body),
  loadMdbActualConsumption: (body) =>
    requests.postInflux(body),
  loadMdbPower: (body) =>
    requests.postInflux(body),
  getEquipListByMeterName: (id, meter) =>
    requests.getAmazon(`/assets?projectId=${id}&meter=${meter}`),
  getFullEquipListForProject: (id) =>
    requests.getAmazon(`/assets?projectId=${id}`),
}

const Lobby = {
  loadTotalEnergyConsumption: (body) =>
    requests.postInflux(body),
  loadDailyEnergyConsumption: (body) =>
    requests.postInflux(body),

  loadTotalConsumptionBaseline: (id, startDate, endDate) =>
    requests.getAmazon(`/baseline/total?project=${id}&topic=Total Consumption Baseline&start=${startDate}&end=${endDate}`),
  loadDailyConsumptionBaseline: (id, startDate, endDate) =>
    requests.getAmazon(`/baseline/daily?project=${id}&topic=Total Consumption Baseline&start=${startDate}&end=${endDate}`),
  loadDailyForecast: (id, startDate, endDate) =>
    requests.getAmazon(`/baseline/daily?project=${id}&topic=Forecast Consumption&start=${startDate}&end=${endDate}`),
  loadCurrentWeather: () =>
    requests.getWeather('data/2.5/weather?q=Abu Dhabi,ae&appid=622e61bc8ab4d9129a519004a94d20d0&units=metric'),
}

const Portfolio = {
  baselineTotalMonth: (projectId, startDate, endDate) => 
    requests.getAmazon(`/baseline/total?project=${projectId}&topic=Total Consumption Baseline&start=${startDate}&end=${endDate}`),
  baselineTotalWeek: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/total?project=${projectId}&topic=Total Consumption Baseline&start=${startDate}&end=${endDate}`),
  baselineDailyMonth: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/daily?project=${projectId}&topic=Total Consumption Baseline&start=${startDate}&end=${endDate}`),
  forecastTotalMonth: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/total?project=${projectId}&topic=Forecast Consumption&start=${startDate}&end=${endDate}`),
  forecastTotalWeek: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/total?project=${projectId}&topic=Forecast Consumption&start=${startDate}&end=${endDate}`),
  forecastDailyMonth: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/daily?project=${projectId}&topic=Forecast Consumption&start=${startDate}&end=${endDate}`),
  tenantBaseline: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/total?project=${projectId}&topic=Tenant Baseline&start=${startDate}&end=${endDate}`),
  dailyTenantBaseline: (projectId, startDate, endDate) =>
    requests.getAmazon(`/baseline/daily?project=${projectId}&topic=Tenant Baseline&start=${startDate}&end=${endDate}`),
}

const ChilledWaterPlant = {
  loadCWPEquipList: (projectId) =>
    requests.getAmazon(`/assets?projectId=${projectId}&group=Chilled Water Plant`),
}

const Fahu = {
  loadAllFahuEquip: (projectId) =>
    requests.getAmazon(`/assets?projectId=${projectId}&type=3`),
}

const Chiller = {
  loadCWPEquipList: (projectId) =>
    requests.getAmazon(`/assets?projectId=${projectId}&type=4`),
}

const FCU = {
  loadFcuList: (projectId) =>
    requests.getAmazon(`/assets?projectId=${projectId}&type=11`),
}

const Weather = {
  loadDegrees: (cdd, city, start, end) =>
    requests.getAmazon(`/degreedays?region=${city}&topic=cdd_${cdd}&start=${start}&end=${end}`),
  loadTotalDegrees: (cdd, city, start, end) => 
    requests.getAmazon(`/degreedays/total?region=${city}&topic=${cdd}&start=${start}&end=${end}`),
  loadCurrentWeather: (city) =>
    requests.getWeather(`data/2.5/weather?q=${city},ae&appid=622e61bc8ab4d9129a519004a94d20d0&units=metric`),
  loadTopicsList: () => 
    requests.getAmazon(`/degreedays/topics`),
}

const HotWaterPlant = {
  loadEquipList: (projectId) =>
    requests.getAmazon(`/assets?projectId=${projectId}&group=Hot Water Plant`),
}

export default {
  _requests: requests,
  Daily,
  Summary,
  Lobby,
  Portfolio,
  ChilledWaterPlant,
  Fahu,
  Influx,
  Default,
  Chiller,
  FCU,
  Weather,
  HotWaterPlant,
  Zendesk,
  setToken: _token => {
    token = _token
  },
  setCompanyId: _companyId => {
    companyId = _companyId
  },
}
