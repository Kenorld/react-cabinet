import React, { Component } from 'react';
import PropTypes from 'prop-types'
import mobx, { observable } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle, CardText } from 'material-ui/Card';
import inflection from 'inflection';
import Title from '../layout/Title';
import DefaultActions from './EditActions';
import stores, { getStore } from '../../stores'
import { getUIURL } from '../../url'

@observer
export class Edit extends Component {
    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }

    @observable record = null
    @observable isLoading = true

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.recordId !== this.props.recordId) {
            this.loadData(nextProps.entityName, nextProps.recordId)
        }
    }

    loadData(entityName = this.props.entityName, recordId = this.props.recordId) {
        this.isLoading = true
        getStore(this.props.entityName).read(recordId).then((record) => {
            this.record = this.props.editOnShadow ? observable(mobx.toJS(record)) : record
            this.isLoading = false
        })
    }

    refresh = (event) => {
        event.stopPropagation();
        this.loadData();
    }

    handleSubmit = () => {
        if (this.props.beforeSubmit){
            this.props.beforeSubmit(this.props)
        }
        const store = getStore(this.props.entityName)
        store.update(this.record.id, mobx.toJS(this.record)).then((data)=>{
            if (store.lastListUrl) {
                this.context.router.history.push(store.lastListUrl)
            } else {
                this.context.router.history.push(getUIURL(this.props.entityName, 'list'))
            }
            if (this.props.afterSubmit){
                this.props.afterSubmit(this.props)
            }
            this.record = this.props.editOnShadow ? observable(mobx.toJS(data)) : data
            stores.notification.notify('Record updated!')
        })
    }

    render() {
        if (this.isLoading){
            return (<Card style={{ margin: '2em' }}><CardText>Loading...</CardText></Card>)
        }
        if (!this.record || !this.record.id){
            return (<Card style={{ margin: '2em' }}><CardText>No data!</CardText></Card>)
        }
        const { actions = <DefaultActions />, children, hasDelete, hasShow, recordId, entityName, title = this.record ? this.record.title || this.record.name || this.record.full_name: "" } = this.props;
        return <Card style={{ margin: '2em' }}>
            {actions && React.cloneElement(actions, {
                record: this.record,
                hasDelete,
                hasShow,
                refresh: this.refresh,
                entityName,
            })}
            {this.record && <CardTitle title={<Title title={title} record={this.record} defaultTitle={`${inflection.humanize(inflection.singularize(entityName))}`} />} />}
            {this.record && React.cloneElement(children, {
                onSubmit: this.handleSubmit,
                entityName,
                record: this.record,
            })}
            {!this.record && <CardText>No Data!</CardText>}
        </Card>
    }
}

Edit.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element.isRequired,
    data: PropTypes.object,
    hasDelete: PropTypes.bool,
    hasShow: PropTypes.bool,
    editOnShadow: PropTypes.bool,
    recordId: PropTypes.string.isRequired,
    entityName: PropTypes.string.isRequired,
    title: PropTypes.any,
    beforeSubmit: PropTypes.func,
    afterSubmit: PropTypes.func,
};
Edit.defaultProps = {
    editOnShadow: true
}


export default Edit;
