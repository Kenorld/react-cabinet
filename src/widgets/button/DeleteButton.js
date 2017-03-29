import React, { PropTypes } from 'react'
import { observable } from "mobx"
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import stores, { getStore } from '../../stores'
import { getUIURL } from '../../url'

const {notificationStore} = stores

@observer
class DeleteButton extends React.Component {
    @observable dialogOpened = false
    handleDialogOpen = () => {
        this.dialogOpened = true;
    }

    handleDialogClose = () => {
        this.dialogOpened = false;
    }
    handleDelete = () => {
        this.dialogOpened = false;
        const store = getStore(this.props.entityName)
        store.delete(this.props.record.id).then(() => {
            if (store.lastListUrl) {
                this.context.router.history.push(store.lastListUrl)
            } else {
                this.context.router.history.push(getUIURL(this.props.entityName, 'list'))
            }
            notificationStore.notify('Record deleted!')
        })
    }
    render() {
        const { entityName, record } = this.props
        return <FlatButton
            secondary
            label="Delete"
            icon={<ActionDelete />}
            onTouchTap={this.handleDialogOpen}
            style={{ overflow: 'inherit' }}
        >
            <Dialog
                title={this.props.dialogTitle}
                actions={[
                    <FlatButton
                        label="Cancel"
                        primary={true}
                        onTouchTap={this.handleDialogClose}
                    />,
                    <FlatButton
                        label="Submit"
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={this.handleDelete}
                    />,
                ]}
                modal={false}
                open={this.dialogOpened}
                onRequestClose={this.handleDialogClose}
            >
                {this.props.dialogDetail}
            </Dialog>
        </FlatButton>
    }
}

DeleteButton.contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }
DeleteButton.propTypes = {
    entityName: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
    dialogTitle: PropTypes.any.isRequired,
    dialogDetail: PropTypes.any.isRequired,
}
DeleteButton.defaultProps = {
    dialogTitle: "Delete Action",
    dialogDetail: "Are your sure to execute delete action?"
}

export default DeleteButton;
