import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { observable } from "mobx"
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField';
import { fetchValue, writeValue } from '../utils'

/**
 * An Input component for a string
 *
 * @example
 * <TextInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <TextInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
@observer
class TextInput extends Component {
    handleChange = (event) => {
        this.props.writeValue(this, event.target.value)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, event.target.value)
        }
    }

    render() {
        const { fetchValue, label, style, type, disabled} = this.props
        return <TextField
            label={label}
            style={style}
            type={type}
            disabled={disabled}
            value={fetchValue(this)}
            onChange={this.handleChange}
            floatingLabelText={<span>{label}</span>}
        />
    }
}

TextInput.propTypes = {
    style: PropTypes.object,
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    record: PropTypes.object,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
    type: PropTypes.string,
    convert: PropTypes.object,
};

TextInput.defaultProps = {
    record: { "_": "" },
    source: "_",
    disabled: false,
    type: 'text',
    fetchValue: fetchValue,
    writeValue: writeValue,
    // convert: {
    //     fetch: function(value){
    //         return value
    //     },
    //     write: function(value){
    //         return value
    //     }
    // }
};

export default TextInput;
