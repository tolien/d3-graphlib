function timeSeriesChart() {
	var margin = {
		top: 20,
		right: 80,
		bottom: 30,
		left: 60
	},
		width = 600,
		height = 300,
		xValue = function(d) {
			return d[0];
		},
		yValue = function(d) {
			return d[1];
		},
		xScale = d3.time.scale(),
		yScale = d3.scale.linear(),
		xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format("d")),
		legendItems = [],
	components = [
		lineComponent(), 
		pointsComponent()
	],
	color = d3.scale.category10(),		
	yAxisText = "";

	function chart(selection) {
		xAxis.tickSize(-(height - margin.bottom - margin.top), 0);
		yAxis.tickSize(-(width - margin.left - margin.right), 0);


		selection.each(function(data) {

			// Convert data to standard representation greedily;
			// this is needed for nondeterministic accessors.
			data = data.map(function(d, i) {
				return d.map(function(d, i) {
					return [xValue.call(data, d, i), yValue.call(data, d, i)];
				});
			});

			// Update the x-scale.
			var xmin = d3.min(data.map(function(d, i) {
				return d3.min(d, function(d) {
					return d[0];
				});
			}));
			var xmax = d3.max(data.map(function(d, i) {
				return d3.max(d, function(d) {
					return d[0];
				});
			}));
			xScale
				.domain([xmin, xmax])
				.range([0, width - margin.left - margin.right]);

			// Update the y-scale.
			var ymin = d3.min(data.map(function(d, i) {
				return d3.min(d, function(d) {
					return d[1];
				});
			}));
			var ymax = d3.max(data.map(function(d, i) {
				return d3.max(d, function(d) {
					return d[1];
				});
			}));

			if (ymin != 0) {
			    var yrange = ymax - ymin;
    			var ymid = ymin + (yrange / 2);
    			yrange = yrange * 1.2;
    			ymax = ymid + (yrange / 2);
    			ymin = ymid - (yrange / 2);
    	    }
			yScale
				.domain([ymin, ymax])
				.range([height - margin.top - margin.bottom, 0]);
				
			// Select the svg element, if it exists.
			var svg = d3.select(this).selectAll("svg").data([data]);

			// Otherwise, create the skeletal chart.
			var gEnter = svg.enter().append("svg").append("g");
			var legend;
			if (legendItems.length > 0) {
				legend = gEnter.append('g').attr('class', 'legend');
			}
			data.map(function(d, i) {
				var seriesColor = color(i);

				if (legendItems[i] && legend.node()) {
					var legendEntry = legend.append('g').attr('class', 'legendentry');
					legendEntry.attr("transform", "translate(" + i * (legend.node().getBBox().width + 10) + ", 0)");

					legendEntry.append('svg:circle')
						.attr("class", "point")
						.attr("stroke", function(data, index) {
							return seriesColor;
						})
						.attr("fill", function(d, i) {
							return seriesColor;
						})
						.attr("r", function(d, i) {
							return 4;
						});
					legendEntry.append('text').text(legendItems[i]).attr('transform', 'translate(10, 5)');
				}

				var series = gEnter.append("g").attr('class', 'grapharea');
				series.data([d]);
//                series.data(function(d, i) { return d; });
				
				if (series.node()) {
					series.attr('color', seriesColor);
				
					components.forEach(function(component) {
					    series.call(component.draw, chart, X, Y);
					});
				}

				svg.exit()
					.transition(0)
					.remove();

			});
			gEnter.append("g").attr("class", "x axis");
			gEnter.append("g").attr("class", "y axis")
				.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 6)
				.attr('dy', '-4em')
				.style('text-anchor', 'end')
				.text(yAxisText);

			// Update the outer dimensions.
			svg.attr("width", width)
				.attr("height", height);

			// Update the inner dimensions.
			var g = svg.select("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var series = svg.selectAll(".grapharea");
			series.data(function(d) {
				return d;
			});

			// Update the x-axis.
			if (xScale.ticks().length > 10) {
				xAxis = xAxis.ticks(5);
				xScale = xScale.nice();
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

					// Update the line path.
        
       // console.log(g);
//        console.log(series);
/*            var lastItem = series.data()[0].pop();
            console.log(lastItem);
            series.data()[0].push(lastItem);
            lastItem = series.data()[1].pop();
            console.log(lastItem);
            series.data()[1].push(lastItem);
  */          
            components.forEach(function(component) {
                series.call(component.update, X, Y, chart);
            });
						

			if (legend && legend.node()) {
				var legendTranslation = width - margin.left - margin.right - legend.node().getBBox().width;
				legend.attr('transform', 'translate(' + legendTranslation + ', -15)');
			}
			

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
	};

	chart.legend = function(_) {
		if (!arguments.length) return legendItems;
		legendItems = _;
		return chart;
	};
	
	chart.components = function(_) {
	    if (!arguments.length) return components;
	    components = _;
	    return chart;
	};
	
	chart.xScale = function(_) {
	    if (!arguments.length) return xScale;
	    xScale = _;
	    return chart;
    };
    
    chart.yScale = function(_) {
        if (!arguments.length) return yScale;
        yScale = _;
        return chart;
   };
	 
	 chart.yAxis = function(_) {
		 if (!arguments.length) return yAxis;
		 yAxis = _;
		 return chart;
	 }

	return chart;
}

function lineComponent() {
	var plotLine = {
		line: d3.svg.line(),
			draw : function(selection, chart, X, Y) {	
				
				var line = plotLine.line.x(X).y(Y);
		    var seriesColor = this.attr('color');
					//			console.log(seriesColor);
			var path = this.append("path").attr("class", "line").style("stroke", function(d) {
				return seriesColor;
			});
			
			//console.log(this.data());
			
			//path.attr('d', line)
			// console.log("plotLine.draw called on " + this);
		},
		update: function(selection, X, Y, chart){
        this.select(".line").data(function(d, i) { return d;} );
			
				var line = plotLine.line.x(X).y(Y);
				this.selectAll(".line")
					.attr("d", line);
					
					// console.log("plotLine.update called on " + this);

		}
	};
	return plotLine;
}

function pointsComponent() {
	var plotPoints = {
		draw: function(selection, chart, X, Y) {
			var seriesColor = this.attr('color');
			var xScale = chart.xScale();
			var yScale = chart.yScale();

			// add points
			var point = this.selectAll(".point")
				.data(function(d, i) {
					//console.log(d);
					return d;
				});


			point.enter().append("svg:circle")
				.attr("class", "point")
				.attr("stroke", function(data, index) {
					return seriesColor;
				})
				.attr("fill", function(d, i) {
					return seriesColor;
				})
				.attr("r", function(d, i) {
					return 3;
				})
				.attr("cx", function(d, i) {
					if (xScale(d[0]) < 0) {
						this.remove();
					}
					return xScale(d[0]);
				})
				.attr("cy", function(d, i) {
					return yScale(d[1]);
				})
				.style("pointer-events", "all")
				.on("mouseover", function(d) {
					var div = d3.selectAll('.tooltip');
					var parent = d3.select(this.parentElement).selectAll('.line');
					this.style.opacity = 1;
					div.transition()
						.duration(200)
						.style("opacity", null)
						.style("border-color", color(d.series));
					div.html(formatTime(d[0]) + "<br />" + formatValue(d[1]) + " &deg;C")
						.style("left", 5 + d3.event.pageX + "px")
						.style("top", (d3.event.pageY - 28) + "px");

				})
				.on("mouseout", function(d) {
					var div = d3.selectAll('.tooltip');
					this.style.opacity = "";
					div.transition(200).style("opacity", 0);
				});

			// console.log("plotPoints.draw called on " + selection);
		},
		update: function(selection, X, Y, chart) {
            var xScale = chart.xScale();
            var yScale = chart.yScale();
			var point = selection.selectAll(".point");
	point = point.data(function(d) {
		return d;
	})
		.attr("cx", function(d, i) {
			if (xScale(d[0]) < 0) {
				this.remove();
			}
			return xScale(d[0]);
		})
		.attr("cy", function(d, i) {
			return yScale(d[1]);
			
		});
		
		// console.log("plotPoints.update called on " + selection);
		
		}

	};

return plotPoints;
}
