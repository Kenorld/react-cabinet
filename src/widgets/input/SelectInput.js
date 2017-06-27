import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import set from 'lodash.set'
import { observable } from "mobx"
import { observer } from 'mobx-react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { fetchValue, writeValue } from '../utils'

/**
 * An Input component for a select box, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <SelectInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectInput source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The object passed as `options` props is passed to the material-ui <SelectField> component
 */
@observer
class SelectInput extends Component {
    @observable record
    handleChange = (event, index, value) => {
        this.props.writeValue(this, value)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, value)
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
        const { allowEmpty, choices, source, style, disabled } = this.props
        return (
            <SelectField
            disabled={disabled}
                value={this.props.fetchValue(this)}
                menuStyle={{ maxHeight: '41px', overflowY: 'hidden' }}
                floatingLabelText={label}
                onChange={this.handleChange}
                autoWidth
                style={style}
            >
                {allowEmpty &&
                    <MenuItem value={null} primaryText="" />
                }
                {choices.map(choice =>
                    <MenuItem key={choice.id} value={choice.id} primaryText={choice.name} />
                )}
            </SelectField>
        );
    }
}

SelectInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    style: PropTypes.object,
    record: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.string,
    source: PropTypes.string,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
};

SelectInput.defaultProps = {
    allowEmpty: false,
    record: { "_": "" },
    source: "_",
    choices: [],
    options: {},
    fetchValue: function(element){
        const value = get(element.record, element.props.source)
        return value === undefined ? "" : value
    },
    writeValue: function(element, value){
        set(element.record, element.props.source, value)
    }
};

export default SelectInput;
