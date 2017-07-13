"use strict";

//*------------------------------------------------------------------*

const React = require('react')
const ReactHighcharts = require('react-highcharts')
const Highcharts = ReactHighcharts.Highcharts

const shallowCompare = require('react-addons-shallow-compare')

//*------------------------------------------------------------------*

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
      turboThreshold: 0,
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

const ScatterPlot = React.createClass({
  propTypes: {
      dataset: React.PropTypes.array.isRequired,
      options: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render() {
    const config = Object.assign({},
      baseOptions,
      this.props.options,
      {series: this.props.dataset}
    )

    return (
        <ReactHighcharts
          config={config}
          ref="chart"/>
    );
  }
});

module.exports = ScatterPlot;
