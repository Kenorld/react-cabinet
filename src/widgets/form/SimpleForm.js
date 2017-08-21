import React, { Children } from 'react';
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Toolbar from './Toolbar';
import MobxReactForm from 'mobx-react-form';
import { SaveButton } from '../button';

import {validateForm} from '../validate'

class DefaultForm extends MobxReactForm { }


@observer
@validateForm
class SimpleForm extends React.Component {
    constructor(){
        super();
        this.inputs = [];
    }
    render() {
        let { record, children, onSubmit, invalid, form, fields, showToolbar, plugins } = this.props
        const submitHandler = (e) => {
            e.preventDefault();
            if (onSubmit) {
                onSubmit(record)
            }
        }
        if (form == null) {
            form = new DefaultForm(fields, plugins)
        }
        const createChangeHandler = (element) => {
            return (e) => {
                
                // //this.handleFieldChange(e, element.props.source, e.target.value)
                // if (element.props.onChange) {
                //     element.props.onChange(e, element.props.source, e.target.value)
                // }
            }
        }
        return <form onSubmit={submitHandler}>
            <div style={{ padding: '0 1em 1em 1em' }}>
                {React.Children.map(children, input => (
                    <div key={input.props.source} style={input.props.style}>
                        {React.cloneElement(input, { record: record, source: input.props.source, onChange: createChangeHandler(input), ref: component => {this.inputs.push(component)}})}
                    </div>
                ))}
            </div>
            {showToolbar && <Toolbar invalid={invalid} />}
        </form>
    }
}

export default SimpleForm;



