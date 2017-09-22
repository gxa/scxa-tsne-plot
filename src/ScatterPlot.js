import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'

import './util/MathRound10'

const Highcharts = ReactHighcharts.Highcharts
HighchartsExporting(Highcharts)
HighchartsBoost(Highcharts)

const ScatterPlot = (props) => {
  const numPoints = props.series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)

  const config = {
    credits: {
      enabled: false
    },
    chart: {
      type: `scatter`,
      zoomType: `xy`,
      borderWidth: 1,
      borderColor: `dark blue`,
      height: `100%`
    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true,
      seriesThreshold: 5000
    },
    title: {
      text: null
    },
    xAxis: {
      title: {
        text: null
      },
      labels: {
        enabled: false
      },
      tickWidth: 0
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        enabled: false
      },
      gridLineWidth: 0,
      lineWidth: 1
    },
    colors: [`#b25fbc`, `#76b341`, `#6882cf`, `#ce9b44`, `#c8577b`, `#4fae84`, `#c95c3f`, `#7c7f39`],
    plotOptions: {
      series: {
        turboThreshold: 0,
        animation: false,
        marker: {
          radius: numPoints < 5000 ? 4 : 0.2
        }
      }
    },
    legend: {
      enabled: props.series.length > 1
    },
    series: props.series,
    ...props.highchartsConfig
  }

  return <ReactHighcharts config={config}/>
}

ScatterPlot.propTypes = {
  series: PropTypes.array,
  highchartsConfig: PropTypes.object
}

export default ScatterPlot
