import React, { PropTypes } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import { TableRowColumn } from 'material-ui/Table';

const DataGridCell = ({ field, record, entityName, defaultStyle }) => {
    const style = defaultsDeep({}, field.props.style, field.type.defaultProps ? field.type.defaultProps.style : {}, defaultStyle);
    return (
        <TableRowColumn style={style}>
            <field.type {...field.props} {...{ record, entityName }} />
        </TableRowColumn>
    );
};

DataGridCell.propTypes = {
    field: PropTypes.element,
    record: PropTypes.object,
    entityName: PropTypes.string,
    defaultStyle: PropTypes.shape({
        td: PropTypes.object,
        'td:first-child': PropTypes.object,
    }),
};

export default DataGridCell;
