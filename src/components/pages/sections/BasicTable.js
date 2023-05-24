import { MDBDataTable } from "mdbreact";
import PropTypes from 'prop-types';
import React from 'react';
import Table from './Table';

function calculateAverage(rows, aggregatedDataColumns) {
    const averageRow = {};
    averageRow[aggregatedDataColumns[0].label] = "AVG";

    for (let i = 1; i < aggregatedDataColumns.length; i++) {
        const sum = rows[0].map((x) => x[aggregatedDataColumns[i].label]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        averageRow[aggregatedDataColumns[i].label] = parseFloat(sum / rows[0].length).toFixed(2);
    }

    return averageRow;
}

function calculateSum(rows, aggregatedDataColumns) {
    const sumRow = {};
    sumRow[aggregatedDataColumns[0].label] = "SUM";

    for (let i = 1; i < aggregatedDataColumns.length; i++) {
        const sum = rows[0].reduce((accumulator, currentValue) => accumulator + currentValue[aggregatedDataColumns[i].label], 0);
        sumRow[aggregatedDataColumns[i].label] = parseFloat(sum).toFixed(2);
    }

    return sumRow;
}

function calculateMax(rows, aggregatedDataColumns) {
    const maxRow = {};
    maxRow[aggregatedDataColumns[0].label] = "MAX";

    for (let i = 1; i < aggregatedDataColumns.length; i++) {
        const max = Math.max(...rows[0].map((item) => item[aggregatedDataColumns[i].label]));
        maxRow[aggregatedDataColumns[i].label] = parseFloat(max).toFixed(2);
    }

    return maxRow;
}

function formatAggregatedData(columns, rows) {
    const _ = require('lodash');
    let aggregatedData = {};
    if (columns != undefined) {
        const aggregatedDataColumns = _.cloneDeep(columns);
        aggregatedDataColumns[0].label = 'Aggregation';
        aggregatedDataColumns[0].field = 'Aggregation';

        const aggregatedDataRows = [];
        aggregatedDataRows.push(calculateAverage(rows, aggregatedDataColumns));
        aggregatedDataRows.push(calculateSum(rows, aggregatedDataColumns));
        aggregatedDataRows.push(calculateMax(rows, aggregatedDataColumns));

        aggregatedData = {
            'columns': aggregatedDataColumns,
            'rows': aggregatedDataRows
        };

        console.log("aggregatedDataRows:", aggregatedDataRows);
    }
    return aggregatedData;
}

export default class BasicTable extends React.Component {

    static propTypes = {
        /**
         * An object that respects as defined here https://mdbootstrap.com/docs/react/tables/additional/
         * It contains the data that will be visualized in the table
         */
        data: PropTypes.any,

        /**
         * The title of the table.
         */
        title: PropTypes.string
    }

    formatTableData() {
        var data = JSON.parse(JSON.stringify(this.props.data));
        console.log(this.props.title + " : " + JSON.stringify(data));

        const keys = [];
        const columns = [];
        const rows = [];
        if (data.length > 0) {
            keys.push(Object.keys(data[0]));

            for (let i = 0; i < keys[0].length; i++) {
                // console.log("keys[i]: " + keys[0][i]);
                let column = {
                    'label': '' + keys[0][i] + '',
                    'field': '' + keys[0][i] + '',
                    'sort': 'asc',
                    'width': 150
                };
                columns.push(column);
            }
        }
        rows.push(data);

        const tableData = {
            'columns': columns,
            'rows': rows[0]
        };


        console.log(columns);
        return { columns, rows, tableData };
    }

    render() {

        const { columns, rows, tableData } = this.formatTableData();

        let aggregatedData = formatAggregatedData(columns, rows);

        return (
            <>
                <MDBDataTable striped small bordered responsive hover data={tableData} />
                {aggregatedData > 0 || <Table data={aggregatedData} title="Aggregated Metrics" />}
            </>
        )
    }
}