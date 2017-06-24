import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import CreateButton from '../button/CreateButton';
import { getStore } from '../../stores'

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const Actions = ({ entityName, filters, shownFilters, filterValues, hasCreate, refresh, searchValue, showFilter }) => (
    <CardActions style={cardActionStyle}>
        {filters && React.cloneElement(filters, { entityName, showFilter, shownFilters, searchValue, filterValues, context: 'button' }) }
        {hasCreate && <CreateButton entityName={entityName} />}
        {refresh && <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />}
    </CardActions>
);

export default Actions;
