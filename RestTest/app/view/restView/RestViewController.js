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
        console.log(videoToShowStats);
        var xAxisName, yAxisName;

        switch (whatToShowValue) {
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
            case 'GetHitsPerMilestone':
                xAxisName = 'Milestone';
                yAxisName = 'Hits';
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
                }, {
                    title: yAxisName,
                    type: 'numeric',
                    position: 'left'
                }]
            });
        };

    	var parameters = 'parameters=maxResult=9';
    	if (videoToShowStats) { parameters += '|itemId=' + videoToShowStats};

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
        var testchart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart');

        var mostviewedAssetJson;
        var mostFavorizedAssetJson;



        Ext.Ajax.request({
            url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest?method=GetMostPopularAssets&parameters=maxResult=9', //getpageviewsbybrowser
            method: 'GET',
            disableCaching: true,
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

                        var chart = Ext.create('RestTest.view.barChartView.BarChart', {
                            
                        	store: store,
                            series: [{
                                type: 'line',
                                xField: 'Key',
                                yField: 'Value1'
                            },{
                            	type: 'line',
                                xField: 'Key',
                                yField: 'Value2'
                            }],
                            axes: [{
                                title: 'test x axis',
                                type: 'category',
                                position: 'bottom'
                            }, {
                                title: 'test y axis',
                                type: 'numeric',
                                position: 'left'
                            }]
                        });
/*                        chart.bindStore(store);
*/                        panel.add(chart);
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
    return Ext.JSON.decode(JsonRoot);
};
