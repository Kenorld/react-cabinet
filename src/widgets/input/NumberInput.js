import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { observable } from "mobx"
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField';
import { fetchValue, writeValue } from '../utils'

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
@observer
class NumberInput extends Component {
    // /**
    //  * Necessary because of a React bug on <input type="number">
    //  * @see https://github.com/facebook/react/issues/1425
    //  */
    // handleBlur = () => {
    //     this.props.handleChange(event);
    // }

    handleChange = (event, value) => {
        this.props.writeValue(this, value)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, value)
        }
    }

    render() {
        const { label, fetchValue, step, style, disabled } = this.props;
        return (
            <TextField
                disabled={disabled}
                style={style}
                value={fetchValue(this)}
                onChange={this.handleChange}
                step={step}
                type="number"
                floatingLabelText={label}
            />
        );
    }
}

NumberInput.propTypes = {
    style: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    record: PropTypes.object,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
    step: PropTypes.string.isRequired,
    validation: PropTypes.object,
    max: PropTypes.number,
    min: PropTypes.number,
};

NumberInput.defaultProps = {
    onBlur: () => { },
    record: { "_": "" },
    source: "_",
    disabled: false,
    step: 'any',
    fetchValue: fetchValue,
    writeValue: writeValue
};

export default NumberInput;
