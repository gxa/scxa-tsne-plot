import React from 'react'
import ReactDOM from 'react-dom'

import DynamicScatterPlot from '../src/index'

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: `json/experiments/E-MTAB-4388/tsneplot/clusters/2`,
      sourceUrl: `json/experiments/E-MTAB-4388/tsneplot/clusters/2`
    }

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleInputChange(event) {
    this.setState({
      inputValue: event.target.value
    })
  }

  _handleSubmit(event) {
    event.preventDefault()

    this.setState({
      sourceUrl: this.state.inputValue
    })
  }

  render() {
    return (
      <div>
        <DynamicScatterPlot sourceUrl={this.state.sourceUrl} atlasUrl={`https://localhost:8443/gxa_sc/`}/>
        <form onSubmit={this._handleSubmit}>
          <input type={`text`} onChange={this._handleInputChange} value={this.state.inputValue}/>
          <input className={`button`} type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
