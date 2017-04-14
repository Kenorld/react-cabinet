import React, { PropTypes } from 'react';
import { observer } from 'mobx-react'
import Snackbar from 'material-ui/Snackbar';
import stores from '../../stores'

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
        stores.notification.hideNotification();
    };

    render() {
        const style = {};
        const { primary1Color, accent1Color } = getStyles(this.context);
        if (stores.notification.type === 'warning') {
            style.backgroundColor = accent1Color;
        }
        if (stores.notification.type === 'confirm') {
            style.backgroundColor = primary1Color;
        }
        return (<Snackbar
            open={!!stores.notification.message}
            message={stores.notification.message}
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
