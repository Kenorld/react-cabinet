import React, { PropTypes } from 'react';
import { observer } from 'mobx-react'
import {getValues} from '../utils'

@observer
class TextField extends React.Component {
    render() {
        const { source, record = {}, convert, elStyle } = this.props
        return <span style={elStyle}>{convert.apply(this, getValues(record, source))}</span>;
    }
}


TextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
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
