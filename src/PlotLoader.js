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

  _fetchAndSetState() {
    this.setState({
      loading: true
    })
    return _fetch(this.props.atlasUrl, this.props.sourceUrl)
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
    return this._fetchAndSetState()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.atlasUrl !== this.props.atlasUrl || nextProps.sourceUrl !== this.props.sourceUrl) {
      return this._fetchAndSetState()
    }
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
