import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import {getUIURL} from '../../url'

const EditButton = ({ entityName = '', record = {}, label, action }) => <FlatButton
    primary
    label={label}
    icon={<ContentCreate />}
    containerElement={<Link to={getUIURL(entityName, action, record.id)} />}
    style={{ overflow: 'inherit' }}
/>;

EditButton.propTypes = {
    entityName: PropTypes.string,
    record: PropTypes.object,
    label: PropTypes.string,
    action: PropTypes.string,
};
EditButton.defaultProps = {
    label: 'Edit',
    action: 'edit'
}

export default EditButton;
