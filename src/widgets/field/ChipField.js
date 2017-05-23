import React, { PropTypes } from 'react';
import { observer } from 'mobx-react'
import Chip from 'material-ui/Chip';
import get from 'lodash.get';

@observer
class ChipField extends React.Component {
    render() {
        let { source, record = {}, elStyle = { margin: 4 } } = this.props
        return <Chip style={elStyle}>{get(record, source)}</Chip>
    }
}

ChipField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

ChipField.defaultProps = {
    addLabel: true,
};

export default ChipField;
