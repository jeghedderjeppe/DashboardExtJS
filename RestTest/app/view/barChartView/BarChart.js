Ext.define("RestTest.view.barChartView.BarChart", {
	extend: 'Ext.chart.CartesianChart',

	requires: [
		'Ext.chart.grid.HorizontalGrid',
		'Ext.chart.grid.VerticalGrid',
		'Ext.chart.series.Bar',
		'Ext.chart.series.Line',
		'Ext.chart.axis.Numeric',
		'Ext.chart.axis.Category',
		'RestTest.view.barChartView.barChartViewController'

	],

	controller: 'barChart',
	title: 'cartesian',
	xtype: "jeppes-chart",
	width: 800,
	height: 400,
	padding: 10,
	animate:true,
	insetPadding: 10,

	/*axes: [{
		title: "Assets",
		type: 'category',
		position: 'bottom',
		grid: true
	},
	{
		title: "Visninger",
		type: 'numeric',
		position: 'left',
		grid: true
	}],*/
	series:{
		type: 'line',
		smooth: true,
		marker: {radius:5},
		xField: 'Key',
		yField: 'Value'
	},
	bbar: {
		xtype: 'button',
		text: 'Remove',
		listeners: {
			click: 'removeButtonClick'
		}
	}
});