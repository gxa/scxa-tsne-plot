import React from 'react';
import PropTypes from 'prop-types';

import {min as d3min, max as d3max} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import range from 'lodash/range';

import ScatterPlot from './ScatterPlot.js';
import AtlasAutocomplete from 'atlas-autocomplete';

import fetchExpressionData from './fetchExpressionData.js';

const referencePlotOptions = {
    chart: {
        type: "scatter",
        zoomType: "xy",
        borderWidth: 2,
        borderColor: "#30426A"
    },
    xAxis: {
        title: {
            text: "Latent Variable 1 (Associated with Proliferation)"
        }
    },
    yAxis: {
        title: {
            text: "Latent Variable 1 (Associated with Differentiation)"
        }
    },
    title: {
        text: "Th Trend Assignment Probability"
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.point.name + '</b><br>Assignment Probability: ' + this.point.value
        }
    }
}

const expressionPlotOptions = (chosenGene) => Object.assign({},
    referencePlotOptions,
    {
        title: {
            text: chosenGene ? "Gene expression: " + chosenGene : "Gene expression"
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.point.name + '</b><br>Gene Expression: ' + this.point.value
            }
        }
    }
)

const adjustDatasetWithFetchedExpressionData = function (dataset, expressionData) {
    return dataset.map(series => {
        return (
            Object.assign({},
                series,
                {
                    data: series.data.map(point =>
                        ({
                            x: point.x,
                            y: point.y,
                            name: point.name,
                            value: expressionData[point.name] || 0.0
                        })
                    )
                }
            )
        )
    })
}

const applyColorScaleToDataset = function (dataset, colorScale) {
    return dataset.map(series => {
        return (
            Object.assign({},
                series,
                {
                    data: series.data.map(point => (
                            Object.assign({}, point, {
                                color: point.value ? colorScale(point.value) : "gainsboro"
                            })
                        )
                    )
                }
            )
        )
    })
}

const expressionPlotData = function (chosenGene, expressionData) {
    const dataset = adjustDatasetWithFetchedExpressionData(
        require("./cannedGraphData.json"),
        expressionData
    );


    const pointValues = dataset.map(function (series) {
        return series.data.map(function (point) {
            return point.value;
        });
    });
    const allValues = [].concat.apply([], pointValues);
    const minValue = d3min(allValues);
    const maxValue = d3max(allValues);
    const meanValue = (maxValue - minValue) / 2 + minValue;
    const gradientDomain = [minValue, meanValue, maxValue];
    const colorScale = scaleLinear()
        .domain(gradientDomain)
        .range(["#8cc6ff", "#0000ff", "#0000b3"]);

    const step = (maxValue - minValue) / 10
    const colorClasses = [{
        from: 0,
        to: 0.0000001,
        color: "gainsboro"
    }].concat(
        range(minValue, maxValue, step)
            .filter((i) => i > 0)
            .map((i) => (
                {
                    from: i,
                    to: i + step,
                    color: colorScale(i)
                }
            ))
    )


    return {
        dataset: applyColorScaleToDataset(dataset, colorScale),
        colorRanges: colorClasses,
        options: expressionPlotOptions(chosenGene)
    }
}


class GeneTSNEPlotContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expressionPlotData: expressionPlotData("", {}),
            loading: false,
            geneSelected: ""
        }

        this.geneSelectedOnChange = this._geneSelectedOnChange.bind(this);
    }

    fetchExpressionPlotData(chosenItem) {
        if (chosenItem) {
            const url = this.props.referenceDataSourceUrlTemplate.replace(/\{0\}/, chosenItem)
            this.setState({loading: true},
                fetchExpressionData(chosenItem, url, (expressionData) => {
                    this.setState({
                        loading: false,
                        expressionPlotData: expressionPlotData(chosenItem, expressionData),
                    })
                })
            )
        } else {
            this.setState({loading: false, expressionPlotData: expressionPlotData("", {})})
        }
    }

    _geneSelectedOnChange(value) {
        this.setState({geneSelected: value});

        this.fetchExpressionPlotData(value);
    }

    render() {

        return (
            <div>
                <h5>
                    Gene expression plot
                </h5>

                <AtlasAutocomplete atlasUrl={this.props.atlasUrl}
                                   suggesterEndpoint={this.props.suggesterEndpoint}
                                   showOnlyGeneAutocomplete={true}
                                   geneBoxStyle={'columns small-5 small-offset-7'}
                                   onSelect={this.geneSelectedOnChange}
                />
                <div className="row">
                    <div className="columns small-6 small-offset-6 margin-top-large">
                        { this.state.loading ?
                            <div>
                                <img src={"https://www.ebi.ac.uk/gxa/resources/images/loading.gif"}/>
                            </div> :
                            <ScatterPlot {...this.state.expressionPlotData}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
GeneTSNEPlotContainer.propTypes = {
    referenceDataSourceUrlTemplate: PropTypes.string,
    altasUrl: PropTypes.string.isRequired,
    suggesterEndpoint: PropTypes.string.isRequired
};

export default GeneTSNEPlotContainer;