"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

//*------------------------------------------------------------------*

const TSNEPlotContainer = require('./TSNEPlotContainer.jsx');


exports.render = function(options) {

    ReactDOM.render(
        React.createElement(
            TSNEPlotContainer,
            {referenceDataSourceUrlTemplate: options.referenceDataSourceUrlTemplate}
        ),
        (typeof options.target === "string") ? document.getElementById(options.target) : options.target
    );
};
