import React from 'react';
import ReactDOM from 'react-dom';

import GeneTSNEPlotContainer from './GeneTSNEPlotContainer.js';

const render = function (options, container) {
    ReactDOM.render(<GeneTSNEPlotContainer {...options} />, document.getElementById(container));
};

export {GeneTSNEPlotContainer as default, render};