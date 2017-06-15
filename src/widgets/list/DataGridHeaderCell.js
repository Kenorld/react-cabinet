import React from 'react';
import PropTypes from 'prop-types'
import defaultsDeep from 'lodash.defaultsdeep';
import { TableHeaderColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';

const styles = {
    sortButton: {
        minWidth: 40,
    },
    nonSortableLabel: {
        position: 'relative',
        paddingLeft: 16,
        paddingRight: 16,
        verticalAlign: 'middle',
        letterSpacing: 0,
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: 14,
    },
};

const DataGridHeaderCell = ({ field, defaultStyle, currentSort, updateSort }) => {
    const style = defaultsDeep({}, field.props.headerStyle, field.type.defaultProps ? field.type.defaultProps.headerStyle : {}, defaultStyle);
    return (
        <TableHeaderColumn style={style}>
            {field.props.source ?
                <FlatButton
                    labelPosition="before"
                    onClick={updateSort}
                    data-sort={field.props.source}
                    label={field.props.label}
                    icon={field.props.source === currentSort || '-'+ field.props.source === currentSort ?
                        <ContentSort style={currentSort[0] !== '-' ? { transform: 'rotate(180deg)' } : {}} /> : false
                    }
                    style={styles.sortButton}
                />
                :
                (field.props.label && <span style={styles.nonSortableLabel}>{field.props.label || field.props.source}</span>)
            }
        </TableHeaderColumn>
    );
};

DataGridHeaderCell.propTypes = {
    field: PropTypes.element,
    defaultStyle: PropTypes.shape({
        th: PropTypes.object,
        'th:first-child': PropTypes.object,
        sortButton: PropTypes.object,
        nonSortableLabel: PropTypes.object,
    }),
    currentSort: PropTypes.string,
    updateSort: PropTypes.func.isRequired,
};

export default DataGridHeaderCell;
