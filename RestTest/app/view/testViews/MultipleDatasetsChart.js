var store = Ext.create('Ext.data.Store',{
	data: [
	{'key': 'first', 'data1': 1, 'data2': 4 },
	{'key': 'second', 'data1': 4, 'data2': 6 },
	{'key': 'third', 'data1': 5, 'data2': 14 },
	{'key': 'fourth', 'data1': 6, 'data2': 11 },
	{'key': 'fifth', 'data1': 8, 'data2': 2 },
	{'key': 'sixth', 'data1': 11, 'data2': 16 }
	]

});

Ext.define('RestTest.view.testViews.MultipleDatasetsChart', {
	extend: 'Ext.chart.CartesianChart',

	xtype: 'jeppes-multi-chart',

	requires: [
		'Ext.chart.axis.Category',
		'Ext.chart.axis.Numeric',
		'Ext.chart.series.Line'
	],

	title: 'Jeppes Multiple store chart',

	width: 800,
	height: 400,
	padding: 10,
	animate:true,

	store: store,
	
	axes: [{
		title: "Assets",
		type: 'category',
		position: 'bottom'
	},
	{
		title: "Visninger",
		type: 'numeric',
		position: 'left',
		fields: ['data1', 'data2']
	}],
	series:[{
		type: 'line',
		smooth: false,
		marker: {radius:5},
		xField: 'Key',
		yField: 'data1'
	},{
		type: 'line',
		smooth: false,
		marker: {radius:5},
		xField: 'Key',
		yField: 'data2'
	}]
});