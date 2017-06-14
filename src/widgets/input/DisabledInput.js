import React from 'react';
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';
import get from 'lodash.get';

const DisabledInput = ({ label, record, source }) => <TextField
    value={get(record, source)}
    floatingLabelText={label}
    disabled
/>;

DisabledInput.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string,
};

export default DisabledInput;
