import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';
import {getUIURL} from '../../url'

const ShowButton = ({ entityName = '', record = {} }) => <FlatButton
    primary
    label="Show"
    icon={<ImageEye />}
    containerElement={<Link to={`${getUIURL(entityName, 'edit', record.id)}/show`} />}
    style={{ overflow: 'inherit' }}
/>;

ShowButton.propTypes = {
    entityName: PropTypes.string,
    record: PropTypes.object,
};

export default ShowButton;
