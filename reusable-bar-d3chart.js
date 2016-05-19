function timeSeriesBarChart() {
  var margin = {top: 20, right: 80, bottom: 30, left: 60},
      width = 600,
      height = 300,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      xScale = d3.time.scale(),
      yScale = d3.scale.linear(),
      xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-(height - margin.bottom - margin.top), 0),
      yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-(width - margin.left - margin.right), 0),
      color = d3.scale.category10(),
			barWidth = 0,
      yAxisText = "";

  function chart(selection) {
    selection.each(function(data) {
			
			if (data.length > 0 && data[0].length > 0) {
				barWidth = (width - margin.left - margin.right) / data[0].length;
			} else {
				barWidth = (width - margin.legt - margin.right);
			}

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return d.map(function(d, i) {
            return [xValue.call(data, d, i), yValue.call(data, d, i)];
          })
      });

      // Update the x-scale.
      var xmin = d3.min(data.map(function(d, i) {
        return d3.min(d, function(d) { return d[0]; })
      }));
      var xmax = d3.max(data.map(function(d, i) {
        return d3.max(d, function(d) { return d[0]; })
      }));
      xScale
          .domain([xmin, xmax])
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      var ymin = d3.min(data.map(function(d, i) { 
        return d3.min(d, function(d) { return d[1]; })
      }));
      var ymax = d3.max(data.map(function(d, i) { 
        return d3.max(d, function(d) { return d[1]; })
      }));
//      ymin = ymin * 0.9;
			ymax = ymax * 1;
	    if (ymax == 0) { ymax = 1; }
      yScale
          .domain([ymin, ymax])
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "x axis");
	  gEnter.append("g").attr("class", "y axis")
	.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('y', 6)
	.attr('dy', '-4em')
	.style('text-anchor', 'end')
	.text(yAxisText);

      data.map(function(d, i) {
    					var series = gEnter.append("g").attr('class', 'grapharea');
							series.data(function(d) { return d; })
							var seriesColor = color(i);

							
						var point = series.selectAll(".bar")
							.data(function(d, i) {
								//console.log(d);
								return d;
							});

						point
							.transition()
							.duration(0)
							.attr("x", function(d, i) {
								return xScale(d[0])
							})
							.attr("y", function(d, i) {
								return yScale(d[1])
							})
							.attr("height", function(d) {
								return height - margin.top - margin.bottom - yScale(d[1]);
							});

						point.enter().append("rect")
							.attr("class", "bar")
							.attr("fill", function(d, i) {
								return seriesColor;
							})
							.attr("x", function(d, i) {
								return xScale(d[0])
							})
							.attr("y", function(d, i) {
								return yScale(d[1])
							})
							.attr("width", barWidth)
							.attr("height", function(d) {
								return height - margin.top - margin.bottom - yScale(d[1]);
							})

						point.exit()
							.remove();
      });

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the x-axis.
      if (xScale.ticks().length > 10) {
          xAxis = xAxis.ticks(5);
					xScale = xScale.nice()
      }
      g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);
          
      // Update the y-axis
      g.select(".y.axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "-3em")
		.style("text-anchor", "end");
		
					var series = svg.selectAll(".grapharea")
					series.data(function(d) {
						return d;
					})
				var point = series.selectAll(".bar");
point = point.data(function(d) { return d; } )
				.attr("x", function(d, i) {
					return xScale(d[0])
				})
				.attr("y", function(d, i) {
					return yScale(d[1])
				})
				.attr("width", barWidth)
				.attr("height", function(d) {
					return height - margin.top - margin.bottom - yScale(d[1]);
				})
						point.enter().append("rect")
							.attr("class", "bar")
							.attr("fill", function(d, i) {
								return color(0);
							})
							.attr("x", function(d, i) {
								return xScale(d[0])
							})
							.attr("y", function(d, i) {
								return yScale(d[1])
							})
							.attr("width", barWidth)
							.attr("height", function(d) {
								return height - margin.top - margin.bottom - yScale(d[1]);
							})
	point.exit().remove();	
		

    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(d[1]);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };
	chart.yAxisText = function(_) {
		if (!arguments.length) return yAxisText;
		yAxisText = _;
		return chart;
	}

  return chart;
}
