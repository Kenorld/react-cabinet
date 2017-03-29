import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';
import {getUIURL} from '../../url'

const ListButton = ({ entityName = '' }) => <FlatButton
    primary
    label="List"
    icon={<ActionList />}
    containerElement={<Link to={getUIURL(entityName, 'list')} />}
    style={{ overflow: 'inherit' }}
/>;

ListButton.propTypes = {
    linkUrl: PropTypes.string,
};

export default ListButton;
