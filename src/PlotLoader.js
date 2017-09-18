import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import ScatterPlot from './ScatterPlot'

class PlotLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      timestamp: 0,
      series: [],
      error: null
    }
  }

  async _fetchAndUpdate(base, endpoint) {
    try {
      const response = await fetch(URI(endpoint, base).toString())
      this.setState(
        {
          timestamp: Date.now(),
          series: await response.json()
        },
        this.forceUpdate)
    }
    catch (err) {
      console.log(`Fetch failed`, err)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sourceUrl !== nextProps.sourceUrl || this.props.atlasUrl !== nextProps.atlasUrl) {
      this._fetchAndUpdate(nextProps.atlasUrl, nextProps.sourceUrl)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this._fetchAndUpdate(this.props.atlasUrl, this.props.sourceUrl)
  }

  render() {
    return (
      this.state.timestamp ?
        <ScatterPlot series={this.state.series}/> :
        <div><img src={URI(`resources/images/loading.gif`, this.props.atlasUrl).toString()}/></div>
    )
  }
}

PlotLoader.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  sourceUrl: PropTypes.string.isRequired
}

export default PlotLoader
