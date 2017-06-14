import React from 'react';
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import get from 'lodash.get';

export const removeTags = input => input.replace(/<[^>]+>/gm, '');

@observer
class RichTextField extends React.Component {
    render() {
        let { source, record = {}, stripTags, elStyle } = this.props
        const value = this.props.convert(get(record, source));
        if (stripTags) {
            return <div style={elStyle}>{removeTags(value)}</div>;
        }

        return <div style={elStyle} dangerouslySetInnerHTML={{ __html: value }}></div>
    }
}

RichTextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    stripTags: PropTypes.bool,
    convert: PropTypes.func.isRequired
};

RichTextField.defaultProps = {
    addLabel: true,
    stripTags: false,
    convert: function (value) {
        return value
    }
};

export default RichTextField;
