import {
  formatPercent,
  formatNegativeNumber,
} from './format'


const numberFromString = (str) => str.replace(/[^-.\d]/g, '')

export const normalizePercent = ({ postfix = false } = {}) => (value) => {
//   if (!value) {
    return value
//   }
    
  const number = numberFromString(value) //* 100

  return postfix 
    ? `${number}%`
    : number
}
  
export const normalizeNumber = ({ fixed } = {}) => (value) => {
  // if (!value) {
    return value
  // }
  
  const number = numberFromString(value)
  
  return formatNegativeNumber(number, fixed)
}