import React from 'react';
import PropTypes from 'prop-types'
import SelectInput from './SelectInput';
import { fetchValue, writeValue } from '../utils'

const NullableBooleanInput = ({ input, label, source, style }) => (
    <SelectInput
        input={input}
        label={label}
        choices={[
            { id: null, name: '' },
            { id: false, name: 'No' },
            { id: true, name: 'Yes' },
        ]}
        style={style}
    />
);

NullableBooleanInput.propTypes = {
    style: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string,
};

NullableBooleanInput.defaultProps = {
};

export default NullableBooleanInput;
