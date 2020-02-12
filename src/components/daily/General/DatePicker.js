import React from 'react';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';

var moment = require('moment');

const DatePicker = props => {
    return (
        <>
            {props.label && <p className="mb-1"><small>{props.label}</small></p>}
            <DateRangePicker
                onApply={(e, data) => props.onApply(data.startDate, data.endDate)}
                ranges={props.pickerRanges}
                alwaysShowCalendars={true}
                style={{ flex: 1 }}
                id={props.name}
                name={props.name}
                maxDate={moment()}
            >
                {props.children}
            </DateRangePicker>
        </>
    )
}

DatePicker.defaultProps = {
    onApply: () => { },
    pickerRanges: {
        'This Week': [moment().startOf('week'), moment().endOf('week')],
        'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    },

}

export default DatePicker;