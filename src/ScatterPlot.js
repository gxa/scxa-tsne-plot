import React from 'react';
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';

import shallowCompare from 'react-addons-shallow-compare';

const baseOptions = {
    credits: {
        enabled: false
    },
    chart: {
        type: 'scatter',
        zoomType: 'xy',
        borderWidth: 2,
        borderColor: '#30426A'
    },
    title: {
        text: ''
    },
    tooltip: {
        formatter: () => ('<b>' + this.point.name + '</b>')
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'X'
        }
    },
    yAxis: {
        title: {
            text: 'Y'
        }
    },
    legend: {
        layout: 'vertical',
        floating: false,
        align: 'right',
        verticalAlign: 'middle'
    },
    plotOptions: {
        scatter: {
            marker: {
                lineWidth: 1,
                lineColor: 'black'
            }
        },
        series: {
            color: 'grey'
        }
    }
};

class ScatterPlot extends React.Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {

        const config = Object.assign({},
            baseOptions,
            this.props.options,
            {series: this.props.dataset},
            {colorAxis: {
                dataClasses: this.props.colorRanges
                }
            }
        );

        return (
            <ReactHighcharts
                config={config}
                ref="chart"/>
        );
    }
}

ScatterPlot.propTypes = {
    dataset: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    colorRanges: PropTypes.array.isRequired
};

export default ScatterPlot;