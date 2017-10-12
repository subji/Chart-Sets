# MA Plot
### installation & run

- git clone https://github.com/subji/Chart-Sets.git 
- cd directory
- npm install
- node bin/www
- http://192.168.191.159:8000

### data
- cd public/datas
- input data
- data format:
	ex) 
	{
		data: {
			cutoff_value: 0.01,
			plot_list: [
				{
					title: "title",
					value: "value",
					x: "x value",
					y: "y value",
				},
				...
			]
		}
	}


