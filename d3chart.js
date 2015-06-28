function chart(selection) {
  selection.each(function(data) {
  
  });
}

	var formatTime = d3.time.format("%e %B %H:%M");

	var margin = {top: 20, right: 80, bottom: 30, left: 50},
	    width = 600 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	var x, y, color, xAxis, yAxis, svg;
	
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

function updateTempChart(transition) {
	var data = d3.selectAll('g.temp').data();
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
		

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
};
	
	
	x.domain(d3.extent(data[0].values, function(d) {
		return d.date;
	}));

	var min = d3.min(data, function(c) {
		return Math.floor(0.9 * d3.min(c.values, function(v) {
			return v.power;
		}))
	});
	var max = d3.max(data, function(c) {
		return Math.ceil(1.1 * d3.max(c.values, function(v) {
			return v.power;
		}))
	});

	y.domain([min, max]);

		if (transition) {
			var t1 = transition;
		} else {
			var t1 = d3.transition().select('.temp');
		}

	t1.selectAll('.x.axis')
		.transition(0)
		.call(xAxis);

	t1.selectAll('.y.axis')
		.transition(0)
		.call(yAxis);
		

	var point = d3.selectAll("g.temp").selectAll(".point")
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
			return 3
		})
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
			this.style.opacity = "";
			div.style.opacity = 0;
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

    var pathSelection = d3.select('g.temp');
    var firstRun = (pathSelection.select('path').size() == 0);
    
    if (firstRun) {
      	// draw the line itself	
	    d3.select('g.temp').append("path")
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


  d3.timer(force_update, 5000);

		
}
