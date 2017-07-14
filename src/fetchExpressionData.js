"use strict";

const cannedData = require("./cannedGraphData.json")

const allNames = [].concat.apply([], cannedData.map((series)=>{
    return (
        series.data.map((point)=> point.name)
    )
}))

const randomExpressionValue = function () {
    //https://gist.github.com/nicolashery/5885280
    return Math.random()> 0.3 ? -Math.log(Math.random()) : 0.0;
}

const randomData = function() {
    const result = {};

    allNames.forEach((name)=>{
        result[name] = randomExpressionValue()
    })
    return result;
}

const main = function (chosenItem, url, cb)  {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = (e) => {
        const xhr = e.target;
        let results;
        if (xhr.responseType === 'json') {
            cb(xhr.response);
        } else {
            cb(JSON.parse(xhr.responseText));
        }
    };

    httpRequest.open('GET', url, true);
    httpRequest.responseType = 'json';
    httpRequest.send();
}


export default main;