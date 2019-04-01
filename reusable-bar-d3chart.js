timeSeriesBarChart = function() {
    var yAxisLabelFormatter = function() {
        return function(chart) {
            var yScale = chart.yScale();
            var yDomain = yScale.domain();

            var yDomainRange = yDomain[1] - yDomain[0];
            if (yDomainRange < 2) {
                chart.yAxis()
                    .tickFormat(d3.format('.2f'));
            } else if (yDomainRange < 5) {
                chart.yAxis()
                    .tickFormat(d3.format('.1f'));
            }
        }
    };

    var barChart = timeSeriesChart();
    barChart.components([barComponent()]);
    barChart.yAxisLabelFormatter(yAxisLabelFormatter());
    return barChart;
};

function barComponent() {
    var bar = {

        draw: function(selection, chart, X, Y) {
            var xScale = chart.xScale();
            var yScale = chart.yScale();
            var seriesColor = selection.attr('color');
            var data = selection.data();
            var margin = chart.margin();
            width = chart.width();
            height = chart.height();
            var barWidth = 0;
            var yDomain = yScale.domain();

            if (data.length > 0 && data[0].length > 0) {
                barWidth = (width - margin.left - margin.right) / data[0].length;
            } else {
                barWidth = (width - margin.left - margin.right);
            }

            var point = selection.selectAll('svg .bar')
                .data(function(d, i) {
                    return d;
                });
            point.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("fill", function(d, i) {
                    return seriesColor;
                })
                .attr("x", function(d, i) {
                    return xScale(d[0]);
                })
                .attr("y", function(d, i) {
                    return yScale(d[1]);
                })
                .attr("width", barWidth)
                .attr("height", function(d) {
                    // return height - margin.top - margin.bottom - yScale(d[1]);
                    return yScale(yDomain[0]) - Y(d);
                });



        },
        update: function(selection, X, Y, chart) {
            var seriesColor = selection.attr('color');
            var xScale = chart.xScale();
            var yScale = chart.yScale();

            var yDomain = yScale.domain();

            var data = selection.data();
            var margin = chart.margin();
            width = chart.width()
            height = chart.height();
            var barWidth = 0;

            if (data.length > 0 && data[0].length > 0) {
                barWidth = (width - margin.left - margin.right) / data[0].length;
            } else {
                barWidth = (width - margin.legt - margin.right);
            }
            barWidth = Math.floor(barWidth - 2);

            var barStarts = [];
            data[0].map(function(d, i) {
                barStarts[i] = xScale(d[0])
            })

            var point = selection.selectAll(".bar");
            point = point.data(function(d) {
                return d;
            })
            point.attr("x", function(d, i) {
                    return xScale(d[0]);
                })
                .attr("y", function(d, i) {
                    return yScale(d[1]);
                })
                .attr("width", function(d, i) {
                    if (i < barStarts.length - 1) {
                        return barStarts[i + 1] - barStarts[i] - 1;
                    } else {
                        // originally, this assumed that the right-most bar ended at the RHS of the chart
                        // this assumption clearly doesn't hold
                        // change this to use the width of the preceding bar
                        // return (width - margin.left - margin.right) - barStarts[i] - 5;;
                        return barStarts[i] - barStarts[i - 1] - 1;
                    }
                })
                .attr("height", function(d) {
                    return yScale(yDomain[0]) - Y(d);
                });
        },


    };

    bar.updateXRange = function() {

    }


    return bar;
}