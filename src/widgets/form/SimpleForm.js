import React, { Children } from 'react';
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Toolbar from './Toolbar';
import MobxReactForm from 'mobx-react-form';
import { SaveButton } from '../button';

class DefaultForm extends MobxReactForm { }
@observer
export default class SimpleForm extends React.Component {
    @observable record
    componentWillMount() {
       this.record = this.props.record
    }
    // handleFieldChange = (e, source, value) => {
    //     this.record[source] = value
    // }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record !== this.props.record) {
            this.record = nextProps.record
        }
    }
    render() {
        let { children, onSubmit, invalid, form, fields, showToolbar, plugins } = this.props
        const submitHandler = (e) => {
            if (onSubmit) {
                onSubmit(this.record)
            }
            e.preventDefault();
        }
        if (form == null) {
            form = new DefaultForm(fields, plugins)
        }
        const createChangeHandler = (element) => {
            return (e) => {
                //this.handleFieldChange(e, element.props.source, e.target.value)
                if (element.props.onChange) {
                    element.props.onChange(e, element.props.source, e.target.value)
                }
            }
        }
        return <form onSubmit={submitHandler}>
            <div style={{ padding: '0 1em 1em 1em' }}>
                {React.Children.map(this.props.children, input => (
                    <div key={input.props.source} style={input.props.style}>
                        {React.cloneElement(input, { record: this.record, source: input.props.source, onChange: createChangeHandler(input) })}
                    </div>
                ))}
            </div>
            {showToolbar && <Toolbar invalid={invalid} />}
        </form>
    }
}