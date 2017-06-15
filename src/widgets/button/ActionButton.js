import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import { collectProps } from '../utils'
class ActionButton extends Component{
    handlePress = (e)=>{
        if (this.props.onPress){
            this.props.onPress(e, this)
        }
    }
    render() {
        return <FlatButton
            {...collectProps(this.props, FlatButton.propTypes) }
            primary
            onTouchTap={this.handlePress}
            style={{ overflow: 'inherit' }}
        />
    }
}

ActionButton.propTypes = {
    entityName: PropTypes.string,
    // label: PropTypes.string,
    // icon: PropTypes.element,
    // container: PropTypes.element,
    record: PropTypes.object,
};
// ActionButton.defaultProps = {
//     label: 'Action',
//     icon: <ContentCreate />,
//     container: <div></div>
// }

export default ActionButton;
