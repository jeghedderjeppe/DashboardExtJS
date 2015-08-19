Ext.define('RestTest.view.barChartView.barChartViewController', {
	extend: 'Ext.app.ViewController', 
	alias: 'controller.barChart',
	
	removeButtonClick: function () {
		var chart = this.lookupReference('chart');
		console.log(chart);
		chart.destroy();
	}
});