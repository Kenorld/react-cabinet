import React from 'react';
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import {getValues} from '../utils'

@observer
class TextField extends React.Component {
    render() {
        const { source, record = {}, convert, style } = this.props
        return <span style={style}>{convert.apply(this, getValues(record, source))}</span>;
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
    addLabel: true,
    convert: function (value) {
        return value
    }
};

export default TextField;
