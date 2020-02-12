import capitalize from 'lodash/capitalize'
import set from 'lodash/set'
import get from 'lodash/get'
import unset from 'lodash/unset'

import {
  firstStepFields,
  secondStepFields,
  thirdStepFields,
  fourthStepFields,
  timeframeAndSchedule,
  drawingsReceived,
} from '../opportunities/fields'


const itemsForValidate = ['zone', 'project', 'buildings', 'customer']

const fieldsForExclude = ['project.productOfferingDetails', 'project.productLumpSum', 'project.eem']
const hotelFields = ['numberFunctionRoomSeats', 'starRating', 'roomNights']

function formatInputBindings(fields, binding) {
  fields.forEach((f) => {
    if(!f.name.startsWith(`${binding}.`)) {
      f.name = `${binding}.${f.name}`
    }
  })
  return fields
}

function validateBuildingHotelFields(values, errors) {
  values.buildings && values.buildings.forEach(( item, i ) => {
    if(item.occupancy_type === 'Hotel') {
      hotelFields.forEach((f) => {
        if(!item[f] && !(item[f] === 0)) {
          set(errors, `buildings[${i}].${f}`, 'Required')
        }
      })
    }
  })
}

// eslint-disable-next-line max-len
const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

const validateRequired = (fields, values, errors) => {
  fields.forEach(({ name, required }) => {
    if(required && !get(values, name)) {
      set(errors, name, 'Required')
    } 
  })
}

const validators = {
  validateZone: (values, errors) => {
    if(values.zone && !values.zone.value) {
      set(errors, 'zone.value', 'Required')
    }
  },
  validateProject: (values, errors) => {
    values.project && validateRequired([
      { name: 'project.name', required: true },
      ...formatInputBindings(firstStepFields, 'project'),
      ...formatInputBindings(thirdStepFields, 'project'),
      ...formatInputBindings(timeframeAndSchedule, 'project'),
    ], values, errors)
    if(get(values, 'project.productOfferingCategory') === 'EPC') {
      fieldsForExclude.forEach(val => unset(errors, val))
    }
  },
  validateCustomer: (values, errors) => {
    validateRequired([
      { name: 'customer.label', required: true },
    ], values, errors)
    if(values.customer && values.customer.__isNew__) {
      validateRequired([
        { name: 'customer.value', required: true },
        ...formatInputBindings(secondStepFields, 'customer'),
      ], values, errors)
      if(values.customer.newsLink) {
        if(!values.customer.newsLink.match(urlRegex)) {
          set(errors, 'customer.newsLink', 'should be url')
        }
      }
    }
  },
  validateBuildings: (values, errors) => {
    validateBuildingHotelFields(values, errors)
    values.buildings && values.buildings.forEach((_, i) => {
      validateRequired([
        ...fourthStepFields.map((f) => ({ ...f, name: `buildings[${i}].${f.name}` })),
        ...drawingsReceived.map((f) => ({ ...f, name: `buildings[${i}].${f.name}` })),
      ], values, errors)
    })
  },
  validateMeters: (values) => {
    
  },
  validate: () => {},
}

const validate = values => {
  const errors = {}
  Object.keys(values).filter((key) => itemsForValidate.includes(key)).forEach((key) => {
    validators[`validate${capitalize(key)}`](values, errors)
  })

  return Object.entries(errors).reduce((acc, [k, v]) => {
    if(Object.keys(v).length) {
      return { ...acc, [k]: v }
    } else { return acc }
  }, {})
}

export default validate