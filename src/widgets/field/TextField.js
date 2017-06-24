import React from 'react';
import PropTypes from 'prop-types'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { getValues } from '../utils'

@observer
class TextField extends React.Component {
    @computed get value() {
        const { convert, record, source } = this.props
        return convert.apply(this, getValues(record, source))
    }
    render() {
        const { addLabel, label } = this.props
        if (!addLabel || !label) {
            return <span style={this.props.style}>{this.value}</span>
        } else {
            return <div style={this.props.style}><span>{label}:</span> <span>{this.value}</span></div>
        }
    }
}

TextField.propTypes = {
    addLabel: PropTypes.bool,
    style: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    convert: PropTypes.func.isRequired
};

TextField.defaultProps = {
    addLabel: false,
    label: '',
    convert: function (value) {
        return value
    }
};

export default TextField;