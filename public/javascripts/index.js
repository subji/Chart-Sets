(function ()	{
	$.ajax({
			type: 'get',
			url: '/files/maplot',
			success: function (d)	{
				var ma = maplot();

				ma({
					width: 900,
					height: 600,
					data: d.data,
					element: '#main',		
					margin: [40, 40, 40, 40],
				});
			},
			error: function (err)	{
				console.log(err)
			},
		});
})();