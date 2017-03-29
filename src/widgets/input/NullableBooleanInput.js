import React, { PropTypes } from 'react';
import SelectInput from './SelectInput';

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
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    source: PropTypes.string,
};

NullableBooleanInput.defaultProps = {
    addField: true,
};

export default NullableBooleanInput;
