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
            turboThreshold: 0,
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

    highlightClusterPointRandomly() {
        this.refs.chart.chart.series.forEach(thisSeries => {
            thisSeries.data.forEach(point => {
                const random_color = Math.floor(Math.random() * (100));
                point.graphic.attr({ fill: `hsl(230, ${random_color}%, 50%`});
            })
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.geneChanged !== this.props.geneChanged) {
            this.highlightClusterPointRandomly();
        }
    }

    // componentDidMount() {
    //     this.highlightClusterPointRandomly();
    // }

    render() {

        const config = Object.assign({},
            baseOptions,
            this.props.options,
            {series: this.props.dataset}
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
    geneChanged: PropTypes.bool
};

export default ScatterPlot;