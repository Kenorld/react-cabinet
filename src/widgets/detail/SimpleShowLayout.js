import React, { Children } from 'react';
import PropTypes from 'prop-types'
import Labeled from '../input/Labeled';

export const SimpleShowLayout = ({ basePath, children, record, entityName }) => (
    <div style={{ padding: '0 1em 1em 1em' }}>
        {Children.map(children, field => (
            <div key={field.props.source} style={field.props.style}>
                {field.props.addLabel ?
                    <Labeled record={record} entityName={entityName} basePath={basePath} label={field.props.label} source={field.props.source} disabled={false}>{field}</Labeled> :
                    (typeof field.type === 'string' ?
                        field :
                        React.cloneElement(field, { record, entityName, basePath })
                    )
                }
            </div>
        ))}
    </div>
);

SimpleShowLayout.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    record: PropTypes.object,
    entityName: PropTypes.string,
};

export default SimpleShowLayout;
