import React, { PropTypes } from 'react';
import { observer } from 'mobx-react'
import Snackbar from 'material-ui/Snackbar';
import stores from '../../stores'

const { notificationStore } = stores

function getStyles(context) {
    if (!context) return { primary1Color: '#00bcd4', accent1Color: '#ff4081' };
    const {
      muiTheme: {
        baseTheme: {
          palette: {
              primary1Color,
              accent1Color,
          },
        },
      },
    } = context;
    return { primary1Color, accent1Color };
}

@observer
class Notification extends React.Component {
    handleRequestClose = () => {
        notificationStore.hideNotification();
    };

    render() {
        const style = {};
        const { primary1Color, accent1Color } = getStyles(this.context);
        if (notificationStore.type === 'warning') {
            style.backgroundColor = accent1Color;
        }
        if (notificationStore.type === 'confirm') {
            style.backgroundColor = primary1Color;
        }
        return (<Snackbar
            open={!!notificationStore.message}
            message={notificationStore.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
            bodyStyle={style}
        />);
    }
}

Notification.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Notification;
