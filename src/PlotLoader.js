import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import ScatterPlot from './ScatterPlot'

class PlotLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      timestamp: 0,
      series: []
    }
  }

  _fetch(base, endpoint) {
    fetch(URI(endpoint, base).toString())
      .then((response) => response.json())
      .then((json) => { this.setState({timestamp: Date.now(), series: json}, this.forceUpdate) })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sourceUrl !== nextProps.sourceUrl || this.props.atlasUrl !== nextProps.atlasUrl) {
      this._fetch(nextProps.atlasUrl, nextProps.sourceUrl)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this._fetch(this.props.atlasUrl, this.props.sourceUrl)
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
