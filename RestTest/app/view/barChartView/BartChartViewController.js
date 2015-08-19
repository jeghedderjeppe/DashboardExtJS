Ext.define('RestTest.view.barChartView.barChartViewController', {
	extend: 'Ext.app.ViewController', 
	alias: 'controller.barChart',
	
	removeButtonClick: function (button) {
		var chart = button.up();
		chart.destroy();
		console.log(this);

		/*var chart = this.lookupReference('chartt');
		console.log(chart);
		chart.destroy();*/
	}
});