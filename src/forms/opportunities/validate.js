import {
  firstStepFields,
  secondStepFields,
  thirdStepFields,
  fourthStepFields,
  timeframeAndSchedule,
  drawingsReceived,
  calculationSectionFirst,
  calculationSectionSecond,
  calculationSectionThird,
  calculationSectionFourth,
} from './fields'


const fieldsForExclude = ['productOfferingDetails', 'productLumpSum', 'eem']


const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

const validate = values => {
  const errors = {};

  [
    ...firstStepFields,
    ...secondStepFields,
    ...thirdStepFields,
    ...fourthStepFields,
    ...timeframeAndSchedule,
    ...drawingsReceived,
    ...calculationSectionFirst,
    ...calculationSectionSecond,
    ...calculationSectionThird,
    ...calculationSectionFourth,
  ].forEach(({ name, required }) => {
    required && !values[name] && (errors[name] = 'Required')
  })

  if(values.newsLink) {
    if(!values.newsLink.match(urlRegex)) {
      errors.newsLink = 'should be url'
    }
  }

  if(values.productOfferingCategory === 'EPC') {
    fieldsForExclude.forEach(val => errors[val] = void 0)
  }


  return errors
}

export default validate