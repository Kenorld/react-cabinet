import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {observable} from "mobx"
import { observer } from 'mobx-react'
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';

@observer
export class FilterButton extends Component {
    @observable open = false
    @observable anchorEl = null

    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    getHiddenFilters() {
        const { filters, shownFilters, filterValues } = this.props;
        return filters
            .filter(filterElement =>
                !filterElement.props.alwaysOn &&
                !shownFilters[filterElement.props.source] &&
                !filterValues[filterElement.props.source]
            );
    }

    handleTouchTap(event) {
        event.preventDefault();

        this.open = true
        this.anchorEl = event.currentTarget
    }

    handleRequestClose() {
        this.open = false
    }

    handleShow(event) {
        this.props.showFilter(event.currentTarget.dataset.key);
        this.open = false
    }

    render() {
        const hiddenFilters = this.getHiddenFilters();
        return (hiddenFilters.length > 0 && <div style={{ display: 'inline-block' }}>
            <FlatButton primary label="Add Filter" icon={<ContentFilter />} onTouchTap={this.handleTouchTap} />
            <Popover
                open={this.open}
                anchorEl={this.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleRequestClose}
            >
                <Menu>
                    {hiddenFilters.map(filterElement =>
                        <MenuItem data-key={filterElement.props.source} key={filterElement.props.source} primaryText={filterElement.props.label} onTouchTap={this.handleShow} />
                    )}
                </Menu>
            </Popover>
        </div>);
    }
}

FilterButton.propTypes = {
    entityName: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    shownFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
};

FilterButton.defaultProps = {
    filterValues: {},
};

export default FilterButton;
