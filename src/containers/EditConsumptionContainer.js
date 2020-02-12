import * as React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { 
  update,
  getData, 
  getLoading,
} from '../../redux/reducers/meters'
import MeterForm, { FORM_KEY } from '../forms/MeterForm'


class EditConsumptionContainer extends React.Component {

  handleSubmit = (data) => {
    delete data.id
    return this.props.update(this.props.id, data)
  }

  render() {
    return (
      <div className="edit-meter mb-4">
        {!this.props.loading && (
          <MeterForm 
            initialValues={this.props.data}
            invoiceType={this.props.invoiceType}
            onSubmit={this.handleSubmit}
          />
        )}
      </div>
    )
  }

}

const selector = formValueSelector(FORM_KEY)

export default connect(
  (state) => ({
    data: getData(state),
    loading: getLoading(state),
    invoiceType: selector(state, 'invoice_type'),
  }), 
  (dispatch) => ({
    update: (id, data) => dispatch(update(id, data)),
  })
)(EditConsumptionContainer)