import React, { PropTypes } from 'react';
import { observer } from 'mobx-react'
import get from 'lodash.get';

@observer
class EmailField extends React.Component {
    render() {
        let { source, record = {}, convert, elStyle } = this.props
        return <a style={elStyle} href={`mailto:${get(record, source)}`}>{convert(get(record, source))}</a>
    }
}

EmailField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    convert: PropTypes.func.isRequired
};

EmailField.defaultProps = {
    addLabel: true,
    convert: function (value) {
        return value
    },
};

export default EmailField;
