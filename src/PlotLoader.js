import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import LoadingOverlay from './LoadingOverlay'
import ScatterPlot from './ScatterPlot'

const _fetch = async (base, endpoint) => {
  const response = await fetch(URI(endpoint, base).toString())
  const responseJson = await response.json()
  return responseJson
}

class PlotLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // timestamp: 0,
      series: [],
      loading: false,
      errorMessage: null
    }

    this._fetchAndSetState = this._fetchAndSetState.bind(this)
  }

  render() {
    const {resourcesUrl, seriesMapper, highchartsConfig} = this.props
    const {series, loading, errorMessage} = this.state

    return(
      errorMessage ?
        <div className={`scxa-error`} style={{textAlign: `center`}}><p>{errorMessage}</p></div> :

        <div style={{position: `relative`}}>
          <ScatterPlot series={seriesMapper(series)} highchartsConfig={highchartsConfig}/>
          <LoadingOverlay show={loading} resourcesUrl={resourcesUrl}/>
        </div>
    )
  }

  _fetchAndSetState(baseUrl, relUrl) {
    this.setState({
      loading: true
    })
    return _fetch(baseUrl, relUrl)
      .then((responseJson) => {
        this.setState({
          // timestamp: Date.now(),
          series: responseJson,
          loading: false,
          errorMessage: null
        })
      })
      .catch((reason) => {
        this.setState({
          // timestamp: Date.now(),
          errorMessage: `${reason.name}: ${reason.message}`,
          loading: false
        })
      })
  }

  componentDidMount() {
    return this._fetchAndSetState(this.props.atlasUrl, this.props.sourceUrl)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.atlasUrl !== this.props.atlasUrl || nextProps.sourceUrl !== this.props.sourceUrl) {
      return this._fetchAndSetState(nextProps.atlasUrl, nextProps.sourceUrl)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.seriesMapper !== this.props.seriesMapper ||
           nextProps.highchartsConfig !== this.props.highchartsConfig ||
           nextState.series !== this.state.series ||
           nextState.loading !== this.state.loading ||
           nextState.errorMessage !== this.state.errorMessage
  }

  componentDidCatch(error, info) {
    this.setState({
       errorMessage: `${error}`
     })
  }
}

PlotLoader.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  sourceUrl: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string,
  seriesMapper: PropTypes.func,
  highchartsConfig: PropTypes.object
}

PlotLoader.defaultProps = {
  seriesMapper: (series) => series,
  highchartsConfig: {}
}

export default PlotLoader
