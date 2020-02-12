import React from 'react'


const CircleLoader = ({ show }) => {
  return (
    <>
      {show
      && <div className='stick-loader'>
        <div className="loader-1 center">
          <span></span>
        </div>
      </div>
      }
    </>
  )
}

export default CircleLoader