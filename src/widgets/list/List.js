import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observable, ObservableMap, observe, toJS, reaction, computed } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle, CardText } from 'material-ui/Card';
import debounce from 'lodash.debounce';
import Title from '../layout/Title';
import DefaultPagination from './Pagination';
import DefaultActions from './Actions';
import stores, { getStore } from '../../stores'
import { appendQueryToURL } from '../../url'

const { queryStore } = stores
const emptyQuery = {
    limit: 30,
    skip: 0,
    sort: '',
    search: '',
    filter: {},
}
@observer
export class List extends Component {
    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }

    @observable totalCount = 0
    @observable records = []
    @observable isLoading = true


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
            if (params) {
                for (const i in this.query) {
                    if (params.has(i)) {
                        if (typeof emptyQuery[i] === 'string') {
                            this.query[i] = params.get(i)
                        } else {
                            this.query[i] = JSON.parse(params.get(i))
                        }
                    }
                }
            }
            this.currentHref = location.href
        }
    }
    componentDidMount() {
        this.loadData();
        const store = getStore(this.props.entityName)
        this.loadReaction = reaction(() => store.records.map((record)=>record.id), ids=>this.loadData())
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.query != nextProps.query) {
            this.loadData(nextProps);
        } else if (this.props.entityName !== nextProps.entityName) {
            this.loadData(nextProps)
        } else if (nextProps.urlBinded && this.currentHref != location.href) {
            this.debouncedLoadData(nextProps)
        }
    }
    componentWillUnmount(){
        this.loadReaction()
    }

    refresh = (event) => {
        event.stopPropagation();
        this.loadData();
    }
    loadData = async (props = this.props) => {
        if (!props.entityName) return

        this.updateQuery(props)
        const { limit, skip, sort, filter, search } = this.query;
        const store = getStore(props.entityName)
        this.isLoading = true
        const data = await store.list(limit, skip, sort, filter, search)
        this.records = data.records
        this.totalCount = data.rawData.total_count
        this.isLoading = false
    }

    setSort = (sort) => {
        if (this.props.query.sort === sort) {
            this.props.query.sort = '-' + sort
        } else {
            this.props.query.sort = sort
        }
        this.loadData()
    }
    setPageSkip = (skip) => {
        this.props.query.skip = skip
        this.loadData()
    }

    handleFilterValueChange = (event, filterName, value) => {
        if (!filterName || filterName === '_') {
            this.query.search = value
        } else {
            this.query.filter[filterName] = value
        }
        this.query.skip = 0
        if (this.props.urlBinded) {
            const store = getStore(this.props.entityName)
            store.lastListUrl = appendQueryToURL(location.href, this.query)
            this.context.router.history.push(store.lastListUrl)
        } else {
            this.debouncedLoadData()
        }
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

    render() {
        let node = null
        if (this.isLoading) {
            node = <CardText>Loading...</CardText>
        } else if (!this.records || this.records.length === 0) {
            node = <CardText>No data!</CardText>
        }
        const { filters, pagination = <DefaultPagination />, actions = <DefaultActions />, entityName, hasCreate, hasRefresh, title, children } = this.props
        const filterValues = this.query.filter
        const defaultTitle = `${entityName} List`
        if (node == null) {
            const props = { records: this.records, entityName, currentSort: this.query.sort, setSort: this.setSort }
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
                    hasCreate,
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
    hasRefresh: true,
    query: {...emptyQuery}
}

export default List;
