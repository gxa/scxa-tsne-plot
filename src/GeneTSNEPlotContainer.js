import React from 'react';
import PropTypes from 'prop-types';

import ScatterPlot from './ScatterPlot.js';
import _groupBy from 'lodash/groupBy';
import AtlasAutocomplete from 'atlas-autocomplete';

const referencePlotOptions = {
    chart: {
        width: 520,
        type: "scatter",
        zoomType: "xy",
        borderWidth: 2,
        borderColor: "#30426A"
    },
    xAxis: {
        title: {
            text: "Latent Variable 1"
        }
    },
    yAxis: {
        title: {
            text: "Latent Variable 2"
        }
    },
    title: {
        text: "Single Cells - t-SNE based on expression similarity"
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.point.label + '</b>'
        }
    }
}

const getSeriesMap = (clustersData, clustersChosen) => (
    new Map(clustersData[clustersChosen] || [])
)

const getDataSeries = (m) => {
    const seriesGroups = _groupBy(require('./tsne-coords.json'), (point) => m.get(point.label));
    const result = [];
    for (let ix of Object.keys(seriesGroups)) {
        result[ix] = {
            name: "Cluster " + ix,
            data: seriesGroups[ix]
        }
    }
    return result
}


class GeneTSNEPlotContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            geneSelected: "",
            geneChanged: false
        }

        this.geneSelectedOnChange = this._geneSelectedOnChange.bind(this);
    }


    _geneSelectedOnChange(value) {
        this.setState({ geneSelected: value,
                        geneChanged: !this.state.geneChanged});

        this.props.onSelect(value);
    }

    componentDidMount() {
        this.setState({ geneChanged: true });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ geneChanged: true });
    }

    render() {

        const clusterSelected = this.props.k ? this.props.k : Object.keys(this.props.clustersData)[0];

        return (
            <div className="row">
                <AtlasAutocomplete atlasUrl={this.props.atlasUrl}
                                   suggesterEndpoint={this.props.suggesterEndpoint}
                                   showOnlyGeneAutocomplete={true}
                                   initialValue={this.props.geneId}
                                   geneBoxStyle={'columns small-6'}
                                   onSelect={this.geneSelectedOnChange}
                />
                <div className="row">
                    <div className="columns small-12 margin-top-large">
                        { this.state.loading ?
                            <div>
                                <img src={"https://www.ebi.ac.uk/gxa/resources/images/loading.gif"}/>
                            </div> :
                            <ScatterPlot dataset={getDataSeries(getSeriesMap(this.props.clustersData, clusterSelected))}
                                         options={referencePlotOptions}
                                         k={clusterSelected}
                                         geneChanged={this.state.geneChanged} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
GeneTSNEPlotContainer.propTypes = {
    atlasUrl: PropTypes.string.isRequired,
    suggesterEndpoint: PropTypes.string.isRequired,
    referenceDataSourceUrlTemplate: PropTypes.string,
    clustersData: PropTypes.object.isRequired,
    k: PropTypes.string,
    geneId: PropTypes.string,
    onSelect: PropTypes.func
};

export default GeneTSNEPlotContainer;