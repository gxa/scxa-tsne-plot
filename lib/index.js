'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _GeneTSNEPlotContainer = require('./GeneTSNEPlotContainer.js');

var _GeneTSNEPlotContainer2 = _interopRequireDefault(_GeneTSNEPlotContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = function render(options, container) {
    _reactDom2.default.render(_react2.default.createElement(_GeneTSNEPlotContainer2.default, options), document.getElementById(container));
};

exports.default = _GeneTSNEPlotContainer2.default;
exports.render = render;