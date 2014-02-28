function chart(selection) {
  selection.each(function(data) {
  
  });
}

	var formatTime = d3.time.format("%e %B %H:%M");

	var margin = {top: 20, right: 80, bottom: 30, left: 50},
	    width = 600 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	// a time scale object for the x axis?
	var x = d3.time.scale()
	    .range([0, width]);

	// a linear scale object for the y axis?
	var y = d3.scale.linear()
	    .range([height, 0]);

	// "an ordinal scale with a range of ten categorical colours"
	var color = d3.scale.category10();

	// a bottom-aligned X axis
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	// a left-aligned Y axis 
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

