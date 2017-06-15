import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Toggle from 'material-ui/Toggle';
import { collectProps, fetchValue, writeValue } from '../utils'

const styles = {
    block: {
        margin: '1rem 0',
        maxWidth: 250,
    },
    label: {
        color: 'rgba(0, 0, 0, 0.298039)',
    },
    toggle: {
        marginBottom: 16,
    },
};

@observer
class BooleanInput extends Component {
    handleChange = (event) => {
        this.props.writeValue(this, event.target.value)
        if (this.props.onChange) {
            this.props.onChange(event, this.props.source, event.target.value)
        }
    }
    render() {
        return <Toggle
            {...collectProps(this.props, Toggle.propTypes) }
            defaultToggled={this.props.fetchValue(this, false)}
            onToggle={this.handleChange}
            labelStyle={styles.label}
            style={styles.toggle}
        />
    }
}

BooleanInput.propTypes = {
    elStyle: PropTypes.object,
    record: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string,
    onChange: PropTypes.func,
    fetchValue: PropTypes.func,
    writeValue: PropTypes.func,
};
BooleanInput.defaultProps = {
    record: { "_": "" },
    source: "_",
    fetchValue: fetchValue,
    writeValue: writeValue
};

export default BooleanInput;
