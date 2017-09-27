import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'
import ReactHighcharts from 'react-highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'

import Color from 'color'
import './util/MathRound10'

const Highcharts = ReactHighcharts.Highcharts
HighchartsExporting(Highcharts)
HighchartsBoost(Highcharts)

const countPoints = (series) => {
  return series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)
}

class ManagedScatterPlot extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sourceUrl !== nextProps.sourceUrl) {
      fetch(nextProps.sourceUrl)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          const chart = this.highchartsRef.getChart()
          while (chart.series.length > 0) {
            chart.series[0].remove(false)
          }

          if (json.length === 1) {
            chart.addSeries(colorizeAndRound3DSeries(json[0]), false)

            // In principle the chart won’t change from clusters to gene expression, so this might be safe to remove
            chart.legend.update({enabled: false}, false)
          } else {
            json.forEach((series) => chart.addSeries(series, false))
          }

          chart.update({
            plotOptions: {
              series: {
                marker: {
                  radius: countPoints(json) < 5000 ? 4 : 0.1
                }
              }
            }
          }, false)
          chart.redraw()
        })
        .catch((ex) => {
          console.log(`Error parsing JSON: ${ex}`)
        })
    }
  }

  shouldComponentUpdate() {
    // If Highcharts hasn’t been mounted yet do the initial render, otherwise we’ll manage the updates ourselves
    return !this.highchartsRef
  }

  render() {
    const baseConfig = {
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
        text: this.props.title || null
      },
      xAxis: {
        title: {
          text: this.props.xAxisTitleText || null
        },
        labels: {
          enabled: false
        },
        tickWidth: 0
      },
      yAxis: {
        title: {
          text: this.props.xAxisTitleText || null
        },
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        lineWidth: 1
      },
      colors: [`#b25fbc`, `#76b341`, `#6882cf`, `#ce9b44`, `#c8577b`, `#4fae84`, `#c95c3f`, `#7c7f39`]
    }

    const { sourceUrlFetch } = this.props

    if (sourceUrlFetch.pending) {
      return <div><img src={"https://www.ebi.ac.uk/gxa/resources/images/loading.gif"}/></div>
    } else if (sourceUrlFetch.fulfilled) {

      const series = sourceUrlFetch.value.length === 1 ?
        [ colorizeAndRound3DSeries(sourceUrlFetch.value[0]) ] :
        sourceUrlFetch.value;

      const config = {
        ...baseConfig,
        plotOptions: {
          series: {
            turboThreshold: 0,
            animation: false,
            marker: {
              radius: countPoints(sourceUrlFetch.value) < 5000 ? 4 : 0.2
            }
          },
        },
        legend: {
          enabled: sourceUrlFetch.value.length > 1,
          symbolHeight: 16,
          symbolWidth: 16
        },
        series: series
      }
      return <div><ReactHighcharts config={config} ref={(ref) => this.highchartsRef = ref}/></div>

    } else {
      // sourceUrlFetch.rejected
      return <div><p>Error loading t-SNE data for experiment ${this.props.experimentAccession}</p></div>
    }
  }
}

ManagedScatterPlot.propTypes = {
  sourceUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  xAxisTitleText: PropTypes.string,
  yAxisTitleText: PropTypes.string,
}

export default connect(props => ({
  sourceUrlFetch: props.sourceUrl
}))(ManagedScatterPlot)
