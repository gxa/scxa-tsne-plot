# Single Cell Atlas t-SNE scatter plot

An aesthetically-opinionated Highcharts scatter plot which gets the displayed data over the network using `fetch`.

There are two render modes: cluster mode and gene expression mode.

## Cluster mode
The request returns multiple series in an array, each one labelled with the cluster ID and the points have plane coordinates `x` and `y` plus a descriptive `name`. Each series has a distinctive colour and shape. Colours were chosen using http://tools.medialab.sciences-po.fr/iwanthue/. The tooltip displays the point name and its cluster.  

## Gene expression mode
The  data has only one series whose points have two coordinates, `x` and `y`, and a `z` value which is interpreted as the expression level of the requested gene. The points are coloured linearly from grey to blue according to the minimum and maximum expression level. The exact expression level is displayed in the point tooltip along with the point name.