import React from 'react';
import PropTypes from 'prop-types'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { getValues } from '../utils'

import FalseIcon from 'material-ui/svg-icons/content/clear';
import TrueIcon from 'material-ui/svg-icons/action/done';

@observer
class BooleanField extends React.Component {
    @computed get value() {
        const { convert, record, source } = this.props
        return convert.apply(this, getValues(record, source))
    }
    render() {
        const { addLabel, label, style } = this.props
        const value = this.value
        let icon = value ? <TrueIcon /> : <FalseIcon />
        if (!addLabel || !label) {
            return <span style={style}>{icon}</span>
        } else {
            return <span>{label}: {icon}</span>
        }
    }
}

BooleanField.propTypes = {
    addLabel: PropTypes.bool,
    style: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    convert: PropTypes.func.isRequired,
};

BooleanField.defaultProps = {
    addLabel: false,
    // style: {
    //     display: 'block',
    //     margin: 'auto',
    // },
    convert: function (value) {
        return value
    },
};

export default BooleanField;
