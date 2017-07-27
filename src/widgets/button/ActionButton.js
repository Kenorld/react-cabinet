import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { RaisedButton, FlatButton } from 'material-ui';
class ActionButton extends Component {
    handlePress = (e) => {
        if (this.props.onPress) {
            this.props.onPress(e, this)
        }
    }
    render() {
        const { icon, style = {
            margin: '10px 24px',
            position: 'relative',
        }, label, containerElement, primary } = this.props
        switch (this.props.type) {
            case 'flat':
                return <FlatButton
                    label={label}
                    icon={icon}
                    containerElement={containerElement}
                    onTouchTap={this.handlePress}
                    primary = {primary}
                    style={style}
                />
            case 'raised':
                return <RaisedButton
                    label={label}
                    icon={icon}
                    containerElement={containerElement}
                    onTouchTap={this.handlePress}
                    primary = {primary}
                    style={style}
                />
        }
    }
}

ActionButton.propTypes = {
    style: PropTypes.object,
    type: PropTypes.string,
    entityName: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.element,
    containerElement: PropTypes.element,
    record: PropTypes.object,
};
ActionButton.defaultProps = {
    label: 'Action',
    type: 'raised'
}

export default ActionButton;
