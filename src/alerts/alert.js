import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'shards-react'


const ToastrAlert = ({ open, theme, text }) => {
  return (
    <Alert className='text-center m-0' style={{ zIndex: 10000 }} open={open} theme={theme}>
      {text}
    </Alert>
  )
}

export default connect(
  (state) => ({
    open: state.alerts.show,
    text: state.alerts.text,
    timeout: state.alerts.alertTimeout,
    theme: state.alerts.theme,
  }),
)(ToastrAlert) 
