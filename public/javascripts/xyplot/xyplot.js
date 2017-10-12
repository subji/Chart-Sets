function xyplot ()	{
	'use strict';

	var model = {};

	function typeToString (obj)	{
		return Object.prototype.toString.call(obj)
								 .replace(/\[object |\]/g, '');
	};

	function getElement (element)	{
		var toStr = typeToString(element);
		
		if (toStr === 'String')	{
			return document.querySelector(element);
		} else if (toStr.indexOf('HTML') > -1)	{
			return element;
		} else { return null; }
	};

	function setArea (parent, width, height, side)	{
		var area = document.createElement('div');

		area.id = 'xyplot_' + side + '_side';
		area.style.float = 'left';
		area.style.width = width + 'px';
		area.style.height = height + 'px';

		parent.appendChild(area);

		return area;
	};

	function getArea (element, width, height)	{
		var ele = getElement(element);

		ele.style.margin = 0;
		ele.style.padding = 0;
		ele.style.width = width + 'px';
		ele.style.height = height + 'px';
		
		var plot = setArea(ele, width, height, 'plot');

		return { main: ele, plot: plot };
	};

	function getScale (plotList)	{
		var xMin = getMin(plotList, 'x'),
				xMax = getMax(plotList, 'x'),
				yMin = getMin(plotList, 'y'),
				yMax = getMax(plotList, 'y');

		return {
			x: d3.scaleLinear().domain([xMin, xMax]),
			y: d3.scaleLinear().domain([yMin, yMax])
		};
	};

	function setScaleRange (scale, start, end)	{
		return scale.range([start, end]);
	};

	var getMax = function (list, axis)	{
		return d3.max(list.map(function (d)	{
			return d[axis];
		}));
	};

	var getMin = function (list, axis)	{
		return d3.min(list.map(function (d)	{
			return d[axis];
		}));
	};

	function makeSVG (area, width, height)	{
		return d3.select(area).append('svg')
						 .attr('id', 'xyplot_plot_svg')
						 .attr('width', width)
						 .attr('height', height);
	};

	function setAxis (scale, ticks)	{
		return d3['axis' + (ticks === 4 ? 'Bottom' : 'Left')]
					(scale).ticks(ticks);
	};

	return function (opts)	{
		model = {};

		var margin = model.margin = opts.margin;
		var area = model.area = 
			getArea(opts.element, opts.width, opts.height);
		var scale = model.scale = getScale(opts.data.plot_list);
		var size = model.size = {
					plot: {
						width: parseFloat(area.plot.style.width),
						height: parseFloat(area.plot.style.height),
					},
				};

		scale.x = setScaleRange(scale.x, 
			margin[1], size.plot.width - margin[3]).clamp(true);
		scale.y = setScaleRange(scale.y, 
			size.plot.height - margin[2], margin[0]).clamp(true);

		var svg = makeSVG(area.plot, 
			size.plot.width, size.plot.height);

		var g = svg.append('g')
							 .attr('id', 'xyplot_plot_group')
							 .attr('transform', 'translate(0, 0)');

		var xaxis = setAxis(scale.x, 4),
				yaxis = setAxis(scale.y, 5);

		svg.append('g')
			 .attr('class', 'xyplot_xaxis')
			 .attr('transform', 
			 	'translate(0, ' + (size.plot.height - margin[2]) + ')')
			 .call(xaxis);

		svg.append('g')
			 .attr('class', 'xyplot_yaxis')
			 .attr('transform', 'translate(' + margin[1] + ', 0)')
			 .call(yaxis);

		svg.append("g")
      .append("line")
      .attr("class", "xyplot_fdrlevelline")
      .attr('x1', (margin[1] + margin[3]))
      .attr('y1', scale.y(0.05))
      .attr('x2', size.plot.width)
      .attr('y2', scale.y(0.05));

      svg.append("g")
      .append("text")
      .attr("class", "xyplot_fdrleveltext")
      .attr('x', size.plot.width - (margin[1] * 4))
      .attr('y', scale.y(1))
      .text("FDR Level = 0.05");

		var circle = svg.selectAll("circle")
        .data(opts.data.plot_list)
        .enter().append("circle")
        .attr("class", "xyplot_circles")
        .attr("cx", function(d) { 
            return scale.x(d.x); 
        })
        .attr("cy", function(d) { 
            return scale.y(d.y); 
        })
        .attr("r", 3);

        var text = svg.selectAll("text")
        .data(opts.data.plot_list)
        .enter().append("text")
        .attr("class", "xyplot_circles_text")
        .attr("x", function(d) { 
            return scale.x(d.x) + 5; 
        })
        .attr("y", function(d) { 
            return scale.y(d.y); 
        })
        .text(function(d) { 
            if(d.y > 20)   {
                return d.title; 
            }
        });
	};
};