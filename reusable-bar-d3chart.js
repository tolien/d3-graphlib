timeSeriesBarChart = function() {
    var barChart = timeSeriesChart();
    barChart.components([barComponent()]);
    return barChart;
};

function barComponent() {
var bar = {

    draw: function(selection, chart, X, Y) {
	var xScale = chart.xScale();
	var yScale = chart.yScale();
    var seriesColor = this.attr('color');
    var yDomain = yScale.domain();
				
				var yDomainRange = yDomain[1] - yDomain[0];
				if (yDomainRange < 2) {
					chart.yAxis().tickFormat(d3.format('.2f'));
				}
				else if (yDomainRange < 5) {
				    chart.yAxis().tickFormat(d3.format('.1f'));
				}
		    
		    var data = this.data();
		        var margin = chart.margin();
        width = chart.width();
        height = chart.height();
		    var barWidth = 0;

            if (data.length > 0 && data[0].length > 0) {
                barWidth = (width - margin.left - margin.right) / data[0].length;
            } else {
                barWidth = (width - margin.legt - margin.right);
            }

                        var point = this.selectAll('svg .bar').data(function(d, i) { return d; });
						point.enter().append("rect")
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
								return yScale(0) - yScale(Y(d));
							});


    
    },
    update: function(selection, X, Y, chart) {
		    var seriesColor = this.attr('color');
        var xScale = chart.xScale();
        var yScale = chart.yScale();

		    var data = this.data();
		        var margin = chart.margin();
        width = chart.width()
        height = chart.height();
		    var barWidth = 0;

            if (data.length > 0 && data[0].length > 0) {
                barWidth = (width - margin.left - margin.right) / data[0].length;
            } else {
                barWidth = (width - margin.legt - margin.right);
            }
        
				var point = this.selectAll(".bar");
point= point.data(function(d) { return d; } )
				point.attr("x", function(d, i) {
					return xScale(d[0]);
				})
				.attr("y", function(d, i) {
					return yScale(d[1]);
				})
				.attr("width", barWidth)
				.attr("height", function(d) {
					return yScale(0) - yScale(d[1]);
				});
						point.enter().append("rect")
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
								return yScale(0) - yScale(d[1]);
							});
    
    }
};

return bar;
}
