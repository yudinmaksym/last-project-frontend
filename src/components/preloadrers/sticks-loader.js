import React from 'react'
import { connect } from 'react-redux'


const StickLoader = ({ showStickLoader }) => {
  return (
    <>
      {showStickLoader && <div className="stick-loader">
        <div className="loader">Loading...</div>
      </div>}
    </>
  )
}

export const PureStickLoader = StickLoader

export default connect(
  (state) => ({
    showStickLoader: state.loaders.showStickLoader,
  })
)(StickLoader)