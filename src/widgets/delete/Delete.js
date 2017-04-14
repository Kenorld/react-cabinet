import React, { Component, PropTypes } from 'react';
import { observable } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import ActionCheck from 'material-ui/svg-icons/action/check-circle';
import AlertError from 'material-ui/svg-icons/alert/error-outline';
import inflection from 'inflection';
import Title from '../layout/Title';
import { ListButton } from '../button';
import stores, { getStore } from '../../stores'
import { getUIURL } from '../../url'

@observer
class Delete extends Component {
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

    loadData(entityName = this.props.entityName, recordId = this.props.recordId) {
        const store = getStore(entityName)
        this.isLoading = true
        store.read(recordId).then((record) => {
            this.record = record
            this.isLoading = false
        })
    }

    componentDidMount() {
        this.loadData()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recordId !== nextProps.recordId || this.props.entityName !== nextProps.entityName) {
            this.loadData(nextProps.entityName, nextProps.recordId)
        }
    }

    goBack() {
        this.context.router.history.goBack();
    }

    handleSubmit(event) {
        event.preventDefault();
        const store = getStore(this.props.entityName)
        store.delete(this.record.id).then(() => {
            if (store.lastListUrl) {
                this.context.router.history.push(store.lastListUrl)
            } else {
                this.context.router.history.push(getUIURL(this.props.entityName, 'list'))
            }
            stores.notification.notify('Record deleted!')
        })
    }

    render() {
        if (this.isLoading) {
            return (<Card style={{ margin: '2em' }}><CardText>Loading...</CardText></Card>)
        }
        if (!this.record || !this.record.id){
            return (<Card style={{ margin: '2em' }}><CardText>No data!</CardText></Card>)
        }
        const { title, entityName } = this.props;
        return (
            <Card style={{ margin: '2em' }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton entityName={entityName} />
                </CardActions>
                <CardTitle title={<Title title={title} record={this.record} defaultTitle={`Delete ${inflection.humanize(inflection.singularize(entityName))} #${this.record.id}`} />} />
                <form onSubmit={this.handleSubmit}>
                    <CardText>Are you sure ?</CardText>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton
                                type="submit"
                                label="Yes"
                                icon={<ActionCheck />}
                                primary
                                style={{
                                    margin: '10px 24px',
                                    position: 'relative',
                                }}
                            />
                            <RaisedButton
                                label="No"
                                icon={<AlertError />}
                                onClick={this.goBack}
                                style={{
                                    margin: '10px 24px',
                                    position: 'relative',
                                }}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                </form>
            </Card>
        );
    }
}

Delete.propTypes = {
    title: PropTypes.any,
    recordId: PropTypes.string.isRequired,
    entityName: PropTypes.string.isRequired,
};

export default Delete;
