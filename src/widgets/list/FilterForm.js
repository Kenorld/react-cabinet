import React, { Component, PropTypes } from 'react';
import { observable } from "mobx"
import { observer } from 'mobx-react'
import MobxReactForm from 'mobx-react-form';
import { CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui/svg-icons/action/highlight-off';

@observer
export class FilterForm extends Component {
    @observable record
    getShownFilters() {
        const { filters, shownFilters, initialValues } = this.props;
        return filters
            .filter(filterElement =>
                filterElement.props.alwaysOn ||
                shownFilters[filterElement.props.source] ||
                initialValues[filterElement.props.source]
            );
    }

    handleHide = (event) => this.props.hideFilter(event.currentTarget.dataset.key);

    render() {
        const { entityName } = this.props;
        const createChangeHandler = (element) => {
            return (e, source, value) => {
                if (this.props.onChange) {
                    this.props.onChange(e, element.props.source, value)
                }
                if (element.props.onChange) {
                    element.props.onChange(e, element.props.source, value)
                }
            }
        }
        const getFilterElementProps = (filterElement) => {
            let source = filterElement.props.source || '_'
            let value = source === '_' ? this.props.searchValue : this.props.initialValues[filterElement.props.source]
            return {
                entityName: entityName,
                record: { [source]: value },
                onChange: createChangeHandler(filterElement)
            }
        }
        return <div>
            <CardText style={{ float: 'right', marginTop: '-14px', paddingTop: 0 }}>
                {this.getShownFilters().reverse().map(filterElement =>
                    <div key={filterElement.props.source} style={filterElement.props.style || { display: 'inline-block' }}>
                        {filterElement.props.alwaysOn ?
                            <div style={{ width: 48, display: 'inline-block' }}>&nbsp;</div> :
                            <IconButton iconStyle={{ color: '#00bcd4' }} onTouchTap={this.handleHide} data-key={filterElement.props.source} tooltip="Remove this filter">
                                <ActionHide />
                            </IconButton>
                        }
                        <div style={{ display: 'inline-block' }}>
                            {React.cloneElement(filterElement, getFilterElementProps(filterElement))}
                        </div>
                    </div>
                )}
            </CardText>
            <div style={{ clear: 'right' }} />
        </div>
    }
}

FilterForm.propTypes = {
    entityName: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    shownFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    searchValue: PropTypes.string,
};

export default FilterForm;
