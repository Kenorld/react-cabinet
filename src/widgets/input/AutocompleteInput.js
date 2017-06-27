import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import { getStore } from '../../stores'

/**
 * An Input component for an autocomplete field, using an array of objects for the options
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
 * <AutoCompleteInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutoCompleteInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutoCompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * You can customize the `filter` function used to filter the results.
 * By default, it's `AutoComplete.fuzzyFilter`, but you can use any of
 * the functions provided by `AutoComplete`, or a function of your own
 * @see http://www.material-ui.com/#/components/auto-complete
 * @example
 * import { Edit, SimpleForm, AutoCompleteInput } from 'react-cabinet/components';
 * import AutoComplete from 'material-ui/AutoComplete';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <AutoCompleteInput source="category" filter={AutoComplete.caseInsensitiveFilter} choices={choices} />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * The object passed as `options` props is passed to the material-ui <AutoComplete> component
 *
 * @example
 * <AutoCompleteInput source="author_id" options={{ fullWidth: true }} />
 */

@observer
class AutoCompleteInput extends Component {
    @observable dataSource = []
    @observable selectedText = ''
    handleNewRequest = (chosenRequest, index) => {
        if (index !== -1) {
            const { dataSourceConfig, input, record, source } = this.props
            record[source] = this.dataSource[index][dataSourceConfig.value]
        }
        if (this.props.onNewRequest) {
            this.props.onNewRequest(chosenRequest, index)
        }
    }

    handleUpdateInput = (searchText) => {
        const { reference, maxSearchResults, dataSourceConfig } = this.props
        if (reference) {
            getStore(reference.entityName).list(maxSearchResults, 0, "", reference.filter, searchText).then((data) => {
                this.dataSource = data.records
            })
        }
        if (this.props.onUpdateInput) {
            this.props.onUpdateInput(searchText)
        }
    }

    render() {
        const { label, source, record, reference, disabled } = this.props;
        if (record[source] && reference) {
            getStore(reference.entityName).read(record[source]).then((item) => {
                if (item[reference.text] !== this.selectedText) {
                    this.selectedText = item[reference.text]
                }
            });
        }
        let dataSourceConfig = this.props.dataSourceConfig
        if (reference) {
            dataSourceConfig.value = reference.value
            dataSourceConfig.text = reference.text
        }
        return (
            <AutoComplete
                dataSource={toJS(this.dataSource)}
                dataSourceConfig={dataSourceConfig}
                searchText={this.selectedText}
                floatingLabelText={label}
                disabled={disabled}
                onNewRequest={this.handleNewRequest}
                onUpdateInput={this.handleUpdateInput}
                openOnFocus
            />
        );
    }
}

AutoCompleteInput.propTypes = Object.assign({}, AutoComplete.propTypes, {
    filter: PropTypes.func.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    source: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.object,
})

AutoCompleteInput.defaultProps = Object.assign({}, AutoComplete.defaultProps, {
    filter: AutoComplete.fuzzyFilter,
    record: { "_": "" },
    dataSource: [],
    dataSourceConfig: { value: 'id', text: 'name' },
})

export default AutoCompleteInput;
