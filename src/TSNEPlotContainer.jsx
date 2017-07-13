"use strict";

//*------------------------------------------------------------------*

const React = require('react')
const ScatterPlot = require('./ScatterPlot.jsx')

const _groupBy = require(`lodash/groupBy`)

import {DropdownButton, MenuItem} from 'react-bootstrap'
//*------------------------------------------------------------------*
const referencePlotOptions = {
    "chart": {
      width: 520,
      "type": "scatter",
      "zoomType": "xy",
      "borderWidth": 2,
      "borderColor": "#30426A"
    },
    "xAxis": {
      "title": {
        "text": "Latent Variable 1"
      }
    },
    "yAxis": {
      "title": {
        "text": "Latent Variable 2"
      }
    },
    "title" : {
      text: "Single Cells - t-SNE based on expression similarity"
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.point.label + '</b>'
      }
    }
}

const getSeriesMap = (clustersChosen) => (
   new Map(require('./clusters.json')[clustersChosen] || [])
)

const colors = ['red', '#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9',
              '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];

const getDataSeries = (m) => {
  const seriesGroups = _groupBy(require('./tsne-coords.json'), (point) => m.get(point.label))
  const result = []
  for(let ix of Object.keys(seriesGroups)) {
    result[ix] = {
      name: "Cluster "+ix,
      color: colors[ix],
      data: seriesGroups[ix]
    }
  }
  return result
}


const PlotContainer = React.createClass({

  getInitialState: function() {
    return {
      clustersChosen: Object.keys(require('./clusters.json')).sort()[0]
    }
  },

  render: function () {
    return (
      <div>
        <h5>
          Clustering plot
        </h5>
        <div className="row">
        <DropdownButton title={"Clustering: "+this.state.clustersChosen} id="bg-nested-dropdown">
          {
            Object.keys(require('./clusters.json'))
            .sort()
            .map((name, ix)=> (
              <MenuItem
                key={ix}
                onClick={()=>this.setState({clustersChosen: name})}
                eventKey={ix}>{name}</MenuItem>
            ))
          }
        </DropdownButton>
        <ScatterPlot
          dataset={getDataSeries(getSeriesMap(this.state.clustersChosen))}
          options={referencePlotOptions}
        />
        </div>
        <div className="row" style={{fontSize:"xs"}}>
          <span> Clustering computed using </span>
          <a href="http://biorxiv.org/content/early/2016/01/13/036558">
            SC3
          </a>
        </div>
      </div>
    )
  }
});

module.exports = PlotContainer;
