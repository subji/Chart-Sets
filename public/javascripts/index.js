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

	// $.ajax({
	// 		type: 'get',
	// 		url: '/files/xyplot',
	// 		success: function (d)	{
	// 			var xy = xyplot();

	// 			xy({
	// 				width: 600,
	// 				height: 400,
	// 				data: d.data,
	// 				element: '#main',
	// 				margin: [40, 40, 40, 40],
	// 			});
	// 		},
	// 		error: function (err)	{
	// 			console.log(err)
	// 		},
	// 	});

	// $.ajax({
	// 		type: 'get',
	// 		url: '/files/degplot',
	// 		success: function (d)	{
	// 			var deg = degplot();

	// 			deg({
	// 				width: 600,
	// 				height: 400,
	// 				data: d.data,
	// 				element: '#main',
	// 				margin: [40, 40, 40, 40],
	// 			});
	// 		},
	// 		error: function (err)	{
	// 			console.log(err)
	// 		},
	// 	});
	// $.ajax({
	// 	type: 'get',
	// 	url: '/files/pcaplot',
	// 	success: function (d)	{
	// 		var pca2d = pca2dplot();

	// 		pca2d({
	// 			width: 600,
	// 			height: 400,
	// 			data: d,
	// 			element: '#main',
	// 			margin: [40, 40, 40, 40]
	// 		});

			// var pca3d = pca3dplot();

			// pca3d({
			// 	width: 600,
			// 	height: 400,
			// 	data: d,
			// 	element: '#main',
			// 	margin: [40, 40, 40, 40]
			// });
// 		},
// 		error: function (errr)	{
// 			console.log(errr);
// 		}
// 	})
})();