import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { observable, ObservableMap, observe, toJS } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle, CardText } from 'material-ui/Card';
import debounce from 'lodash.debounce';
import Labeled from '../input/Labeled';
import DefaultPagination from '../list/Pagination';
import stores, { getStore } from '../../stores'
import { appendQueryToURL } from '../../url'
import get from 'lodash.get';

const emptyQuery = {
    limit: 30,
    skip: 0,
    sort: '',
    search: '',
    filter: {},
}

@observer
export class ReferenceManyField extends Component {
    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }

    @observable totalCount = 0
    @observable referenceRecords = []
    isLoading = true
    query = { ...emptyQuery }
    currentHref
    constructor(props) {
        super(props);
        this.state = {}
        this.debouncedLoadData = debounce(this.loadData, 300)
    }
    updateQuery(props) {
        this.query = { ...emptyQuery }
        const newQuery = props.query || {}
        for (const i in this.query) {
            if (newQuery[i] != null) {
                this.query[i] = newQuery[i]
            }
        }
        if (props.urlBinded && this.currentHref != location.href) {
            const params = new URL(location.href).searchParams
            for (const i in this.query) {
                if (params.has(i)) {
                    if (typeof emptyQuery[i] === 'string') {
                        this.query[i] = params.get(i)
                    } else {
                        this.query[i] = JSON.parse(params.get(i))
                    }
                }
            }
            this.currentHref = location.href
        }
        this.query.filter[props.target] = get(props.record, props.source)
    }
    componentDidMount() {
        this.loadData();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.query != nextProps.query) {
            this.loadData(nextProps);
        } else if (this.props.source !== nextProps.source || this.props.target !== nextProps.target) {
            this.loadData(nextProps);
        } else if (nextProps.urlBinded && this.currentHref != location.href) {
            this.debouncedLoadData(nextProps)
        }
    }

    refresh = (event) => {
        event.stopPropagation();
        this.loadData();
    }

    loadData = (props = this.props) => {
        this.updateQuery(props)
        const { limit, skip, sort, filter, search } = this.query;
        const store = getStore(props.reference)
        this.isLoading = true
        store.list(limit, skip, sort, filter, search).then((data) => {
            this.isLoading = false
            this.referenceRecords = data.records
            this.totalCount = data.total_count
        });
        if (this.props.urlBinded) {
            this.context.router.history.push(appendQueryToURL(location.href, this.query))
        }
    }

    setSort = (sort) => {
        if (this.query.sort === sort) {
            this.query.sort = '-' + sort
        } else {
            this.query.sort = sort
        }
        this.loadData()
    }
    setPageSkip = (skip) => {
        this.query.skip = skip
        this.loadData()
    }

    render() {
        const { pagination = <DefaultPagination />, reference, hasCreate, title, children } = this.props
        const filterValues = this.query.filter;
        const card = <Card>
            {React.cloneElement(this.props.children, { records: this.referenceRecords, entityName: reference, currentSort: this.query.sort, setSort: this.setSort })}
            {pagination && React.cloneElement(pagination, {
                total: this.totalCount,
                skip: this.query.skip,
                limit: this.query.limit,
                setPageSkip: this.setPageSkip,
            })}
        </Card>
        const empty = <Card><CardText>{(this.isLoading ? 'Loading...' : 'No Data!')}</CardText></Card>
        if (this.props.addLabel) {
            return <Labeled {...this.props} label={this.props.label} source={this.props.source}>
                {(this.referenceRecords.length > 0 ? card : empty)}
            </Labeled>
        } else {
            return (this.referenceRecords.length > 0 ? card : empty)
        }
    }
}

ReferenceManyField.propTypes = {
    addLabel: PropTypes.bool,
    label: PropTypes.string,
    pagination: PropTypes.element,
    defaultSort: PropTypes.string,
    children: PropTypes.element.isRequired,
    query: PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    urlBinded: PropTypes.bool,
    reference: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

ReferenceManyField.defaultProps = {
    urlBinded: false,
    value: '',
    addLabel: true,
    query: {}
};

export default ReferenceManyField;
