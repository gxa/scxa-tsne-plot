import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import LoadingOverlay from './LoadingOverlay'
import ScatterPlot from './ScatterPlot'

class PlotLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // timestamp: 0,
      series: [],
      loading: false,
      error: null
    }
  }

  async _fetchAndSetState(base, endpoint) {
    try {
      this.setState({
        loading: true
      })
      const response = await fetch(URI(endpoint, base).toString())
      this.setState({
        // timestamp: Date.now(),
        series: await response.json(),
        loading: false,
        error: null
      })
    }
    catch (err) {
      this.setState({
        // timestamp: Date.now(),
        error: err,
        loading: false
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.atlasUrl !== this.props.atlasUrl || nextProps.sourceUrl !== this.props.sourceUrl) {
      this._fetchAndSetState(nextProps.atlasUrl, nextProps.sourceUrl)
    }
  }

  componentDidMount() {
    this._fetchAndSetState(this.props.atlasUrl, this.props.sourceUrl)
  }

  render() {
    const {height, highlightSeries, resourcesUrl} = this.props
    const {series, loading, error} = this.state

    return(
      error ?
        <div style={{textAlign: `center`}}><p>Error: {error.toString()}</p></div> :

        <div style={{position: `relative`}}>
          <ScatterPlot series={series} highlightSeries={highlightSeries} height={height}/>
          <LoadingOverlay show={loading}
                          resourcesUrl={resourcesUrl}/>
        </div>
    )
  }
}

PlotLoader.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  sourceUrl: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string,
  highlightSeries: PropTypes.array,
  height: PropTypes.number
}

export default PlotLoader
