import React from 'react';
import PropTypes from 'prop-types'
import get from 'lodash.get'

/**
 * Iterator component to be used to display a list of records, using a single field
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 */
const SingleFieldList = ({ ids, data, entityName, basePath, children }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {ids.map(id =>
            React.cloneElement(children, {
                key: id,
                record: get(data,id),
                entityName,
                basePath,
            })
        )}
    </div>
);

SingleFieldList.propTypes = {
    children: PropTypes.element.isRequired,
};

export default SingleFieldList;
