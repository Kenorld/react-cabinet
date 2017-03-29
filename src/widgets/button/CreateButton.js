import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { getUIURL } from '../../url'

const CreateButton = ({ entityName }) => <FlatButton
    primary
    label="Create"
    icon={<ContentAdd />}
    containerElement={<Link to={getUIURL(entityName, 'create')} />}
    style={{ overflow: 'inherit' }}
/>;

CreateButton.propTypes = {
    entityName: PropTypes.string,
};

export default CreateButton;
