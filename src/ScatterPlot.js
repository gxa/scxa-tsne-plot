import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'

import deepmerge from 'deepmerge'

const Highcharts = ReactHighcharts.Highcharts

// Only apply modules if Highcharts isn’t a *good* mock -- Boost/Exporting break tests
// if (Highcharts.getOptions()) {
  HighchartsExporting(Highcharts)
  HighchartsBoost(Highcharts)
// }

const highchartsBaseConfig = {
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
    }
  }
}

const ScatterPlot = (props) => {
  const numPoints = props.series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)
  const config =
    deepmerge.all([
      highchartsBaseConfig,
      {
        plotOptions: {
          series: {
            marker: {
              radius: numPoints < 5000 ? 4 : 0.2
            }
          }
        }
      },
      { series: props.series },
      props.highchartsConfig
    ], { arrayMerge: (destination, source) => source }) // Don’t merge

  return <ReactHighcharts config={config}/>
}

ScatterPlot.propTypes = {
  // Consider adding boolean overwriteConfig prop to override base options with {...baseConfig, ...highchartsConfig}
  // The above would make this a generic Highcharts package and no longer be a ScatterPlot component
  series: PropTypes.array.isRequired,
  highchartsConfig: PropTypes.object
}

ScatterPlot.defaultProps = {
  highchartsConfig: {},
  overwriteConfig: false
}

export default ScatterPlot
