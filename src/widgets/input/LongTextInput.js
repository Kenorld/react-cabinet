import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const LongTextInput = ({ input, label, meta: { touched, error }, options, source, elStyle }) => (
    <TextField
        {...input}
        multiLine
        fullWidth
        floatingLabelText={label}
        errorText={touched && error}
        style={elStyle}
        {...options}
    />
);

LongTextInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    source: PropTypes.string,
    validation: PropTypes.object,
};

LongTextInput.defaultProps = {
    options: {},
};

export default LongTextInput;
