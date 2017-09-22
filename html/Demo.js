import React from 'react'
import ReactDOM from 'react-dom'

import ScatterPlot from '../src/index'

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputBaseUrl: `https://localhost:8443/gxa_sc/`,
      baseUrl: `https://localhost:8443/gxa_sc/`,
      inputSourceUrl: `json/experiments/E-MTAB-4388/tsneplot/clusters/2`,
      sourceUrl: `json/experiments/E-MTAB-4388/tsneplot/clusters/2`
    }

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleInputChange(stateField) {
    return (event) => {
      this.setState({
        [stateField]: event.target.value
      })
    }
  }

  _handleSubmit(event) {
    event.preventDefault()

    this.setState({
      sourceUrl: this.state.inputSourceUrl,
      highlightSeries: this.state.inputHighlightSeries
    })
  }

  render() {
    return (
      <div>
        <div className={`row column`}>
          <ScatterPlot atlasUrl={this.state.baseUrl}
                       sourceUrl={this.state.sourceUrl}/>
        </div>

        <div className={`row column`}>
          <form onSubmit={this._handleSubmit}>
            <label>Base URL:</label>
            <input type={`text`} onChange={this._handleInputChange(`inputBaseUrl`)} value={this.state.inputBaseUrl}/>
            <label>Endpoint (returns a <a href="http://api.highcharts.com/highcharts/series%3Cscatter%3E.data">series&lt;scatter&gt;.data</a> object):</label>
            <input type={`text`} onChange={this._handleInputChange(`inputSourceUrl`)} value={this.state.inputSourceUrl}/>
            <input className={`button`} type="submit" value="Submit" />
          </form>
        </div>
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
