export function getEveryTick(range) {
  switch (range) {
  case 24:
    return 2
      
  case 18:
    return 19
      
  case 12:
    return 13
      
  case 6:
    return 7
      
  case 3:
  default: 
    return 4
  }
}

export function isHidden(index, range) {
  const tick = getEveryTick(+range)
  return ((index+1) % tick) === 0
}