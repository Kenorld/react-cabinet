import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import ActionButton from './ActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { getUIURL } from '../../url'

const CreateButton = ({ entityName }) => <ActionButton
    label="Create"
    icon={<ContentAdd />}
    containerElement={<Link to={getUIURL(entityName, 'create')} />}
/>;

CreateButton.propTypes = {
    entityName: PropTypes.string,
};

export default CreateButton;
