import React, { Component } from 'react';
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';

/**
 * An Input component for a number
 *
 * @example
 * <NumberInput source="nb_views" />
 *
 * You can customize the `step` props (which defaults to "any")
 * @example
 * <NumberInput source="nb_views" step={1} />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
class NumberInput extends Component {
    /**
     * Necessary because of a React bug on <input type="number">
     * @see https://github.com/facebook/react/issues/1425
     */
    handleBlur = () => {
        this.props.input.onChange(parseFloat(this.props.input.value));
    }

    render() {
        const { elStyle, input, label, meta: { touched, error }, options, source, step } = this.props;
        return (
            <TextField
                value={input.value}
                onChange={input.onChange}
                onBlur={this.handleBlur}
                type="number"
                step={step}
                floatingLabelText={label}
                errorText={touched && error}
                style={elStyle}
                {...options}
            />
        );
    }
}

NumberInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object,
    source: PropTypes.string,
    step: PropTypes.string.isRequired,
    validation: PropTypes.object,
};

NumberInput.defaultProps = {
    options: {},
    step: 'any',
};

export default NumberInput;
