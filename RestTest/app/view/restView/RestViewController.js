Ext.define('RestTest.view.restView.RestViewController', {
	extend: 'Ext.app.ViewController', 
	alias: 'controller.restview',

	onGetButtonClick: function () {
		var outputChart = this.lookupReference('outputChart');
		outputContainer.update(input);

		Ext.Ajax.request({
			url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest/GetMostPopularAssets/10', //getpageviewsbybrowser
			method:'GET',
			disableCaching: true,
			headers: {accept : 'application/json; charset=utf-8'},
			useDefaultXhrHeader: false,

			success: function(response) {
				var responseText = response.responseText;
                //outputContainer.update(responseText);
                var jsonDataObj = Ext.JSON.decode(responseText);
                var datastore = Ext.create('Ext.data.Store', {
                	data: jsonDataObj
                });
                
                outputChart.bindStore(datastore); 


            },
            failure: function(response) {
                outputContainer.update('failure');
            }
		});

		console.log('after request');
	},

	onPostButtonClick: function () {
		var outputContainer = this.lookupReference('outputContainer');
		var outputChart = this.lookupReference('outputChart');


		var ajax = Ext.Ajax.request({
			url: 'http://localhost:49879/SendStatistics.svc/rest/PostRequest',
			method:'POST',
/*			disableCaching: false,
			cors:true,*/
			headers: {accept : 'application/json; charset=utf-8'},
			//params: Ext.encode({parameterOne: 1}),
			jsonData: {
				"parameterOne":"1"
			},
			
			
			useDefaultXhrHeader: false,

			success: function(response) {
				console.log('post success!')


            },
            failure: function(response, conn) {
                console.log(conn);
            }
		});
		console.log(ajax.getDefaultXhrHeader()); //getDefaultXhrHeader
	},

	onShowButtonClick: function () {
		var panel = this.lookupReference('outputPanel');
		var whatToShowCombo = this.lookupReference('whatToShowCombo');
		var howToShowCombo = this.lookupReference('howToShowCombo');
		
		var whatToShowValue = whatToShowCombo.getValue();
		var howToShowValue = howToShowCombo.getValue();

		var xAxisName, yAxisName;
		
		switch(whatToShowValue){
			case 'GetMostPopularAssets':
				yAxisName = 'Antal visninger';
				xAxisName = 'Assets';
				break;
			case 'GetSessionsByBrowser':
				yAxisName = 'Sessioner';
				xAxisName = 'Browsere';
				break;
			case 'GetSessionsByOS':
				yAxisName = 'Sessioner';
				xAxisName = 'OS';
				break;
			case 'GetSessionsByCountry':
				yAxisName = 'Sessioner';
				xAxisName = 'Land';
				break;
			case 'GetSessionsByDeviceCategory':
				yAxisName = 'Sessioner';
				xAxisName = 'Enhedskategori';
				break;
			case 'GetMostFavorizedDummy':
				xAxisName = 'Titel';
				yAxisName = 'Antal gange favoriseret';
				break;
			case 'GetAssetTypeAllocationDummy':
				xAxisName = 'Assettype';
				yAxisName = 'Antal assets';
				break;
			default:
				yAxisName = 'Error';
				xAxisName = 'Error';
				
		}
		if (true) {
			var chart = Ext.create('RestTest.view.barChartView.BarChart', {
			series: {
				type: howToShowValue
			},
			axes: [{
				title: xAxisName,
				type: 'category',
				position: 'bottom'
			},
			{
				title: yAxisName,
				type: 'numeric',
				position: 'left'
			}]
			});
		};


		Ext.Ajax.request({
			url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest/' + whatToShowValue +'/maxResult=10', //getpageviewsbybrowser
			method:'GET',
			disableCaching: true,
			headers: {accept : 'application/json; charset=utf-8'},
			useDefaultXhrHeader: false,

			success: function(response) {
				var responseText = response.responseText;
                //outputContainer.update(responseText);
                var jsonDataObj = Ext.JSON.decode(responseText);
                var datastore = Ext.create('Ext.data.Store', {
                	data: jsonDataObj
                });
                
                chart.bindStore(datastore); 
            },
            failure: function(response) {
                Ext.Msg.alert('Fail! Here\'s why: ' + response.responseText);
            }
		});

		panel.add(chart);


	}
});
