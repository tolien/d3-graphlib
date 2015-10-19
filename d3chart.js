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



var formatTime = d3.time.format("%e %B %H:%M");

var margin = {
	top: 20,
	right: 80,
	bottom: 30,
	left: 50
},
	width = 600 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

var x, y, color, xAxis, yAxis, svg, div;

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

function updateChart(transition, selection) {
	if (!transition) {
		transition = selection.transition();
	}

	var data = selection.selectAll('g.grapharea').data();

	x.domain(d3.extent(data[0].values, function(d) {
		return d.date;
	}));

	var min = d3.min(data, function(c) {
		return Math.floor(d3.min(c.values, function(v) {
			return v.value;
		}))
	});
	var max = d3.max(data, function(c) {
		return Math.ceil(d3.max(c.values, function(v) {
			return v.value;
		}))
	});
	
	min = min > 0 ? 0 : min;
	min = Math.floor(min * (1 - Math.sign(min) * 0.025));
	max = Math.ceil(max * (1 + Math.sign(max) * 0.025));
	console.log("min " + min + ", max " + max);
	y.domain([min, max]);

	transition.selectAll('.x.axis')
		.transition(0)
		.call(xAxis);

	transition.selectAll('.y.axis')
		.transition(0)
		.call(yAxis);
}

function updateLineChart(transition, selection) {
	if (!selection) {
		return;
	}
	var series = selection.selectAll('g.grapharea');
	
	series.each(function() {
		var grapharea = d3.select(this);
		var data = grapharea.data();

		updateChart(transition, selection);

		var point = grapharea.selectAll(".point")
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
				div.html(formatTime(d.date) + "<br />" + formatValue(d.value) + " &deg;C")
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


		transition.selectAll('.point').transition(0)
			.ease("elastic")
			.attr("cx", function(d, i) {
				if (x(d.date) < 0) {
					this.remove();
				}
				return x(d.date)
			})
			.attr("cy", function(d, i) {
				return y(d.value)
			});

		var firstRun = (grapharea.select('path').size() == 0);

		if (firstRun) {
			// draw the line itself	
			grapharea.append("path")
				.style("pointer-events", "none")
				.attr("class", "line")
				.attr("d", function(d) {
					return line(d.values);
				})
				.style("stroke", function(d) {
					return color(d.name);
				});
		} else {
			grapharea.selectAll('.line')
				.attr("d", function(d) {
					return line(d.values);
				})
		}
	});
}

function updateTempChart(transition, selection) {
	updateLineChart(transition, selection);
}

function updateRainChart(transition, selection) {
	var data = selection.data();
	var grapharea = selection.select('g.grapharea');
	var city = grapharea.selectAll('.bar');

	updateChart(transition, selection);

	var point = city
		.data(function(d, i) {
			return d.values;
		});


	point
		.transition()
		.duration(0)
		.attr("x", function(d, i) {
			return x(d.date)
		})
		.attr("y", function(d, i) {
			return y(d.value)
		})
		.attr("height", function(d) {
			return height - y(d.value);
		});

	point.enter().append("rect")
		.attr("class", "bar")
		.attr("fill", function(d, i) {
			return color("rain")
		})
		.attr("x", function(d, i) {
			return x(d.date)
		})
		.attr("y", function(d, i) {
			return y(d.value)
		})
		.attr("width", barWidth)
		.attr("height", function(d) {
			return height - y(d.value);
		})
		.on("mouseenter", function(d) {
			var parent = d3.select(this.parentElement).selectAll('.line');
			this.style.opacity = 1;
			div.transition()
				.duration(200)
				.style("opacity", .9)
				.style("border-color", color(d.name));
			div.html(formatTime(d.date) + "<br />" + d.value + " mm")
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
	updateLineChart(transition, selection);

	var grapharea = selection.select('g.grapharea');
	var data = grapharea.data();
	var point = grapharea.selectAll('.point');

	point
		.attr("fill", function(d, i) {
			return color(d.series);
		})
		.attr("r", function(d, i) {
			return 2;
		})
		.on("mouseover", function(d) {
			var div = d3.selectAll('.tooltip')
			var parent = d3.select(this.parentElement).selectAll('.line');
			this.style.opacity = 1;
			div.transition()
				.duration(200)
				.style("opacity", null);
			div.html(formatTime(d.date) + "<br />" + formatValue(d.value) + " W")
				.style("left", 5 + d3.event.pageX + "px")
				.style("top", (d3.event.pageY - 28) + "px").style("border-color", color(d.series));


		})
}

function log_coords(data) {
	var list = "";
	data[0].values.forEach(function(d) {
		var coords = "(";
		coords = coords + x(d.date).toFixed(2);
		coords = coords + ", " + y(d.value).toFixed(2);
		coords = coords + ")";

		list = list + " " + coords;
	});

	console.log(list);
}
