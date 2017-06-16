import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { observable } from "mobx"
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField';
import { collectProps, fetchValue, writeValue } from '../utils'

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
    /**
     * Necessary because of a React bug on <input type="number">
     * @see https://github.com/facebook/react/issues/1425
     */
    handleBlur = () => {
        this.props.onChange(event, this.props.source, event.target.value);
    }

    handleChange = (event) => {
        this.props.writeValue(this, event.target.value)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, event.target.value)
        }
    }

    render() {
        const { label, fetchValue } = this.props;
        return (
            <TextField
                {...collectProps(this.props, TextField.propTypes) }
                value={fetchValue(this)}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                type="number"
                floatingLabelText={label}
            />
        );
    }
}

NumberInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    record: PropTypes.object,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
    step: PropTypes.string.isRequired,
    validation: PropTypes.object,
};

NumberInput.defaultProps = {
    record: { "_": "" },
    source: "_",
    step: 'any',
    fetchValue: fetchValue,
    writeValue: writeValue
};

export default NumberInput;
