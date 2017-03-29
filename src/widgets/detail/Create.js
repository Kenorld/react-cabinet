import React, { Component, PropTypes } from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import DefaultActions from './CreateActions';

class Create extends Component {
    handleSubmit = (record) => {
        const store = getStore(this.props.entityName)
        store.create(record).then((data)=>{

        })
    };

    render() {
        const { actions = <DefaultActions />, children, isLoading, entityName, title } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                {actions && React.cloneElement(actions, {
                    basePath,
                    entityName,
                })}
                <CardTitle title={<Title title={title} defaultTitle={`Create ${inflection.humanize(inflection.singularize(entityName))}`} />} />
                {React.cloneElement(children, {
                    onSubmit: this.handleSubmit,
                    entityName,
                    basePath,
                    record: {},
                })}
            </Card>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudCreate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    entityName: PropTypes.string.isRequired,
    title: PropTypes.any,
};

Create.defaultProps = {
    data: {},
};

export default Create;
