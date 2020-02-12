var moment = require('moment')


export function formatNumber(number = 0, fixed = true) {
  if (fixed) {
    number = (+number || 0).toFixed(0)
  }

  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function formatNegativeNumber(number, fixed) {
  if (number === null) {
    return null
  }

  if (!number) {
    number = 0.00
  }

  let isNumberNegative = (number < 0)
  if (isNumberNegative) {
    number *= -1
  }

  const formattedNumber = formatNumber(number, fixed)

  return isNumberNegative
    ? `(${formattedNumber})`
    : formattedNumber
}

export function formatPercent(number, fixed = 0) {
  if (!number) {
    number = 0.00
  }

  const percentValue = (number * 100).toFixed(fixed)

  return `${percentValue}%`
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function formatInfluxData(data) {
  const parseData = data.trim().split('\n')
  var filtered = parseData.filter((el, index) => {
    return el !== '' 
          && el !== ' ' 
          && index !== 0 
          && el.length !== 1 
          && el.length !== 0
          && el.split(',')[1] !== 'result'
  })

  return filtered
}

export function splitStsDataToArrays(filtered) {
  let structuredData = []
  let data=[]

  for(let i = 0; i < filtered.length; i++) {
    let nextCounter = i + 1

    if(i === filtered.length - 1) {
      nextCounter = i
    }

    const splited = filtered[i].split(',')
    const nextSplited = filtered[nextCounter].split(',')
      
    if(splited[6] === nextSplited[6] && i !== filtered.length - 1) {
      data.push({
        value: splited[4],
        date: splited[3],
        name: splited[6],
        measurement: splited[5],
        meter: splited[6],
        elapsed: splited[7],
      })
    } else {
      data.push({
        date: splited[3],
        value: splited[4],
        name: splited[6],
        measurement: splited[5],
        meter: splited[6],
        elapsed: splited[7],
      })
      structuredData.push(data)
      data = []
    }  
  }

  return structuredData
}

export function splitDataOnArrays (filtered) {
  let measurement = ''
  let structuredData = []
  let data=[]
  for(let i = 0; i < filtered.length; i++) {
    let nextCounter = i + 1

    if(i === filtered.length - 1) {
      nextCounter = i
    }

    const splited = filtered[i].split(',')
    const nextSplited = filtered[nextCounter].split(',')
      
    if(splited[3] === nextSplited[3] && i !== filtered.length - 1) {
      data.push({
        x: Number(moment(splited[7], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
        y: Number(Number(splited[6]).toFixed(2)),
      })
    } else {
      data.push({
        x: Number(moment(splited[7], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
        y: Number(Number(splited[6]).toFixed(2)),
      })
      structuredData.push({
        data: data,
        name: measurement,
        showInLegend: true,
        turboThreshold: 3000,
      })
      data = []
    } 
    measurement = splited[3] 
  }

  return structuredData
}

export function splitEnergyData (influxString) {
  let data = []
  const structuredData = []

  for(let i = 0; i < influxString.length; i++) {
    let nextCounter = i + 1

    if(i === influxString.length - 1) {
      nextCounter = i
    }

    const splited = influxString[i].split(',')
    const nextSplited = influxString[nextCounter].split(',')
      
    if(splited[3] === nextSplited[3] && i !== influxString.length - 1) {
      data.push({
        value: Number(splited[6]),
        date: moment(splited[7], 'YYYY-MM-DDT00:00:00Z').format('YYYY-MM-DD'),
        name: splited[3],
      })
    } else {
      data.push({
        date: moment(splited[7], 'YYYY-MM-DDT00:00:00Z').format('YYYY-MM-DD'),
        value: Number(splited[6]),
        name: splited[3],
      })
      structuredData.push(data)
      data = []
    }  
  }
  
  return structuredData
}

export function splitDataForLinechart(filtered) {
  let measurement = ''
  let structuredData = []
  let data=[]
  for(let i = 0; i < filtered.length; i++) {
    let nextCounter = i + 1

    if(i === filtered.length - 1) {
      nextCounter = i
    }

    const splited = filtered[i].split(',')
    const nextSplited = filtered[nextCounter].split(',')

    if(splited[4] === nextSplited[4] && i !== filtered.length - 2) {
      data.push({
        x: Number(moment(splited[8], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
        y: Number(Number(splited[7]).toFixed(2)),
      })
    } else {
      data.push({
        x: Number(moment(splited[8], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
        y: Number(Number(splited[7]).toFixed(2)),
      })
      structuredData.push({
        data: data,
        name: measurement,
        showInLegend: true,
        turboThreshold: 5000,
      })
      data = []
    } 
    measurement = splited[4] 
  }

  return structuredData
}

export function formatSTSSeries(data, end) {
  let lastTrue, lastFalse
  let fahuStsData = []
  let tempData = {}

  data.map((el,index) => {
    for(let i = 0; i< el.length; i++) {
      if(el[i].value === 'true') {
        if(i === el.length - 1) {
          if(lastFalse) {
            tempData.x2 = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            fahuStsData.push(tempData)
            tempData = {} 
          } else if(lastTrue) {
            tempData.x2 = Number(moment(end, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            tempData.color = '#00FF00'
            fahuStsData.push(tempData)
            tempData = {}
          } else {
            tempData.x = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            tempData.x2 = Number(moment(end, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            tempData.color = '#00FF00'
            tempData.y = index
            fahuStsData.push(tempData)
            tempData = {}
          }
        } else if(lastTrue) {
        } else if(lastFalse) {
          tempData.x2 = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
          fahuStsData.push(tempData)
          tempData = {} 

          tempData.x = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
          tempData.color = '#00FF00'
          tempData.y = index
          lastTrue = true
          lastFalse = false
        } else {
          tempData.x = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
          tempData.color = '#00FF00'
          tempData.y = index
          lastTrue = true
          lastFalse = false
        }
      }

      if(el[i].value === 'false') {
        if(i === el.length - 1) {
          if(lastTrue) {
            tempData.x2 = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            fahuStsData.push(tempData)
            tempData = {} 
          } else if(lastFalse) {
            tempData.x2 = Number(moment(end, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            fahuStsData.push(tempData)
            tempData = {}
          } else {
            tempData.x = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            tempData.x2 = Number(moment(end, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
            tempData.color = '#FF0000'
            tempData.y = index
            fahuStsData.push(tempData)
            tempData = {}
          }
        } else if(lastFalse) {
        } else if(lastTrue) {
          tempData.x2 = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
          fahuStsData.push(tempData)
          tempData = {} 

          tempData.x = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
          tempData.color = '#FF0000'
          tempData.y = index
          lastTrue = false
          lastFalse = true
        } else {
          tempData.x = Number(moment(el[i].date, 'YYYY-MM-DDTHH:mm:ssZ').format('x'))
          tempData.color = '#FF0000'
          tempData.y = index
          lastTrue = false
          lastFalse = true
        }
              
      }
    }
    lastFalse = false
    lastTrue = false
  })
  return fahuStsData
}

export function formatChwTemp(data) {
  let measurement = ''
  let structuredData = []
  let series=[]

  for(let i = 0; i < data.length; i++) {
    let nextCounter = i + 1

    if(i === data.length - 1) {
      nextCounter = i
    }

    const splited = data[i].split(',')
    const nextSplited = data[nextCounter].split(',')
      
    if(splited[3] === nextSplited[3] && i !== data.length - 1) {
      series.push({
        x: Number(moment(splited[8], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
        y: Number(Number(splited[7]).toFixed(2)),
      })
    } else {
      series.push({
        x: Number(moment(splited[8], 'YYYY-MM-DDTHH:mm:ssZ').format('x')),
        y: Number(Number(splited[7]).toFixed(2)),
      })
      structuredData.push({
        data: series,
        name: measurement,
        showInLegend: true,
        turboThreshold: 7000,
      })
      series = []
    } 
    measurement = splited[3] 
  }
  return structuredData
}

export function splitSfEfEnergy(data) {
  let measurement = ''
  let structuredData = []
  let series=[]

  for(let i = 0; i < data.length; i++) {
    let nextCounter = i + 1

    if(i === data.length - 1) {
      nextCounter = i
    }

    const splited = data[i].split(',')
    const nextSplited = data[nextCounter].split(',')
        
    if(splited[5] === nextSplited[5] && i !== data.length - 1) {
      series.push(Number(Number(splited[4]).toFixed(2)))
    } else {
      series.push(Number(Number(splited[4]).toFixed(2)))
      structuredData.push({
        data: series,
        name: measurement,
        showInLegend: true,
        turboThreshold: 7000,
      })
      series = []
    } 
    measurement = splited[5]
  }
    
  return structuredData
}
