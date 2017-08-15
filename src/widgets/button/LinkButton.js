import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { RaisedButton, FlatButton } from 'material-ui';
class LinkButton extends Component {
    handlePress = (e) => {
        if (this.props.onPress) {
            this.props.onPress(e, this)
        }
    }
    render() {
        const { icon, style, label, containerElement, primary, href } = this.props
        switch (this.props.type) {
            case 'flat':
                return <FlatButton
                    label={label}
                    icon={icon}
                    containerElement={<Link to={href} />}
                    onTouchTap={this.handlePress}
                    primary = {primary}
                    style={style}
                />
            case 'raised':
                return <RaisedButton
                    label={label}
                    icon={icon}
                    containerElement={<Link to={href} />}
                    onTouchTap={this.handlePress}
                    primary = {primary}
                    style={style}
                />
        }
    }
}

LinkButton.propTypes = {
    style: PropTypes.object,
    type: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.element,
};
LinkButton.defaultProps = {
    type: 'raised'
}

export default LinkButton;
