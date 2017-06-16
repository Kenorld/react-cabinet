import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import {RaisedButton, FlatButton} from 'material-ui';
import { collectProps } from '../utils'
class ActionButton extends Component {
    handlePress = (e) => {
        if (this.props.onPress) {
            this.props.onPress(e, this)
        }
    }
    render() {
        switch (this.props.type) {
            case 'flat':
                return <FlatButton
                    {...collectProps(this.props, FlatButton.propTypes) }
                    onTouchTap={this.handlePress}
                    style={{ 
                    margin: '10px 24px',
                    position: 'relative', }}
                />
            case 'raised':
                return <RaisedButton
                    {...collectProps(this.props, FlatButton.propTypes) }
                    onTouchTap={this.handlePress}
                    style={{ 
                    margin: '10px 24px',
                    position: 'relative', }}
                />
        }
    }
}

ActionButton.propTypes = {
    type: PropTypes.string,
    entityName: PropTypes.string,
    // label: PropTypes.string,
    // icon: PropTypes.element,
    // container: PropTypes.element,
    record: PropTypes.object,
};
ActionButton.defaultProps = {
    label: 'Action',
    type: 'raised'
}

export default ActionButton;
