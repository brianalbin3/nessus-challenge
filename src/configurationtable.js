import React, { Component } from 'react';


// NOTE: To make this more efficient I could have loaded them 10 at a time
class ConfigurationTable extends React.Component {
    constructor() {
        super();

        this.SORT_ORDER = { UNSORTED: 0, ASC: 1, DESC: 2 };
        this.SORT_METHOD =  { BY_NAME: 0, BY_HOST_NAME: 1, BY_PORT: 2, BY_USER_NAME: 3 };

        this.NUM_ROWS_PER_PAGE = 10;

        this.state = { sortOrder: this.SORT_ORDER.UNSORTED, pageNum: 1 };

        this.sort = this.sort.bind(this)
        this.getHeaderRowString = this.getHeaderRowString.bind(this);
        this.calcNumPages = this.calcNumPages.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    componentWillMount() {
        this.getConfigurations();
    }

    getConfigurations() {
        const URL = 'http://localhost:3000/listConfigurations';

        let successFunc = (response) => {
            this.state.configurations = response.configurations;
            this.sort(this.SORT_METHOD.BY_NAME);
        };

        $.ajax({
            url: URL,
            data: { host: 30 },
            dataType: 'json',
            success: successFunc
        });
    }

    sort(sortMethod) {
        let newSortOrder = this.SORT_ORDER.ASC;

        if ( this.state.sortMethod === sortMethod ) {
            newSortOrder = this.state.sortOrder === this.SORT_ORDER.ASC ? this.SORT_ORDER.DESC : this.SORT_ORDER.ASC;
        }

        let sortedConfigurations = this.state.configurations.sort( (a,b) => {
            let result;

            let nameA;
            let nameB;

            switch (sortMethod) {
                case this.SORT_METHOD.BY_NAME:
                    nameA = a.name.toUpperCase();
                    nameB = b.name.toUpperCase();
                break;

                case this.SORT_METHOD.BY_HOST_NAME:
                    nameA = a.hostname.toUpperCase();
                    nameB = b.hostname.toUpperCase();
                break;

                case this.SORT_METHOD.BY_PORT:
                    nameA = a.port;
                    nameB = b.port;
                break;

                case this.SORT_METHOD.BY_USER_NAME:
                    nameA = a.username.toUpperCase();
                    nameB = b.username.toUpperCase();
                break;

                default:
                break;
            }

            if (nameA < nameB) {
                result = -1;
            }
            else if (nameA > nameB) {
                result = 1;
            }
            else {
                result = 0;
            }

            if ( newSortOrder === this.SORT_ORDER.DESC ) {
                result *= -1;
            }

            return result;
        });

        this.setState({ configurations: sortedConfigurations, sortMethod: sortMethod, sortOrder: newSortOrder });
    }

    getHeaderRowString(sortMethod) {
        let headerRowStr = "";

        switch (sortMethod) {
            case this.SORT_METHOD.BY_NAME:
                headerRowStr += "Name";
            break;

            case this.SORT_METHOD.BY_HOST_NAME:
                headerRowStr += "Host Name";
            break;

            case this.SORT_METHOD.BY_PORT:
                headerRowStr += "Port";
            break;

            case this.SORT_METHOD.BY_USER_NAME:
                headerRowStr += "User Name";
            break;

            default:
            break;
        }

        if ( sortMethod === this.state.sortMethod ) {
            if ( this.state.sortOrder === this.SORT_ORDER.ASC ) {
                headerRowStr += " ▼";
            }
            else {
                headerRowStr += " ▲";
            }
        }

        return headerRowStr;
    }

    calcNumPages() {
        if ( this.state.configurations !== undefined ) {
            return Math.trunc(this.state.configurations.length / this.NUM_ROWS_PER_PAGE) + 1;
        }
        return 0;
    }

    prevPage() {
        if ( this.state.pageNum !== 1 ) {
            this.setState({
                pageNum: this.state.pageNum - 1
            });
        }
    }

    nextPage() {
        if ( this.state.pageNum !== this.calcNumPages() ) {
            this.setState( {
                pageNum: this.state.pageNum + 1
            });
        }
    }

    render() {
        if (this.state.configurations == undefined) {
            return <span>Loading...</span>;
        }

        let headerRow = (
            <div className="header-row">
                <div className="cell" onClick={() => this.sort(this.SORT_METHOD.BY_NAME)}>{this.getHeaderRowString(this.SORT_METHOD.BY_NAME)}</div>
                <div className="cell" onClick={() => this.sort(this.SORT_METHOD.BY_HOST_NAME)}>{this.getHeaderRowString(this.SORT_METHOD.BY_HOST_NAME)}</div>
                <div className="cell" onClick={() => this.sort(this.SORT_METHOD.BY_PORT)}>{this.getHeaderRowString(this.SORT_METHOD.BY_PORT)}</div>
                <div className="cell" onClick={() => this.sort(this.SORT_METHOD.BY_USER_NAME)}>{this.getHeaderRowString(this.SORT_METHOD.BY_USER_NAME)}</div>
            </div>
        );

        let startPos = (this.state.pageNum - 1) * this.NUM_ROWS_PER_PAGE;
        let endPos = startPos + this.NUM_ROWS_PER_PAGE - 1;

        if ( this.state.configurations.length - 1 < endPos ) {
            endPos = this.state.configurations.length - 1;
        }

        let rows = [];

        for (let i = startPos; i <= endPos; i++) {
            let row = (
                <div className="row">
                    <div className="cell">{this.state.configurations[i].name}</div>
                    <div className="cell">{this.state.configurations[i].hostname}</div>
                    <div className="cell">{this.state.configurations[i].port}</div>
                    <div className="cell">{this.state.configurations[i].username}</div>
                </div>
            );

            rows.push(row);
        }

        let paginationControls = (
            <div className="pagination-ctrls">
                <div className="pagination-btn-container">
                    <button className={`pagination-btn pagination-prev-btn ${this.state.pageNum !== 1 ? "clickable-btn" : "non-clickable-btn"}`} onClick={this.prevPage}></button>
                </div>
                <div className="page-info-container-container">
                    <div className="page-info-container">Page <span className="page-num">{this.state.pageNum}</span> of <span className="page-num">{this.calcNumPages()}</span></div>
                </div>
                <div className="pagination-btn-container">
                    <button id="test" className={`pagination-btn pagination-next-btn ${this.state.pageNum !== this.calcNumPages() ? "clickable-btn" : "non-clickable-btn"}`} onClick={this.nextPage}></button>
                </div>
            </div>
        );

        return (
            <div className="table-container">
                {headerRow}
                {rows}
                {paginationControls}
            </div>
        );
    }
}

export default ConfigurationTable;