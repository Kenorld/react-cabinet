import React from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { ListButton, ShowButton, DeleteButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const EditActions = ({ entityName, record, hasDelete, hasList, hasShow, refresh }) => (
    <CardActions style={cardActionStyle}>
        {hasShow && <ShowButton entityName={entityName} record={record} />}
        {hasList && <ListButton entityName={entityName} />}
        {hasDelete && <DeleteButton entityName={entityName} record={record} />}
        <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
    </CardActions>
);

export default EditActions;
