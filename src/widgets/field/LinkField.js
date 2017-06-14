import React from 'react';
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { getValues } from '../utils'

@observer
class LinkField extends React.Component {
    render() {
        let { source, record = {}, elStyle, convert, target } = this.props
        const value = convert.apply(this, getValues(record, source))
        return <a href={value.href||value} style={elStyle} target={target}>
            {value.text||value}
        </a>
    }
}

LinkField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    text: PropTypes.string,
    target: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    convert: PropTypes.func.isRequired,
};

LinkField.defaultProps = {
    addLabel: true,
    target: '_blank',
    convert: function (href) {
        return { href: href, text: this.props.text || href }
    },
};

export default LinkField;
