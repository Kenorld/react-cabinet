import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const buttonStyle = { margin: '0 0', minWidth:'30px' };

export class Pagination extends Component {
    range() {
        const input = [];
        const { skip, limit, total } = this.props;
        const currentPage = this.getCurrentPage()
        const nbPages = this.getTotalPages();
        input.push(currentPage);
        let page = currentPage - 1
        if (page >= 0){
            input.unshift(page)
        }
        page--
        if (page > 0){
            input.unshift('.')
            input.unshift(0)
        }else if (page === 0){
            input.unshift(0)
        }
        
        page = currentPage + 1
        if(page < nbPages){
            input.push(page)
        }
        page++
        if (page < nbPages - 1){
            input.push('.')
            input.push(nbPages - 1)
        }else if(page === nbPages - 1){
            input.push(nbPages-1)
        }
       // console.log("nbPages:", nbPages, "  currentPage:", currentPage, input)
        return input;
    }

    getCurrentPage() {
        return Math.ceil((this.props.skip + 1) / this.props.limit - 1, 0) || 0;
    }

    getTotalPages() {
        return Math.ceil(this.props.total / this.props.limit, 1) || 1;
    }

    prevPage = (event) => {
        event.stopPropagation();
        const {skip, limit, total, setPageSkip} = this.props
        if (skip === 0) {
            throw new Error('Cannot go before page 1');
        }
        setPageSkip(Math.ceil(skip - limit, 0));
    }

    nextPage = (event) => {
        event.stopPropagation();
        const {skip, limit, total, setPageSkip} = this.props
        if (skip + limit >= total) {
            throw new Error('Cannot after last page');
        }
        setPageSkip(Math.floor(skip + limit, total));
    }

    gotoPage = (event) => {
        event.stopPropagation();
        const page = event.currentTarget.dataset.page;
        if (page < 0 || page > this.getTotalPages()) {
            throw new Error(`Page number ${page} out of boundaries`);
        }
        this.props.setPageSkip(page * this.props.limit);
    }

    renderPageNums() {
        const currentPage = this.getCurrentPage()
        return this.range().map((pageNum, index) =>
            (pageNum === '.') ?
                <span key={`hyphen_${index}`} style={{ padding: '1.2em' }}>&hellip;</span> :
                <FlatButton key={pageNum} label={pageNum + 1} data-page={pageNum} onClick={this.gotoPage} primary={pageNum !== currentPage} style={buttonStyle} />
        );
    }

    render() {
        const { skip, limit, total } = this.props;
        if (total === 0) return null;
        const offsetBegin = skip + 1;
        const offsetEnd = Math.min(skip + limit, total);
        const nbPages = this.getTotalPages();

        return (
            <Toolbar>
                <ToolbarGroup firstChild>
                    <span style={{ padding: '1.2em' }} >{offsetBegin}-{offsetEnd} of {total}</span>
                </ToolbarGroup>
                {nbPages > 1 &&
                    <ToolbarGroup>
                    {skip > 0 &&
                        <FlatButton primary key="prev" label="Prev" icon={<ChevronLeft />} onClick={this.prevPage} style={buttonStyle} />
                    }
                    {this.renderPageNums()}
                    {skip + limit < total &&
                        <FlatButton primary key="next" label="Next" icon={<ChevronRight />} labelPosition="before" onClick={this.nextPage} style={buttonStyle} />
                    }
                    </ToolbarGroup>
                }
            </Toolbar>
        );
    }
}

Pagination.propTypes = {
    skip: PropTypes.number,
    limit: PropTypes.number,
    total: PropTypes.number,
    setPageSkip: PropTypes.func,
};

export default Pagination;
