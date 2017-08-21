import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, ObservableMap, observe, toJS, reaction, computed } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Title from '../layout/Title';
import DefaultPagination from './Pagination';
import DefaultActions from './Actions';
import stores, { getStore } from '../../stores'
import { appendQueryToURL } from '../../url'
import DataGrid from './DataGrid'

const { queryStore } = stores
const emptyQuery = {
    limit: 20,
    skip: 0,
    sort: '',
    search: '',
    filter: {},
}

function isDeepEqual(props0, props1) {
    if (props0 === props1) {
        return true
    }
    if (typeof props0 === 'object' && typeof props1 === 'object') {
        const checked = []
        for (let f in props0) {
            if (!isDeepEqual(props0[f], props1[f])) {
                return false
            }
            checked.push(f)
        }
        for (let f in props1) {
            if (!checked.includes(f)) {
                if (!isDeepEqual(props0[f], props1[f])) {
                    return false
                }
            }
        }
        return true
    } else {
        return props0 === props1
    }
}
@observer
export class List extends Component {
    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired,
                listen: PropTypes.func.isRequired,
            }).isRequired
        }).isRequired
    }
    @observable selectedRecords = []
    @observable totalCount = 0
    @observable records = []
    @observable isLoading = true

    query = { ...emptyQuery }
    constructor(props) {
        super(props);
        this.state = {}
    }

    updateQuery(props) {
        this.query = { ...emptyQuery }
        const newQuery = props.query || {}
        for (const i in this.query) {
            if (newQuery[i] != null) {
                this.query[i] = newQuery[i]
            }
        }
    }
    syncQueryToUrl() {
        if (this.props.urlBinded) {
            const store = getStore(this.props.entityName)
            store.lastListUrl = appendQueryToURL(location.href, this.query)
            this.context.router.history.push(store.lastListUrl)
        }
    }
    collectQuery(props) {
        if (props.urlBinded) {
            const query = { ...emptyQuery, ...props.query }
            const params = new URL(location.href).searchParams
            if (params) {
                for (const i in this.query) {
                    if (params.has(i)) {
                        if (typeof emptyQuery[i] === 'string') {
                            query[i] = params.get(i)
                        } else {
                            query[i] = JSON.parse(params.get(i))
                        }
                    }
                }
            }
            if (!isDeepEqual(query, this.query)) {
                this.query = query
                return true
            }
        }
        return false
    }
    handleURLChange = () => {
        if (this.collectQuery(this.props)) {
            this.loadData();
        }
    }
    componentDidMount() {
        if (this.props.urlBinded) {
            this.collectQuery(this.props)
        } else {
            this.updateQuery(this.props)
        }
        this.loadData();
        const store = getStore(this.props.entityName)
        this.loadReaction = reaction(() => store.records.map((record) => record.id), ids => this.loadData())
        if (this.props.urlBinded) {
            this.historyUnlisten = this.context.router.history.listen(this.handleURLChange)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.entityName !== nextProps.entityName || !isDeepEqual(nextProps.query, this.props.query)) {
            this.updateQuery(nextProps)
            this.syncQueryToUrl()
            this.loadData(nextProps.entityName);
        }
        if (!this.props.urlBinded && nextProps.urlBinded && !this.historyUnlisten) {
            this.historyUnlisten = this.context.router.history.listen(this.handleURLChange)
        } else if (this.props.urlBinded && !nextProps.urlBinded) {
            this.historyUnlisten()
            this.historyUnlisten = undefined
        }
    }
    componentWillUnmount() {
        this.loadReaction()
        if (this.historyUnlisten) {
            this.historyUnlisten()
            this.historyUnlisten = undefined
        }
    }

    refresh = (event) => {
        event.stopPropagation();
        this.loadData();
    }
    loadData = async (entityName = this.props.entityName) => {
        if (!entityName) return

        const { limit, skip, sort, filter, search } = this.query;
        const store = getStore(entityName)
        this.isLoading = true
        const data = await store.list(limit, skip, sort, filter, search)
        this.records = data.records
        this.totalCount = data.rawData.total_count
        this.isLoading = false
    }

    setSort = (sort) => {
        if (this.query.sort === sort) {
            this.query.sort = '-' + sort
        } else {
            this.query.sort = sort
        }
        this.syncQueryToUrl()
        this.loadData()
    }
    setPageSkip = (skip) => {
        this.query.skip = skip
        this.syncQueryToUrl()
        this.loadData()
    }

    handleFilterValueChange = (event, filterName, value) => {
        if (!filterName || filterName === '_') {
            this.query.search = value
        } else {
            this.query.filter[filterName] = value
        }
        this.query.skip = 0
        this.syncQueryToUrl()
        this.loadData()
    }

    showFilter = (filterName, defaultValue) => {
        this.setState({ [filterName]: true })
        if (defaultValue !== undefined) {
            this.handleFilterValueChange(null, filterName, defaultValue);
        }
    }

    hideFilter = (filterName) => {
        this.setState({ [filterName]: false })
        this.handleFilterValueChange(null, filterName, undefined);
    }

    handleSelectRecord = (selectedRecords) => {
        this.selectedRecords = selectedRecords
    }

    render() {
        let node = null
        if (this.isLoading) {
            node = <CardText>Loading...</CardText>
        } else if (!this.records || this.records.length === 0) {
            node = <CardText>No data!</CardText>
        }
        const { filters, pagination = <DefaultPagination />, actions = <DefaultActions />, entityName, hasCreate, hasDelete, hasRefresh, title, children } = this.props
        const filterValues = this.query.filter
        const defaultTitle = `${entityName} List`
        if (node == null) {
            const props = { records: this.records, entityName, currentSort: this.query.sort, setSort: this.setSort, handleSelectRecord: this.handleSelectRecord }
            node = React.cloneElement(this.props.children, props)
        }
        const refresh = hasRefresh ? (this.props.refresh || this.refresh) : null
        return (
            <Card>
                {actions && React.cloneElement(actions, {
                    entityName,
                    filters,
                    filterValues,
                    searchValue: this.query.search,
                    deleteRecords: this.selectedRecords,
                    hasCreate,
                    hasDelete,
                    shownFilters: this.state,
                    showFilter: this.showFilter,
                    refresh,
                })}
                <CardTitle title={<Title title={title} defaultTitle={defaultTitle} />} />
                {filters && React.cloneElement(filters, {
                    entityName,
                    hideFilter: this.hideFilter,
                    filterValues,
                    onChange: this.handleFilterValueChange,
                    searchValue: this.query.search,
                    shownFilters: this.state,
                    context: 'form',
                })}
                {node}
                {pagination && React.cloneElement(pagination, {
                    total: this.totalCount,
                    skip: this.query.skip,
                    limit: this.query.limit,
                    setPageSkip: this.setPageSkip,
                })}
            </Card>
        );
    }
}

List.propTypes = {
    title: PropTypes.any,
    pagination: PropTypes.element,
    actions: PropTypes.element,
    defaultSort: PropTypes.string,
    children: PropTypes.element.isRequired,
    filters: PropTypes.object,
    query: PropTypes.object,
    urlBinded: PropTypes.bool,
    entityName: PropTypes.string.isRequired,
    hasCreate: PropTypes.bool,
    hasRefresh: PropTypes.bool,
    refresh: PropTypes.func
}
List.defaultProps = {
    hasCreate: false,
    hasRefresh: true
}

export default List;
