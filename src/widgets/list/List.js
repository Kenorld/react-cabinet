import React, { Component, PropTypes } from 'react';
import { observable, ObservableMap, observe, toJS } from "mobx"
import { observer } from 'mobx-react'
import { Card, CardTitle, CardText } from 'material-ui/Card';
import debounce from 'lodash.debounce';
import Title from '../layout/Title';
import DefaultPagination from './Pagination';
import DefaultActions from './Actions';
import stores, { getStore} from '../../stores'
import { appendQueryToURL } from '../../url'

const { queryStore } = stores

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

    query = {
        limit: 30,
        skip: 0,
        sort: '',
        search: '',
        filter: {},
    }
    @observable totalCount = 0
    @observable records = []
    @observable isLoading = true
    constructor(props) {
        super(props);
        this.state = {}
        Object.assign(this.query, this.props.query)
        if (this.props.urlBinded) {
            const params = new URL(location.href).searchParams
            for (const i in this.query) {
                if (params.has(i)) {
                    if (typeof this.query[i] === 'string') {
                        this.query[i] = params.get(i)
                    } else {
                        this.query[i] = JSON.parse(params.get(i))
                    }
                }
            }
        }
        this.debouncedloadData = debounce(this.loadData, 300)
    }

    componentDidMount() {
        this.loadData();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.entityName !== nextProps.entityName) {
            this.loadData(nextProps.entityName)
        }
    }

    refresh = (event) => {
        event.stopPropagation();
        this.loadData();
    }

    loadData = (entityName = this.props.entityName) => {
        const { limit, skip, sort, filter, search } = this.query;
        const store = getStore(entityName)
        this.isLoading = true
        store.list(limit, skip, sort, filter, search).then((data) => {
            this.records = data.records
            this.totalCount = data.total_count
            this.isLoading = false
        });
        if (this.props.urlBinded) {
            store.lastListUrl = appendQueryToURL(location.href, this.query)
            this.context.router.history.push(store.lastListUrl)
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

    handleFilterValueChange = (event, filterName, value) => {
        if (!filterName||filterName==='_') {
            this.query.search = value
        } else {
            this.query.filter[filterName] = value
        }
        this.query.skip = 0
        this.debouncedloadData()
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
        if (this.isLoading){
            node = <CardText>Loading...</CardText>
        } else if (!this.records || this.records.length === 0){
            node = <CardText>No data!</CardText>
        }
        const { filters, pagination = <DefaultPagination />, actions = <DefaultActions />, entityName, hasCreate, title, children } = this.props
        const filterValues = this.query.filter
        const defaultTitle = `${entityName} List`
        if (node == null){
            node = React.cloneElement(this.props.children, { records: this.records, entityName, currentSort: this.query.sort, setSort: this.setSort })
        }
        return (
            <Card style={{ margin: '2em', opacity: 1 }}>
                {actions && React.cloneElement(actions, {
                    entityName,
                    filters,
                    filterValues,
                    searchValue: this.query.search,
                    hasCreate,
                    shownFilters: this.state,
                    showFilter: this.showFilter,
                    refresh: this.refresh,
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
    displaySelectAll: PropTypes.bool,
    adjustForCheckbox: PropTypes.bool,
};

List.defaultProps = {
    urlBinded: true,
    displaySelectAll: true,
    adjustForCheckbox: true,
};

export default List;
