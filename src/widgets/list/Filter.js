import React from 'react';
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

@observer
class Filter extends React.Component {
    render() {
        const { entityName, context, children, showFilter, hideFilter, shownFilters, filterValues, searchValue, onChange } = this.props
        return (
            context === 'form' ?
                <FilterForm
                    entityName={entityName}
                    filters={React.Children.toArray(children)}
                    hideFilter={hideFilter}
                    onChange={onChange}
                    searchValue={searchValue}
                    shownFilters={shownFilters}
                    initialValues={filterValues}
                /> :
                <FilterButton
                    entityName={entityName}
                    filters={React.Children.toArray(children)}
                    showFilter={showFilter}
                    shownFilters={shownFilters}
                    filterValues={filterValues}
                />
        )
    }
}

Filter.propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func,
    entityName: PropTypes.string.isRequired,
    context: React.PropTypes.oneOf(['form', 'button']),
    showFilter: React.PropTypes.func,
    hideFilter: React.PropTypes.func,
    shownFilters: PropTypes.object,
    filterValues: PropTypes.object,
};

export default Filter;
