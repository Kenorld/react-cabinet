import React from 'react';
import PropTypes from 'prop-types'
import SelectInput from './SelectInput';
import { collectProps, fetchValue, writeValue } from '../utils'

const NullableBooleanInput = ({ input, meta: { touched, error }, label, source, elStyle }) => (
    <SelectInput
        input={input}
        label={label}
        choices={[
            { id: null, name: '' },
            { id: false, name: 'No' },
            { id: true, name: 'Yes' },
        ]}
        errorText={touched && error}
        style={elStyle}
    />
);

NullableBooleanInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    source: PropTypes.string,
};

NullableBooleanInput.defaultProps = {
};

export default NullableBooleanInput;
