import React from 'react';
import ReactDOM from 'react-dom';

import ReferencePlotContainer from './ReferencePlotContainer.js';

const render = function (options, container) {
    ReactDOM.render(<ReferencePlotContainer {...options} />, document.getElementById(container));
};

export {ReferencePlotContainer as default, render};