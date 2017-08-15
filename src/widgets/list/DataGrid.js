import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { PropTypes as MobxTypes } from 'mobx-react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import DataGridCell from './DataGridCell';
import DataGridHeaderCell from './DataGridHeaderCell';
import { fetchValue, writeValue } from '../utils'

const defaultStyles = {
    table: {
        backgroundColor: '#fff',
        padding: '0px 24px',
        width: '100%',
        borderCollapse: 'collapse',
        borderSpacing: 0,
    },
    tbody: {
        height: 'inherit',
    },
    tr: {
        borderBottom: '1px solid rgb(224, 224, 224)',
        color: 'rgba(0, 0, 0, 0.870588)',
        height: 48,
    },
    header: {
        th: {
            padding: 0,
        },
        'th:first-child': {
            padding: '0 0 0 12px',
        },
    },
    cell: {
        td: {
            padding: '0 12px',
            whiteSpace: 'normal',
        },
        'td:first-child': {
            padding: '0 12px 0 16px',
            whiteSpace: 'normal',
        },
    },
};

/**
 * The DataGrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - styles
 *  - rowStyle
 *
 * @example Display all posts as a datagrid
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <DataGrid rowStyle={postRowStyle}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </DataGrid>
 *     </List>
 * );
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <DataGrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </DataGrid>
 * </ReferenceManyField>
 */
@observer
class DataGrid extends Component {
    @observable selectedRecords = []

    updateSort = (event) => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    }

    handleRowSelection = (selectedRows) => {
        if (selectedRows === 'all') {
            this.selectedRecords = this.props.records
        } else if (selectedRows === 'none') {
            this.selectedRecords = []
        } else {
            this.selectedRecords = selectedRows.map((index) => {
                return this.props.records[index]
            })
        }
        if (this.props.handleSelectRecord) {
            this.props.handleSelectRecord(this.selectedRecords, this)
        }
    }

    render() {
        const { entityName, children, records, currentSort, styles = defaultStyles, rowStyle, enableSelectAll, allRowsSelected, multiSelectable, selectable } = this.props;
        return (
            <Table style={styles.table}
                allRowsSelected={allRowsSelected}
                selectable={selectable}
                multiSelectable={multiSelectable}
                onRowSelection={this.handleRowSelection}>
                <TableHeader displaySelectAll={enableSelectAll && multiSelectable} enableSelectAll={enableSelectAll} adjustForCheckbox={multiSelectable || selectable}>
                    <TableRow style={styles.tr}>
                        {React.Children.map(children, (field, index) => (
                            <DataGridHeaderCell
                                key={field.props.source || index}
                                field={field}
                                defaultStyle={index === 0 ? styles.header['th:first-child'] : styles.header.th}
                                currentSort={currentSort}
                                updateSort={this.updateSort}
                            />
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody style={styles.tbody} deselectOnClickaway={false} displayRowCheckbox={multiSelectable || selectable}>
                    {records.map((record, rowIndex) => (
                        <TableRow style={rowStyle ? rowStyle(record, rowIndex) : styles.tr} key={record.id}>
                            {React.Children.map(children, (field, index) => (
                                <DataGridCell
                                    key={`${record.id}-${field.props.source || index}`}
                                    defaultStyle={index === 0 ? styles.cell['td:first-child'] : styles.cell.td}
                                    {...{ field, entityName, record }}
                                />
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

DataGrid.propTypes = {
    entityName: PropTypes.string,
    records: MobxTypes.arrayOrObservableArray.isRequired,
    currentSort: PropTypes.string,
    setSort: PropTypes.func,
    styles: PropTypes.object,
    rowStyle: PropTypes.func,
    // displaySelectAll: PropTypes.bool,
    enableSelectAll: PropTypes.bool,
    // adjustForCheckbox: PropTypes.bool,
    allRowsSelected: PropTypes.bool,
    multiSelectable: PropTypes.bool,
    selectable: PropTypes.bool,
    handleSelectRecord: PropTypes.func,
    // stripedRows: PropTypes.bool,
    // showRowHover: PropTypes.bool,
};

DataGrid.defaultProps = {
    records: [],
    // displaySelectAll: true,
    // adjustForCheckbox: true,
    allRowsSelected: false,
    multiSelectable: true,
    selectable: true,
    enableSelectAll: true,

    // stripedRows: false,
    // showRowHover: false,

    rowStyle: function (record, index) {
        return index % 2 === 0 ? defaultStyles.tr : { ...defaultStyles.tr, backgroundColor: '#eee' }
    }
};

export default DataGrid;
