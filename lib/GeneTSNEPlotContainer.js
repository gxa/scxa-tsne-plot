'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _ScatterPlot = require('./ScatterPlot.js');

var _ScatterPlot2 = _interopRequireDefault(_ScatterPlot);

var _atlasAutocomplete = require('atlas-autocomplete');

var _atlasAutocomplete2 = _interopRequireDefault(_atlasAutocomplete);

var _fetchExpressionData = require('./fetchExpressionData.js');

var _fetchExpressionData2 = _interopRequireDefault(_fetchExpressionData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var referencePlotOptions = {
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
        formatter: function formatter() {
            return '<b>' + this.point.name + '</b><br>Assignment Probability: ' + this.point.value;
        }
    }
};

var expressionPlotOptions = function expressionPlotOptions(chosenGene) {
    return Object.assign({}, referencePlotOptions, {
        title: {
            text: chosenGene ? "Gene expression: " + chosenGene : "Gene expression"
        },
        tooltip: {
            formatter: function formatter() {
                return '<b>' + this.point.name + '</b><br>Gene Expression: ' + this.point.value;
            }
        }
    });
};

var adjustDatasetWithFetchedExpressionData = function adjustDatasetWithFetchedExpressionData(dataset, expressionData) {
    return dataset.map(function (series) {
        return Object.assign({}, series, {
            data: series.data.map(function (point) {
                return {
                    x: point.x,
                    y: point.y,
                    name: point.name,
                    value: expressionData[point.name] || 0.0
                };
            })
        });
    });
};

var applyColorScaleToDataset = function applyColorScaleToDataset(dataset, colorScale) {
    return dataset.map(function (series) {
        return Object.assign({}, series, {
            data: series.data.map(function (point) {
                return Object.assign({}, point, {
                    color: point.value ? colorScale(point.value) : "gainsboro"
                });
            })
        });
    });
};

var expressionPlotData = function expressionPlotData(chosenGene, expressionData) {
    var dataset = adjustDatasetWithFetchedExpressionData(require("./cannedGraphData.json"), expressionData);

    var pointValues = dataset.map(function (series) {
        return series.data.map(function (point) {
            return point.value;
        });
    });
    var allValues = [].concat.apply([], pointValues);
    var minValue = (0, _d3Array.min)(allValues);
    var maxValue = (0, _d3Array.max)(allValues);
    var meanValue = (maxValue - minValue) / 2 + minValue;
    var gradientDomain = [minValue, meanValue, maxValue];
    var colorScale = (0, _d3Scale.scaleLinear)().domain(gradientDomain).range(["#8cc6ff", "#0000ff", "#0000b3"]);

    var step = (maxValue - minValue) / 10;
    var colorClasses = [{
        from: 0,
        to: 0.0000001,
        color: "gainsboro"
    }].concat((0, _range2.default)(minValue, maxValue, step).filter(function (i) {
        return i > 0;
    }).map(function (i) {
        return {
            from: i,
            to: i + step,
            color: colorScale(i)
        };
    }));

    return {
        dataset: applyColorScaleToDataset(dataset, colorScale),
        colorRanges: colorClasses,
        options: expressionPlotOptions(chosenGene)
    };
};

var GeneTSNEPlotContainer = function (_React$Component) {
    _inherits(GeneTSNEPlotContainer, _React$Component);

    function GeneTSNEPlotContainer(props) {
        _classCallCheck(this, GeneTSNEPlotContainer);

        var _this = _possibleConstructorReturn(this, (GeneTSNEPlotContainer.__proto__ || Object.getPrototypeOf(GeneTSNEPlotContainer)).call(this, props));

        _this.state = {
            expressionPlotData: expressionPlotData("", {}),
            loading: false,
            geneSelected: ""
        };

        _this.geneSelectedOnChange = _this._geneSelectedOnChange.bind(_this);
        return _this;
    }

    _createClass(GeneTSNEPlotContainer, [{
        key: 'fetchExpressionPlotData',
        value: function fetchExpressionPlotData(chosenItem) {
            var _this2 = this;

            if (chosenItem) {
                var url = this.props.referenceDataSourceUrlTemplate.replace(/\{0\}/, chosenItem);
                this.setState({ loading: true }, (0, _fetchExpressionData2.default)(chosenItem, url, function (expressionData) {
                    _this2.setState({
                        loading: false,
                        expressionPlotData: expressionPlotData(chosenItem, expressionData)
                    });
                }));
            } else {
                this.setState({ loading: false, expressionPlotData: expressionPlotData("", {}) });
            }
        }
    }, {
        key: '_geneSelectedOnChange',
        value: function _geneSelectedOnChange(value) {
            this.setState({ geneSelected: value });

            this.fetchExpressionPlotData(value);
            this.props.onSelect(value);
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(_atlasAutocomplete2.default, { atlasUrl: this.props.atlasUrl,
                    suggesterEndpoint: this.props.suggesterEndpoint,
                    showOnlyGeneAutocomplete: true,
                    geneBoxStyle: 'columns small-6',
                    onSelect: this.geneSelectedOnChange
                }),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'columns small-12 margin-top-large' },
                        this.state.loading ? _react2.default.createElement(
                            'div',
                            null,
                            _react2.default.createElement('img', { src: "https://www.ebi.ac.uk/gxa/resources/images/loading.gif" })
                        ) : _react2.default.createElement(_ScatterPlot2.default, this.state.expressionPlotData)
                    )
                )
            );
        }
    }]);

    return GeneTSNEPlotContainer;
}(_react2.default.Component);

GeneTSNEPlotContainer.propTypes = {
    atlasUrl: _propTypes2.default.string.isRequired,
    suggesterEndpoint: _propTypes2.default.string.isRequired,
    referenceDataSourceUrlTemplate: _propTypes2.default.string,
    onSelect: _propTypes2.default.func
};

exports.default = GeneTSNEPlotContainer;