import React from 'react';
import PropTypes from 'prop-types'
import get from 'lodash.get'
import set from 'lodash.set'
import { observable } from "mobx"
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField';

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
class TextInput extends React.Component {
    @observable record

    handleChange = (event) => {
        this.props.writeValue(this, event.target.value)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, event.target.value)
        }
    }

    componentWillMount() {
        this.record = this.props.record
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.record = nextProps.record
        }
    }
    render() {
        const { onChange, label, meta: { touched, error }, disabled, options, type, source, elStyle } = this.props
        return <TextField
            value={this.props.fetchValue(this)}
            disabled={disabled}
            onChange={this.handleChange}
            type={type}
            floatingLabelText={<span>{label}</span>}
            style={elStyle}
            {...options}
        />
    }
}

TextInput.propTypes = {
    elStyle: PropTypes.object,
    onChange: PropTypes.func,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
    type: PropTypes.string,
    validation: PropTypes.object,
};

TextInput.defaultProps = {
    options: {},
    meta: {},
    record: { "_": "" },
    source: "_",
    disabled: false,
    type: 'text',
    fetchValue: function (element) {
        const value = get(element.record, element.props.source)
        return value === undefined ? "" : value
    },
    writeValue: function (element, value) {
        set(element.record, element.props.source, value)
    }
};

export default TextInput;
