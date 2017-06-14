import React, { Component } from 'react';
import PropTypes from 'prop-types'
import mobx, { observable } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import DefaultActions from './CreateActions';

class Create extends Component {
    @observable record = {}

    handleSubmit = (record) => {
        if (this.props.beforeSubmit){
            this.props.beforeSubmit(this.props)
        }
        const store = getStore(this.props.entityName)
        store.create(record).then((data) => {
            if (this.props.afterSubmit){
                this.props.afterSubmit(this.props)
            }
        })
    };

    componentDidMount() {
        this.record = this.props.record
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record !== this.props.record) {
            this.record = this.props.record
        }
    }
    render() {
        const { actions = <DefaultActions />, children, entityName, title } = this.props;
        return (
            <Card style={{ margin: '2em' }}>
                {actions && React.cloneElement(actions, {
                    entityName,
                    record: this.record,
                })}
                <CardTitle title={<Title title={title} defaultTitle={`Create ${inflection.humanize(inflection.singularize(entityName))}`} />} />
                {React.cloneElement(children, {
                    onSubmit: this.handleSubmit,
                    entityName,
                    record: this.record,
                })}
            </Card>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    entityName: PropTypes.string.isRequired,
    title: PropTypes.any,
    record: PropTypes.object.isRequired,
    beforeSubmit: PropTypes.func,
    afterSubmit: PropTypes.func,
};

Create.defaultProps = {
    record: {},
};

export default Create;
