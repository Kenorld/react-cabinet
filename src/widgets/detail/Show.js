import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import { DeleteButton, EditButton, ListButton } from '../button';
import Labeled from '../input/Labeled';

/**
 * Turns a children data structure (either single child or array of children) into an array.
 * We can't use React.Children.toArray as it loses references.
 */
const arrayizeChildren = children => (Array.isArray(children) ? children : [children]);

export class Show extends Component {
    componentDidMount() {
        this.props.crudGetOne(this.props.entityName, this.props.id, this.getBasePath());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(nextProps.entityName, nextProps.id, this.getBasePath());
        }
    }

    // FIXME Seems that the cloneElement in CrudRoute slices the children array, which makes this necessary to avoid rerenders
    shouldComponentUpdate(nextProps) {
        if (nextProps.isLoading !== this.props.isLoading) {
            return true;
        }

        const currentChildren = arrayizeChildren(this.props.children);
        const newChildren = arrayizeChildren(nextProps.children);

        return newChildren.every((child, index) => child === currentChildren[index]);
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -2).join('/');
    }

    render() {
        const { title, children, id, data, isLoading, entityName, hasDelete, hasEdit } = this.props;
        const basePath = this.getBasePath();

        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    {hasEdit && <EditButton basePath={basePath} record={data} />}
                    <ListButton basePath={basePath} />
                    {hasDelete && <DeleteButton basePath={basePath} record={data} />}
                </CardActions>
                <CardTitle title={<Title title={title} record={data} defaultTitle={`${inflection.humanize(inflection.singularize(entityName))} #${id}`} />} />
                {data && React.cloneElement(children, {
                    entityName,
                    basePath,
                    record: data,
                })}
            </Card>
        );
    }
}

Show.propTypes = {
    children: PropTypes.element,
    crudGetOne: PropTypes.func.isRequired,
    data: PropTypes.object,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    entityName: PropTypes.string.isRequired,
    title: PropTypes.any,
};


export default Show;
