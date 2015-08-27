Ext.define('RestTest.view.restView.RestViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restview',

    requires: [
        'RestTest.view.barChartView.BarChart'
    ],
    onGetButtonClick: function() {
        var outputChart = this.lookupReference('outputChart');
        outputContainer.update(input);

        Ext.Ajax.request({
            url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest/GetMostPopularAssets/10', //getpageviewsbybrowser
            method: 'GET',
            disableCaching: true,
            headers: {
                accept: 'application/json; charset=utf-8'
            },
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

    onPostButtonClick: function() {
        var outputContainer = this.lookupReference('outputContainer');
        var outputChart = this.lookupReference('outputChart');


        var ajax = Ext.Ajax.request({
            url: 'http://localhost:49879/SendStatistics.svc/rest/PostRequest',
            method: 'POST',
            /*			disableCaching: false,
            			cors:true,*/
            headers: {
                accept: 'application/json; charset=utf-8'
            },
            //params: Ext.encode({parameterOne: 1}),
            jsonData: {
                "parameterOne": "1"
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

    onShowButtonClick: function() {
        var panel = this.lookupReference('outputPanel');
        var whatToShowCombo = this.lookupReference('whatToShowCombo');
        var howToShowCombo = this.lookupReference('howToShowCombo');

        var whatToShowValue = whatToShowCombo.getValue();
        var howToShowValue = howToShowCombo.getValue();
        var videoToShowStats = this.lookupReference('videosCombo').getValue();
        var xAxisName, yAxisName, title;

        switch (whatToShowValue) {
            case 'GetMostPopularAssets':
                yAxisName = 'Antal visninger';
                xAxisName = 'Assets';
                title = 'GetMostPopularAssets';
                break;
            case 'GetSessionsByBrowser':
                yAxisName = 'Sessioner';
                xAxisName = 'Browsere';
                title = 'GetSessionsByBrowser';
                break;
            case 'GetSessionsByOS':
                yAxisName = 'Sessioner';
                xAxisName = 'OS';
                title = 'GetSessionsByOS';
                break;
            case 'GetSessionsByCountry':
                yAxisName = 'Sessioner';
                xAxisName = 'Land';
                title = 'GetSessionsByCountry';
                break;
            case 'GetSessionsByDeviceCategory':
                yAxisName = 'Sessioner';
                xAxisName = 'Enhedskategori';
                title = 'GetSessionsByDeviceCategory';
                break;
            case 'GetMostFavorizedDummy':
                xAxisName = 'Titel';
                yAxisName = 'Antal gange favoriseret';
                title = 'GetMostFavorizedDummy';
                break;
            case 'GetAssetTypeAllocationDummy':
                xAxisName = 'Assettype';
                yAxisName = 'Antal assets';
                title = 'GetAssetTypeAllocationDummy';
                break;
            case 'GetHitsPerMilestone':
                xAxisName = 'Milestone';
                yAxisName = 'Hits';
                title = 'GetHitsPerMilestone';
                break;
            case 'GetDropoutsPerMilestone':
                xAxisName = 'Milestone';
                yAxisName = 'Hits';
                title = 'GetDropoutsPerMilestone';
                break;
            case 'GetPercentageFinishedForAllVideos':
                xAxisName = 'Video';
                yAxisName = 'Percent';
                title = 'GetPercentageFinishedForAllVideos';
                break;
            default:
                yAxisName = 'Error';
                xAxisName = 'Error';
                title = 'Error';



        }
        var chart = Ext.create('RestTest.view.barChartView.BarChart', {
            title: title,
            series: {
                type: howToShowValue
            },
            axes: [{
                title: xAxisName,
                type: 'category',
                position: 'bottom'
            }, {
                title: yAxisName,
                type: 'numeric',
                position: 'left',
                grid: true
            }]
        });

        var parameters = 'parameters=maxResult=25';
        if (videoToShowStats) {
            parameters += '|itemId=' + videoToShowStats
        };

        Ext.Ajax.request({

            url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest?method=' + whatToShowValue + '&' + parameters, //getpageviewsbybrowser
            method: 'GET',
            disableCaching: true,
            headers: {
                accept: 'application/json; charset=utf-8'
            },
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
    },

    showTestChart: function() {
        var panel = this.lookupReference('outputPanel');
        /*var testchart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart');
        panel.add(testchart);*/
        var mostviewedAssetJson;
        var mostFavorizedAssetJson;



        Ext.Ajax.request({
            url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest?method=GetMostPopularAssets&parameters=maxResult=9', //getpageviewsbybrowser
            method: 'GET',
            disableCaching: false,
            headers: {
                accept: 'application/json; charset=utf-8'
            },
            useDefaultXhrHeader: false,

            success: function(response) {
                var responseText = response.responseText;
                //outputContainer.update(responseText);
                var mostviewedAssetJson = Ext.JSON.decode(responseText);
                console.log(mostviewedAssetJson);

                Ext.Ajax.request({
                    url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest?method=GetMostFavorizedDummy&parameters=maxResult=9',
                    method: 'GET',
                    disableCaching: true,
                    headers: {
                        accept: 'application/json; charset=utf-8'
                    },
                    useDefaultXhrHeader: false,

                    success: function(response) {
                        var responseText = response.responseText;
                        //outputContainer.update(responseText);
                        mostFavorizedAssetJson = Ext.JSON.decode(responseText);
                        console.log(mostFavorizedAssetJson);
                        var store = getStoreFromTwoJsonObject(mostviewedAssetJson, mostFavorizedAssetJson);
                        console.log(store);
                        var testStore = {
					        fields: ['pet', 'households', 'total'],
					        data: [
					            {pet: 'Cats', households: 38, total: 93},
					            {pet: 'Dogs', households: 45, total: 79},
					            {pet: 'Fish', households: 13, total: 171}
					        ]
					    };

	                        var chart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart', {
	                        	store: store,
		                       	height: 400,
		                       	width: 800,
		                       	axes: [{
							    	title: 'lol stuff',
							        type: 'numeric',
							        position: 'left',
							        fields: ['value1', 'value2']
							    }, {
							    	title: 'lol 2',
							        type: 'category',
							        position: 'bottom',
							        fields: ['key']
							    }],
							    series: [{
							        type: 'line',
							        xField: 'key',
							        yField: ['value1', 'value2'],
							        listeners: {
							            itemmousemove: function (series, item, event) {
							                console.log('itemmousemove', item.category, item.field);
							            }
							        }
							    },{
							        type: 'line',
							        xField: 'key',
							        yField: 'value2',
							        marker: true
							    }]
	                        }); 
                        
                           /* width: 800,
                            height: 400,
                            store: store,
                            axes: [{
                                title: 'test x axis',
                                type: 'category',
                                position: 'bottom',
                                fields: ['key']
                            }, {
                                title: 'test y axis',
                                type: 'numeric',
                                position: 'left',
                                fields: ['value1', 'value2']
                            }],
                            series: [{
                                type: 'line',
                                xField: 'Key',
                                yField: 'Value1'
                            }, {
                                type: 'line',
                                xField: 'Key',
                                yField: 'Value2'
                            }]
                        });*/
                        panel.add(chart);
                    },
                    failure: function(response) {
                        Ext.Msg.alert('Fail! Here\'s why: ' + response.responseText);
                    }
                });
            },
            failure: function(response) {
                Ext.Msg.alert('Fail! Here\'s why: ' + response.responseText);
            }
        });
    }
});


var getStoreFromTwoJsonObject = function(json1, json2) {
    var JsonRoot = "[";
    for (i = 0; i < json1.length; i++) {
        if (!(i == json1.length - 1)) {
            JsonRoot += "{'key':" + json1[i].Key + ", 'value1': " + json1[i].Value + ", 'value2': " + json2[i].Value + "},";
        } else {
            JsonRoot += "{'key':" + json1[i].Key + ", 'value1': " + json1[i].Value + ", 'value2': " + json2[i].Value + "}";
        }

    };
    JsonRoot += "]";

    /*for(var jsonObj in json1){
    	console.log(json1[jsonObj]);
    	//JsonRoot += "{key:" + jsonObj[key] + ", value1: " + json1[i][value] + ", value2: " + json2[i][value] + "}";
    }*/
    var store = Ext.create('Ext.data.Store',{
    	fields: ['key', 'value1', 'value2'],

    	data: Ext.JSON.decode(JsonRoot)
    });
    return store;
};
