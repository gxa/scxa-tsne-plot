"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var cannedData = require("./cannedGraphData.json");

var allNames = [].concat.apply([], cannedData.map(function (series) {
    return series.data.map(function (point) {
        return point.name;
    });
}));

var randomExpressionValue = function randomExpressionValue() {
    //https://gist.github.com/nicolashery/5885280
    return Math.random() > 0.3 ? -Math.log(Math.random()) : 0.0;
};

var randomData = function randomData() {
    var result = {};

    allNames.forEach(function (name) {
        result[name] = randomExpressionValue();
    });
    return result;
};

var main = function main(chosenItem, url, cb) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function (e) {
        var xhr = e.target;
        var results = void 0;
        if (xhr.responseType === 'json') {
            cb(xhr.response);
        } else {
            cb(JSON.parse(xhr.responseText));
        }
    };

    httpRequest.open('GET', url, true);
    httpRequest.responseType = 'json';
    httpRequest.send();
};

exports.default = main;