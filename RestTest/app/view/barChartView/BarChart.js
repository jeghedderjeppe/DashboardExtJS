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
	legend: {
		docked: 'right'
	},
	series:{
		highlight: true,
		type: 'line',
		smooth: false,
		marker: {radius:5},
		xField: 'Key',
		yField: 'Value',
		tooltip: {
			trackMouse: false,
			interactions: [{
            	type: 'itemhighlight'
          	}],
			width: 100,
			height: 100,
			scope: this,
			renderer: function (toolTip, storeItem, item) {
				toolTip.setHtml(storeItem.get('Value'));
				// console.log(toolTip);
				console.log(storeItem);
				// console.log(item);
			}
		}
	},
	bbar: {
		xtype: 'button',
		text: 'Remove',
		listeners: {
			click: 'removeButtonClick'
		}
	}
});