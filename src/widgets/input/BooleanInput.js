import React from 'react';
import PropTypes from 'prop-types'
import Toggle from 'material-ui/Toggle';

const styles = {
    block: {
        margin: '1rem 0',
        maxWidth: 250,
    },
    label: {
        color: 'rgba(0, 0, 0, 0.298039)',
    },
    toggle: {
        marginBottom: 16,
    },
};

const BooleanInput = ({ input, label, source, elStyle }) => (
    <div style={elStyle || styles.block}>
        <Toggle
            defaultToggled={!!input.value}
            onToggle={input.onChange}
            labelStyle={styles.label}
            style={styles.toggle}
            label={label}
        />
    </div>
);

BooleanInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string,
};

export default BooleanInput;
