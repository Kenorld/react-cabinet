import React, { Component } from 'react';
import PropTypes from 'prop-types'
import DatePicker from 'material-ui/DatePicker';
import { fetchValue, writeValue } from '../utils'

export const datify = input => {
    if (!input) {
        return null;
    }

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${input}`);
    }

    return date;
};

class DateInput extends Component {
    handleChange = (event, date) => {
        this.props.writeValue(this, date)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, date)
        }
    }

    render() {
        const { fetchValue, label, disabled } = this.props
        return (<DatePicker
            disabled={disabled}
            floatingLabelText={label}
            DateTimeFormat={Intl.DateTimeFormat}
            container="inline"
            autoOk
            value={datify(fetchValue(this))}
            onChange={this.handleChange}
        />);
    }
}

DateInput.propTypes = {
    style: PropTypes.object,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
};

DateInput.defaultProps = {
    record: { "_": "" },
    source: "_",
    disabled: false,
    fetchValue: fetchValue,
    writeValue: writeValue
};

export default DateInput;
