import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import CreateButton from '../button/CreateButton';
import DeleteAllButton from '../button/DeleteAllButton';
import { getStore } from '../../stores'
import { observer } from 'mobx-react'

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

@observer
export default class Actions extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {entityName, filters, shownFilters, filterValues, deleteRecords, hasCreate, hasDelete, refresh, searchValue, showFilter} = this.props

        return <CardActions style={cardActionStyle}>
            {filters && React.cloneElement(filters, { entityName, showFilter, shownFilters, searchValue, filterValues, context: 'button' }) }
            {hasDelete && deleteRecords.length>0 && <DeleteAllButton entityName={entityName} deleteRecords={deleteRecords}/>}
            {hasCreate && <CreateButton entityName={entityName} />}
            {refresh && <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />}
        </CardActions>
    }
};
