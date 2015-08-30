Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
}

function chart(selection) {
  selection.each(function(data) {
  
  });
}



	var x, y, color, xAxis, yAxis, svg;
var formatTime = d3.time.format("%e %B %H:%M");

var margin = {
	top: 20,
	right: 80,
	bottom: 30,
	left: 50
},
	width = 600 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

	
function setup() {
	// a time scale object for the x axis?
	 x = d3.time.scale()
		.range([0, width]);

	// a linear scale object for the y axis?
	 y = d3.scale.linear()
		.range([height, 0]);

	// "an ordinal scale with a range of ten categorical colours"
	 color = d3.scale.category10();

	// a bottom-aligned X axis
	 xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// suppress the beginning/end ticks
	xAxis.outerTickSize(0);

	// a left-aligned Y axis 
	 yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// append an SVG element to body
	// giving it the width and height configured above
	 svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// as the class name suggests, add the vertical...
	svg.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(function() {
			return xAxis
				.tickSize(-height, 0, 0)
		});

	// ...and horizontal grid lines
	// note that these are drawn relative to the axes
	// so negative sizes extend rightwards and upwards
	svg.append("g")
		.attr("class", "grid")
		.call(function() {
			return yAxis
				.tickSize(-width, 0, 0)
		});
	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
	

	svg.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "-3em")
		.style("text-anchor", "end");
	

    div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);
};
	
window.addEventListener("focus", function() {
    //console.log("Window focussed, calling updateTempChart...");
    //updateTempChart();
});

function updateTempChart(transition, selection) {
    if (!selection) {
        var selection = d3.select('.temp');
    }
	var data = selection.select('g.temp').data();
	
	x.domain(d3.extent(data[0].values, function(d) {
		return d.date;
	}));

	var min = d3.min(data, function(c) {
		return Math.floor(d3.min(c.values, function(v) {
			return v.power;
		}))
	});
	var max = d3.max(data, function(c) {
		return Math.ceil(d3.max(c.values, function(v) {
			return v.power;
		}))
	});

	min = Math.floor(min * (1 - Math.sign(min) * 0.025));
	max = Math.ceil(max * (1 + Math.sign(max) * 0.025));
	console.log("min " + min + ", max " + max);
	y.domain([min, max]);

		if (transition) {
			var t1 = transition;
		} else {
			var t1 = selection.transition();
		}

	t1.selectAll('.x.axis')
		.transition(0)
		.call(xAxis);

	t1.selectAll('.y.axis')
		.transition(0)
		.call(yAxis);
		

	var point = selection.select('g.temp').selectAll(".point")
		.data(function(d, i) {
			return d.values;
		});
	point.enter().append("svg:circle")
		.attr("class", "point")
		.attr("stroke", function(d) {
			return color(d.series)
		});
		
	point
		.attr("fill", function(d, i) {
			return "none";
		})
		.attr("cx", function(d, i) {
			return x(d.date)
		})
		.attr("cy", function(d, i) {
			return y(d.power)
		})
		.attr("r", function(d, i) {
			return 3;
		})
		.style("pointer-events", "all")
		.on("mouseover", function(d) {
			var div = d3.selectAll('.tooltip')
			var parent = d3.select(this.parentElement).selectAll('.line');
			this.style.opacity = 1;
			div.transition()
				.duration(200)
				.style("opacity", null)
				.style("border-color", color(d.series));
			div.html(formatTime(d.date) + "<br />" + formatValue(d.power) + " &deg;C")
				.style("left", 5 + d3.event.pageX + "px")
				.style("top", (d3.event.pageY - 28) + "px");

		})
		.on("mouseout", function(d) {
			var div = d3.selectAll('.tooltip');
			this.style.opacity = "";
			div.transition(200).style("opacity", 0);
		})
		
	point.exit()
		.transition(0)
		.remove();
		
	t1.selectAll('.point').transition(0)
		.ease("elastic")
		.attr("cx", function(d, i) {
			if (x(d.date) < 0) {
				this.remove();
			}
			return x(d.date)
		})
		.attr("cy", function(d, i) {
			return y(d.power)
		});

    var pathSelection = selection.select('g.temp')
    var firstRun = (pathSelection.select('path').size() == 0);
    
    if (firstRun) {
      	// draw the line itself	
	    selection.select('g.temp').append("path")
    		.style("pointer-events", "none")
		    .attr("class", "line")
    		.attr("d", function(d) { return line(d.values); })
	    	.style("stroke", function(d) { return color(d.name); });	
	}
	else {
		var move = x(data[0].values[0].date);
		
    	t1.select('.line')
	    	.attr("d", function(d) {
		    	return line(d.values);
    		})
	    	.attr("transform", null)
		    .transition().duration(500).ease("linear")
    		.attr("transform", "translate(-" + move + ",0)");
    }		
}

function updateRainChart(transition) {
	var data = d3.select('g.rain').data();
	var city = d3.select('g.rain').selectAll('.bar')
	
	var extent = d3.extent(data[0], function(d) {
		return d.date;
	});
	var endDate = new Date(extent[1]);
	endDate.setHours(endDate.getHours() + 1);
	extent[1] = endDate;
	x.domain(extent);
	
	console.log(extent[0], extent[1]);
	// if min goes < 0 we want to multiply by 1.1 so that the magnitude gets *bigger*
	var min = d3.min(data, function(c) {
		return d3.min(c, function(v) {
			return v.power;
		});
	});
	var max = d3.max(data, function(c) {
			return d3.max(c, function(v) {
				return v.power;
			});
	});
	
	y.domain([
		min < 0 ? min * 1.1 : min * 0.9,
		1.1 * max
	]);

d3.selectAll('.x.axis')
	.transition()
	.duration(0)
	.call(xAxis);

d3.selectAll('.y.axis')
	.transition()
	.duration(0)
	.call(yAxis);

var point = city
	.data(function(d) {
		return d;
	}, function(d) { return d.date} );


	point
	.transition()
	.duration(0)
	.attr("x", function(d, i) {
		//console.log(d.date + ", " + x(d.date));
		return x(d.date)
	})
	.attr("y", function(d, i) {
		return y(d.power)
	})
	.attr("height", function(d) {
		return height - y(d.power);
	});
	
	point.enter().append("rect")
	.attr("class", "bar")
	.attr("fill", function(d, i) {
		return color("rain")
	})
	.attr("x", function(d, i) {
		//console.log(d.date + ", " + x(d.date));
		return x(d.date)
	})
	.attr("y", function(d, i) {
		return y(d.power)
	})
	.attr("width", barWidth)
	.attr("height", function(d) {
		return height - y(d.power);
	})
	.on("mouseenter", function(d) {
		var parent = d3.select(this.parentElement).selectAll('.line');
		this.style.opacity = 1;
		div.transition()
			.duration(200)
			.style("opacity", .9)
			.style("border-color", color(d.series));
		div.html(formatTime(d.date) + "<br />" + d.power + " mm")
			.style("left", 5 + d3.event.pageX + "px")
			.style("top", (d3.event.pageY - 28) + "px");

	})
	.on("mouseleave", function(d) {
		console.log("mouseout");
		this.style.opacity = 0.7;
		div.style('opacity', 0);
	})

point.exit()
	.remove();
}

function updatePowerChart(transition, selection) {
    if (!selection) {
        var selection = d3.select('.power');
    }
	var grapharea = selection.select('g.grapharea');
	var data = grapharea.data();
	
	x.domain(d3.extent(data[0].values, function(d) {
		return d.date;
	}));

	var min = d3.min(data, function(c) {
		return Math.floor(d3.min(c.values, function(v) {
			return v.power;
		}))
	});
	var max = d3.max(data, function(c) {
		return Math.ceil(d3.max(c.values, function(v) {
			return v.power;
		}))
	});

	min = Math.floor(min * (1 - Math.sign(min) * 0.025));
	max = Math.ceil(max * (1 + Math.sign(max) * 0.025));
	min = 0;
	console.log("min " + min + ", max " + max);
	y.domain([min, max]);

		if (transition) {
			var t1 = transition;
		} else {
			var t1 = selection.transition();
		}

	t1.selectAll('.x.axis')
		.transition(0)
		.call(xAxis);

	t1.selectAll('.y.axis')
		.transition(0)
		.call(yAxis);
		

	var point = grapharea.selectAll(".point")
		.data(function(d, i) {
			return d.values;
		});
	point.enter().append("svg:circle")
		.attr("class", "point")
		.attr("stroke", function(d) {
			return color(d.name)
		});
		
	point
		.attr("fill", function(d, i) {
			return color(d.series);
		})
		.attr("cx", function(d, i) {
			return x(d.date)
		})
		.attr("cy", function(d, i) {
			return y(d.power)
		})
		.attr("r", function(d, i) {
			return 2;
		})
		.style("pointer-events", "all")
		.on("mouseover", function(d) {
			var div = d3.selectAll('.tooltip')
			var parent = d3.select(this.parentElement).selectAll('.line');
			this.style.opacity = 1;
			div.transition()
				.duration(200)
				.style("opacity", null)
				.style("border-color", color(d.series));
			div.html(formatTime(d.date) + "<br />" + formatValue(d.power) + " W")
				.style("left", 5 + d3.event.pageX + "px")
				.style("top", (d3.event.pageY - 28) + "px");

		})
		.on("mouseout", function(d) {
			var div = d3.selectAll('.tooltip');
			this.style.opacity = "";
			div.transition(200).style("opacity", 0);
		})
		
	point.exit()
		.transition(0)
		.remove();
		
	t1.selectAll('.point').transition(0)
		.ease("elastic")
		.attr("cx", function(d, i) {
			if (x(d.date) < 0) {
				this.remove();
			}
			return x(d.date)
		})
		.attr("cy", function(d, i) {
			return y(d.power)
		});

    var firstRun = (grapharea.select('path').size() == 0);
    
    if (firstRun) {
      	// draw the line itself	
	    grapharea.append("path")
    		.style("pointer-events", "none")
		    .attr("class", "line")
    		.attr("d", function(d) { return line(d.values); })
	    	.style("stroke", function(d) { return color(d.name); });
	    
	    grapharea.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.power) + ")"; })
	      .attr("x", 3)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });

	}
	else {
		var move = x(data[0].values[0].date);
		
    	t1.select('.line')
	    	.attr("d", function(d) {
		    	return line(d.values);
    		})
	    	.attr("transform", null)
		    .transition().duration(500).ease("linear")
    		.attr("transform", "translate(-" + move + ",0)");
    }		
}
	
function log_coords(data) {
	var list = "";
	data[0].values.forEach(function(d) {
		var coords = "(";
		coords = coords + x(d.date).toFixed(2);
		coords = coords + ", " + y(d.power).toFixed(2);
		coords = coords + ")";
		
		list = list + " " + coords;
	});
	
	console.log(list);
}
