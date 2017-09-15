import React from 'react'
import PropTypes from 'prop-types'
import { mapProps, withProps, compose } from 'recompose'
import ReactHighcharts from 'react-highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'

import Color from 'color'
import './util/MathRound10'

const Highcharts = ReactHighcharts.Highcharts
HighchartsExporting(Highcharts)
HighchartsBoost(Highcharts)

const ScatterPlot = (props) => {
  const config = {
    credits: {
      enabled: false
    },
    chart: {
      type: `scatter`,
      zoomType: `xy`,
      borderWidth: 1,
      borderColor: `dark blue`,
      height: 800
    },
    boost: {
      useGPUTranslations: true,
      usePreAllocated: true,
      seriesThreshold: 5000
    },
    title: {
      text: props.title || null
    },
    xAxis: {
      title: {
        text: props.xAxisTitleText || null
      },
      labels: {
        enabled: false
      },
      tickWidth: 0
    },
    yAxis: {
      title: {
        text: props.xAxisTitleText || null
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
          radius: props.markerRadius
        }
      },
      scatter: {
        tooltip: props.tooltip
      }
    },
    legend: {
      enabled: props.series.length > 1,
      symbolHeight: 16,
      symbolWidth: 16
    },
    series: props.series
  }

  return <ReactHighcharts config={config}/>
}

ScatterPlot.propTypes = {
  series: PropTypes.array
}

const colorizeAndRound3DSeries = (series) => {
  const min = Math.min(...series.data.map((point) => point.z))
  const max = Math.max(...series.data.map((point) => point.z))

  const seriesData = series.data.map((point) => {
    const saturation = max > min ? (point.z - min) / (max - min) * 100 : 0
    return {
      x: point.x,
      y: point.y,
      z: Math.round10(point.z, -2),
      name: point.name,
      color: Color(`hsl(230, ${saturation}%, 50%)`).rgb().toString()
    }
  })

  return { data: seriesData }
}

// If there’s only one series, add colour and round value; otherwise pass through
const mapSeries = mapProps(({series}) => ({
  series: series.length === 1 ?
    [ colorizeAndRound3DSeries(series[0]) ] :
    series
}))

// Add tooltip and radius depending on the number of series and points
const withTooltipAndMarkerRadius = withProps(({series}) => {
  const countPoints = (series) => {
    return series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)
  }

  return {
    tooltip: series.length > 1 ?
      {
        headerFormat: `<b>Cluster {series.name}</b><br>`,
        pointFormat: `{point.name}`
      } :
      {
        headerFormat: `<b>{point.key}</b><br>`,
        pointFormat: `Expression level: {point.z}`
      },
    markerRadius: countPoints(series) < 5000 ? 4 : 0.2
  }
})

export default compose(mapSeries, withTooltipAndMarkerRadius)(ScatterPlot)
