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
 * <EmailInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <EmailInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
@observer
class EmailInput extends Component {
    @observable value = ''

    componentDidMount() {
        this.value = fetchValue(this)
    }
    handleChange = (event) => {
        this.value = event.target.value
        const value = this.value.trim()
        if (value[value.length - 1] !== ','){
            this.props.writeValue(this, event.target.value)
        }
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, event.target.value)
        }
    }

    render() {
        const { fetchValue, label, style, type, disabled } = this.props
        return <TextField
            label={label}
            style={style}
            type={type}
            disabled={disabled}
            value={this.value}
            onChange={this.handleChange}
            floatingLabelText={<span>{label}</span>}
        />
    }
}

EmailInput.propTypes = {
    style: PropTypes.object,
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    allowMultiple: PropTypes.bool,
    record: PropTypes.object,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
    type: PropTypes.string,
    convert: PropTypes.object,
};

EmailInput.defaultProps = {
    record: { "_": "" },
    source: "_",
    disabled: false,
    allowMultiple: false,
    type: 'text',
    fetchValue: fetchValue,
    writeValue: writeValue,
    convert: {
        fetch: function(value){
            return (value||['']).join(', ')
        },
        write: function(raw){
            return (raw||'').split(/\s*[,;]\s*/).filter((value)=> {return value !== "" && value !== undefined})
        }
    }
};

export default EmailInput;
