import React, { Component } from 'react';
import PropTypes from 'prop-types'
import get from 'lodash.get';
import set from 'lodash.set';
import { Link } from 'react-router-dom';
import { observable } from "mobx"
import { observer } from 'mobx-react'
import LinearProgress from 'material-ui/LinearProgress';
import { getUIURL } from '../../url'
import { getStore } from '../../stores'

/**
 * @example
 * <ReferenceField label="Post" source="post_id" reference="posts">
 *     <TextField source="title" />
 * </ReferenceField>
 */
@observer
export class ReferenceField extends Component {
    @observable referenceRecord
    @observable isLoading = true
    async loadData(reference = this.props.reference, record = this.props.record, source = this.props.source) {
        const value = get(this.props.record, this.props.source)
        if (value !== "" && value != null) {
            this.isLoading = true
            const store = getStore(this.props.reference)
            this.referenceRecord = await store.read(value)
            this.isLoading = false
        } else {
            this.isLoading = false
        }
    }
    componentWillMount() {
        this.loadData()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id || this.props.reference !== nextProps.reference
            || this.props.source !== nextProps.source) {
            this.loadData(nextProps.reference, nextProps.record, nextProps.source)
        }
    }

    render() {
        const { record, source, reference, value, allowEmpty, children, enableLink } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceField> only accepts a single child');
        }
        if (!this.referenceRecord && !allowEmpty) {
            return this.isLoading ? <LinearProgress /> : <p>[EMPTY]</p>;
        }
        const innerElement = React.cloneElement(children, {
            record: this.referenceRecord,
            entityName: reference,
            allowEmpty,
        })
        return enableLink ?
            <Link to={getUIURL(reference, 'edit', this.referenceRecord.id)}>
                {innerElement}
            </Link> : innerElement
    }
}

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    enableLink: PropTypes.bool,
    reference: PropTypes.string.isRequired,
};

ReferenceField.defaultProps = {
    addLabel: true,
    record: { id: "", "_": "" },
    source: "_",
    allowEmpty: false,
    enableLink: true,
};

export default ReferenceField;
