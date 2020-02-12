import { TYPES } from '../types/meta'

// Base color class
class Color {
  constructor(value) {
    this.value = value
  }
  
  toHex() {
    return this.value
  }
  
  toRGBA(opacity = 1) {
    let c
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(this.value)) {
      c = this.value.substring(1).split('')
      if (c.length === 3){
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return 'rgba(' + [(c>>16)&255, (c>>8)&255, c&255].join(',') + ',' + opacity + ')'
    }
  }
}

const CHART_COLORS = [
  new Color('#003f5c'),
  new Color('#2f4b7c'),
  new Color('#665191'),
  new Color('#a05195'),
  new Color('#d45087'),
  new Color('#f95d6a'),
  new Color('#ff7c43'),
  new Color('#ffa600'),
]

// const CHART_COLORS = [
//   '#32639a',
//   '#5480BA',
//   '#759FDB',
//   '#96BFFD',
//   '#B8DFFF',
// ].map(c => new Color(c))

const SYSTEM_COLORS = {
  // LOGICAL
  [TYPES.ENERGY]: new Color('#d45087'),
  // FUELS
  [TYPES.ELECTRICITY]: new Color('#ffa600'),
  [TYPES.WATER]: new Color('#2f4b7c'),
  [TYPES.CHILLED_WATER]: new Color('#a05195'),
  [TYPES.GAS]: new Color('#d45087'),
  [TYPES.OTHER]: new Color('#E8E8E8'),
  
  // COMPUTED
  [TYPES.REDUCTION]: new Color('#F7BDA3'),
  [TYPES.BASELINE]: new Color('#003f5c'),
  [TYPES.AVARAGE]: new Color('#F9E8E0'),
}

export function getSystemColor(label = TYPES.OTHER) {
  return SYSTEM_COLORS[label] || SYSTEM_COLORS[TYPES.OTHER]
}

export function getColor(index, step = 1) {
  const l = CHART_COLORS.length
  const realIndex = ( 
    (index * step) % l
  )

  return CHART_COLORS[realIndex]
}