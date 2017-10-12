function maplot ()	{
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

		area.id = 'maplot_' + side + '_side';
		area.style.float = 'left';
		area.style.width = 
		(width * (side === 'plot' ? 0.6 : 0.4)) + 'px';
		area.style.height = height + 'px';

		parent.appendChild(area);

		return area;
	};

	function separeteArea (element, width, height)	{
		var ele = getElement(element);

		ele.style.margin = 0;
		ele.style.padding = 0;
		ele.style.width = width + 'px';
		ele.style.height = height + 'px';
		
		var plot = setArea(ele, width, height, 'plot');
		var info = setArea(ele, width, height, 'info');

		return { main: ele, plot: plot, info: info };
	};

	function getAxisList (list, axis)	{
		return list.map(function (data) {
			return data[axis];
		});
	};

	function getMax (list, axis)	{
		return d3.max(getAxisList(list, axis));
	};

	function getMin (list, axis)	{
		return d3.min(getAxisList(list, axis));
	};

	function getScale (plotList)	{
		var bufferX = 1,
				bufferY = 1;
		var xMin = getMin(plotList, 'x') - bufferX,
				xMax = getMax(plotList, 'x') + bufferX,
				yMin = getMin(plotList, 'y') - bufferY,
				yMax = getMax(plotList, 'y') + bufferY;

		return {
			x: d3.scaleLinear().domain([xMin, xMax]),
			y: d3.scaleLinear().domain([yMax, yMin])
		};
	};

	function setScaleRange (scale, len, m1, m2)	{
		return scale.range([m1, len - m2]);
	};

	function makeSVG (area, width, height)	{
		return d3.select(area).append('svg')
						 .attr('id', 'maplot_plot_svg')
						 .attr('width', width)
						 .attr('height', height);
	};

	function setAxis (scale, ticks)	{
		return d3['axis' + (ticks === 4 ? 'Bottom' : 'Left')]
					(scale).ticks(ticks);
	};

	function shapeColors (data, idx, cutoff)	{
		return data.color = 
					(data.value < cutoff) ? 'red' : '#333333';
	};

	function makeTableHeader ()	{
		var list = ['#', 'Gene', 'X', 'Y', 'P'],
				head = document.createElement('thead'),
				tr = document.createElement('tr');

		for (var i = 0, l = list.length; i < l; i++)	{
			var th = document.createElement('th');
					th.innerHTML = list[i];

			tr.appendChild(th);
		}

		return (head.appendChild(tr), head);
	};

	function rowMouseover (circle, radius)	{
		circle.transition().duration(250)
					.attr('r', radius * 2);
	};

	function rowMouseout (circle, radius)	{
		circle.transition().duration(250)
					.attr('r', radius);
	};

	function makeTableBody (data)	{
		if (document.querySelector('tbody'))	{
			var parent = document.querySelector('tbody')
													 .parentNode;
			// 계속해서 추가가 되면 테이블에도 추가가 되는 방식으로 
			// 작성하였다.
			parent.removeChild(document.querySelector('tbody'));
		}

		var tbody = document.createElement('tbody');
				tbody.style.height = 
				(model.size.info.height - 
				 model.margin[0] * 2 - model.margin[3]) + 'px';

		for (var i = 0, l = data.length; i < l; i++)	{
			(function (idx)	{
				var tr = document.createElement('tr'),
						d = data[idx].datum(),
						forEvent = data[idx],
						list = [
							idx, d.title, 
							Number(d.x).toFixed(4), 
							Number(d.y).toFixed(4), 
							Number(d.value).toExponential(5)
						];

				for (var j = 0, lj = list.length; j < lj; j++)	{
					var td = document.createElement('td');
							td.innerHTML = list[j];
							td.style.color = d.color;
							td.style.fontSize = '12px';

					tr.appendChild(td);
				}

				tr.onmouseover = function (e)	{
					rowMouseover(forEvent, 2);
				};

				tr.onmouseout = function (e) {
					rowMouseout(forEvent, 2);
				};

				tbody.appendChild(tr);
			}(i));
		}

		model.table.appendChild(tbody);
	};

	function makeTable (width, height)	{
		var table = document.createElement('table');
				table.id = 'maplot_info_table';
				table.style.width = width + 'px';
				table.style.marginTop = model.margin[0] + 'px';
				table.appendChild(makeTableHeader());

		return (model.table = table, table);
	};

	function dragStart ()	{
		model.coords = [];
	};

	function drawPath (terminator)	{
		var line = d3.line(),
				selLine = d3.selectAll('#maplot_selected_line')
										.style('fill', 'none')
										.style('stroke', '#d6d63b')
										.style('stroke-width', '2')
										.style('shape-rendering', 'crispEdges');

		selLine.append('path').attr('d', line(model.coords));

		if (terminator)	{
			if (model.coords.length < 1)	{ return; }

			selLine.append('path')
						 .attr('id', 'terminator')
						 .attr('d', line([
						 		model.coords[0], 
						 		model.coords[model.coords.length - 1]
						 	]));
		}
	};

	function dragMove ()	{
		model.coords.push(d3.mouse(this));

		drawPath();
	};

	function getCoords (coords)	{
		var type = function (types)	{
			return coords.map(function (coord)	{
				return coord[types];
			});
		}

		return {
			xMin: d3.min(type(0)), xMax : d3.max(type(0)),
			yMin : d3.min(type(1)), yMax : d3.max(type(1))
		}
	};

	function rayTracing (pos, crd) {
		var xi, xj, yi, yj, i, intersect;
		var x = pos[0];
		var y = pos[1];
		var inside = false;

		for (var i = 0, j = crd.length - 1; 
						 i < crd.length; j = i++) {
			xi = crd[i][0],
			yi = crd[i][1],
			xj = crd[j][0],
			yj = crd[j][1],
			intersect = ((yi > y) != (yj > y)) && 
									(x < (xj - xi) * (y - yi) / (yj - yi) + xi);

			if (intersect) { inside = !inside };
		}
		return inside;
	};

	function findIntersection (selected, endLine)	{
		var empty = [];

		for(var i = 0, len = endLine.length ; i < len ; i++)	{
			var check_title = false;

			for (var j = 0, leng = selected.length ; j < leng ; j++)	{
				if(endLine[i].datum().title === 
					 selected[j].datum().title)	{
					check_title = true;
				}
			}

			if(!check_title)	{
				empty.push(endLine[i]);
				selected.push(endLine[i]);
			}
		}

		model.saved.push(empty);
	};

	function savedAllPaths ()	{
		var reform = [],
				index = 0;

		for(var i = 0, len = model.paths.length; i < len; i++)	{
			var empty = [];

			for(var j = i === 0 ? 0 : model.paths[i - 1].length, 
							leng = model.paths[i].length; 
							j < leng; j++)	{
				empty.push(model.paths[i][j]);

				if(model.paths[i][j].id)	{
					reform[index] = empty;
					index++;
				}
			}	
		}

		model.pathStack = reform;
	};

	function dragEnd ()	{
		var endLine = [],
				crdArea = getCoords(model.coords);

		model.circles.each(function (circle, i)	{
			var cx = d3.select(this).attr('cx'),
					cy = d3.select(this).attr('cy');
			var pos = [cx, cy];

			if (crdArea.xMin < cx && crdArea.xMax > cx && 
					crdArea.yMin < cy && crdArea.yMax > cy)	{
				if (rayTracing(pos, model.coords)) {
					endLine.push(d3.select(this))
				}
			}
		});

		endLine.sort(function (a, b)	{
			return a.datum().value > b.datum.value ? 1 : -1;
		});

		findIntersection(model.selected, endLine);

		drawPath(true);

		makeTableBody(model.selected);

		model.paths.push(
			d3.selectAll('#maplot_selected_line path'));

		savedAllPaths();
	};

	function setDrag ()	{
		model.saved = [];
		model.paths = [];
		model.selected = [];
		model.pathStack = [];

		return d3.drag().on('start', dragStart)
										.on('drag', dragMove)
										.on('end', dragEnd);
	};

	return function (opts)	{
		model = {};

		var margin = model.margin = opts.margin;
		var area = model.area = 
			separeteArea(opts.element, opts.width, opts.height);
		var scale = model.scale = getScale(opts.data.plot_list);
		var size = 
				model.size = {
					plot: {
						width: parseFloat(area.plot.style.width),
						height: parseFloat(area.plot.style.height),
					},
					info: {
						width: parseFloat(area.info.style.width),
						height: parseFloat(area.info.style.height),
					},
				};

		scale.x = setScaleRange(scale.x, 
			size.plot.width, margin[1], margin[3]);
		scale.y = setScaleRange(scale.y, 
			size.plot.height, margin[0], margin[2]);

		var svg = makeSVG(area.plot, 
			size.plot.width, size.plot.height);

		var g = svg.append('g')
							 .attr('id', 'maplot_plot_group')
							 .attr('transform', 'translate(0, 0)'),
				pg = svg.append('g')
								.attr('id', 'maplot_selected_line');

		var xaxis = setAxis(scale.x, 4),
				yaxis = setAxis(scale.y, 5);

		svg.append('g')
			 .attr('class', 'maplot_xaxis')
			 .attr('transform', 
			 	'translate(0, ' + (size.plot.height - margin[2]) + ')')
			 .call(xaxis);

		svg.append('g')
			 .attr('class', 'maplot_yaxis')
			 .attr('transform', 'translate(' + margin[1] + ', 0)')
			 .call(yaxis);

		model.circles = g.selectAll('circle')
									 .data(opts.data.plot_list)
									 .enter().append('circle')
									 .attr('class', 'maplot_circles')
									 .style('fill', function (d, i)	{
									 		return shapeColors(
									 			d, i, opts.data.cutoff_value);
									 });

		model.circles
		.attr('cx', size.plot.width / 2)
		.attr('cy', size.plot.height / 2)
		.transition()
		.delay(function (d, i)	{ return i / 5; })
		.attr('r', 2)
		.attr('cx', function (d, i)	{ return scale.x(d.x); })
		.attr('cy', function (d, i)	{ return scale.y(d.y); });

		area.info.appendChild(
			makeTable(size.info.width, size.info.height));

		svg.call(setDrag());
	};
};