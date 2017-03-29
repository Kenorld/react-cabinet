import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import {getUIURL} from '../../url'

const EditButton = ({ entityName = '', record = {} }) => <FlatButton
    primary
    label="Edit"
    icon={<ContentCreate />}
    containerElement={<Link to={getUIURL(entityName, 'edit', record.id)} />}
    style={{ overflow: 'inherit' }}
/>;

EditButton.propTypes = {
    entityName: PropTypes.string,
    record: PropTypes.object,
};

export default EditButton;
