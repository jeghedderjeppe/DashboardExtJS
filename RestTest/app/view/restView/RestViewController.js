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

        var parameters = 'parameters=maxResult=25';
        var label = function(v) { return v };

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
                parameters += '|itemId=' + videoToShowStats;
                break;
            case 'GetDropoutsPerMilestone':
                xAxisName = 'Milestone';
                yAxisName = 'Hits';
                title = 'GetDropoutsPerMilestone';
                parameters += '|itemId=' + videoToShowStats;
                break;
            case 'GetPercentageFinishedForAllVideos':
                xAxisName = 'Video';
                yAxisName = 'Percent';
                title = 'GetPercentageFinishedForAllVideos';
                break;
            case 'GetDropoutsPercentForAllVideos':
                xAxisName = 'Video';
                yAxisName = '';
                label = function(v) { return v + '%'; };
                parameters += '|itemId=' + videoToShowStats;
                title = 'GetDropoutsPercentForAllVideos';
                break;
             case 'GetJobChainsByLongestCompletionTime':
                xAxisName = 'Job chain ID';
                yAxisName = 'Seconds spent';
                title = 'GetJobChainsByLongestCompletionTime';
                break;
            case 'GetFailedJobChains':
                xAxisName = 'Job chain ID';
                yAxisName = 'Seconds spent';
                title = 'GetFailedJobChains';
                break;
             case 'GetTimeSpentPerJob':
                xAxisName = 'JobID';
                yAxisName = 'Seconds spent';
                title = 'GetTimeSpentPerJob';
                parameters += '|jobChainId=' + 42665;
                break;
            case 'GetFailedJobTypeAllocation':
                xAxisName = 'JobID';
                yAxisName = 'Times failed';
                title = 'GetFailedJobTypeAllocation';
                break;
            case 'GetAverageJobTimePerBatchServer':
                xAxisName = 'Batch server';
                yAxisName = 'Avg. Job time';
                title = 'GetAverageJobTimePerBatchServer';
                break;
            case 'GetAmountStartedForAllVideos':
                xAxisName = 'Video ID';
                yAxisName = 'Hits';
                title = 'GetAmountStartedForAllVideos';
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
                position: 'bottom',
                label: { renderer: label }
            }, {
                title: yAxisName,
                type: 'numeric',
                position: 'left',
                grid: true
            }]
        });

        console.log(parameters);
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



        /*Ext.Ajax.request({
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
                        var store = getStoreFromTwoJsonObject(mostviewedAssetJson, mostFavorizedAssetJson, "Views", "Favorizations");
                        console.log(store);
                        var chart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart', {
                        	store: store,
	                       	height: 400,
	                       	width: 800,
	                       	axes: [{
						    	title: 'y axis 1',
						        type: 'numeric',
						        position: 'left',
                                grid: true,
						        fields: ['value1']
						    },{
                                title: 'y axis 2',
                                type: 'numeric',
                                position: 'right',
                                fields: ['value2']
                            }, {
						    	title: 'x axis',
						        type: 'category',
						        position: 'bottom',
						        fields: ['key']
						    }],
						    series: [{
						        type: 'bar',
						        xField: 'key',
						        yField: 'value2',
						        style: {
                                     fill: "#C92020"
                                }
						    },{
                                type: 'line',
                                xField: 'key',
                                yField: ['value1'],
                                markerConfig: {
                                    type: 'cross',
                                    size: 4,
                                    radius: 4,
                                    'stroke-width': 100
                                },
                                style: {
                                    stroke: '#798EE0',
                                     width: 100
                                },
                                marker: true,
                                listeners: {
                                    itemmousemove: function (series, item, event) {
                                        console.log('itemmousemove', item.category, item.field);
                                    }
                                }
                            }],
                            legend: {
                                docked: 'bottom'
                            }
                        }); 
                        
                        //     width: 800,
                        //     height: 400,
                        //     store: store,
                        //     axes: [{
                        //         title: 'test x axis',
                        //         type: 'category',
                        //         position: 'bottom',
                        //         fields: ['key']
                        //     }, {
                        //         title: 'test y axis',
                        //         type: 'numeric',
                        //         position: 'left',
                        //         fields: ['value1', 'value2']
                        //     }],
                        //     series: [{
                        //         type: 'line',
                        //         xField: 'Key',
                        //         yField: 'Value1'
                        //     }, {
                        //         type: 'line',
                        //         xField: 'Key',
                        //         yField: 'Value2'
                        //     }]
                        // });
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
        });*/
        Ext.Ajax.request({
                    url: 'http://localhost:49879/SendStatistics.svc/rest/GetRequest?method=GetMostPopularAssetVsVsFavorized&parameters=maxResult=100|jobChainId=42665',
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
                        var store = Ext.create('Ext.data.Store',{
                                fields: ['key', 'value1', 'value2'],
                                data: Ext.JSON.decode(responseText)
                            });//getStoreFromTwoJsonObject(mostviewedAssetJson, mostFavorizedAssetJson, "Views", "Favorizations");
                        console.log(store);
                        var chart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart', {
                            store: store,
                            height: 400,
                            width: 800,
                            axes: [{
                                title: 'y axis 1',
                                type: 'numeric',
                                position: 'left',
                                grid: true,
                                fields: ['value1']
                            },{
                                title: 'y axis 2',
                                type: 'numeric',
                                position: 'right',
                                fields: ['value2']
                            }, {
                                title: 'x axis',
                                type: 'category',
                                position: 'bottom',
                                fields: ['key']
                            }],
                            series: [{
                                type: 'bar',
                                xField: 'key',
                                yField: 'value2',
                                style: {
                                     fill: "#C92020"
                                }
                            },{
                                type: 'line',
                                xField: 'key',
                                yField: ['value1'],
                                markerConfig: {
                                    type: 'cross',
                                    size: 4,
                                    radius: 4,
                                    'stroke-width': 100
                                },
                                style: {
                                    stroke: '#798EE0',
                                     width: 100
                                },
                                marker: true,
                                listeners: {
                                    itemmousemove: function (series, item, event) {
                                        console.log('itemmousemove', item.category, item.field);
                                    }
                                }
                            }],
                            legend: {
                                docked: 'bottom'
                            }
                        }); 
                        panel.add(chart);
                    },
                    failure: function(response) {
                        Ext.Msg.alert('Fail! Here\'s why: ' + response.responseText);
                    }
                });
    }
});


var getStoreFromTwoJsonObject = function(json1, json2, yKey1, yKey2) {
    var JsonRoot = "[";
    for (i = 0; i < json1.length; i++) {
        for (j = 0; j < json2.length; j++) {
            if (json1[i].Key == json2[j].Key) {
                console.log(json1[i].Key + " " + json2[j].Key)
                JsonRoot += "{'key':" + json1[i].Key + "," + "value1" + ":" + json1[i].Value + "," + "value2" + ":" + json2[j].Value + "},";
            };
        }
    };
    JsonRoot = JsonRoot.substring(0, JsonRoot.length - 1);
    JsonRoot += "]";
    //console.log(Ext.JSON.decode(JsonRoot));
    /*for(var jsonObj in json1){
    	console.log(json1[jsonObj]);
    	//JsonRoot += "{key:" + jsonObj[key] + ", value1: " + json1[i][value] + ", value2: " + json2[i][value] + "}";
    }*/
    console.log(JsonRoot);
    var store = Ext.create('Ext.data.Store',{
    	fields: ['key', 'value1', 'value2'],

    	data: Ext.JSON.decode(JsonRoot)
    });

    return store;
};


/*var getStoreFromTwoJsonObject = function(json1, json2, firstYKey, secondYKey) {

     var jsonObject = "[";
     for (i = 0; i < json1.length; i++) {
         jsonObject += jeppesJsonObj(json1[i].Key, json1[i].Value, json2, firstYKey, secondYKey);

         if (i != json1.length - 1) {
             jsonObject += ",";
         }

     };
     jsonObject += "]"




 
    var store = Ext.create('Ext.data.Store', {
        fields: ['Key', firstYKey, secondYKey],

        data: Ext.JSON.decode(jsonObject)
        });
    return store;

};

function jeppesJsonObj (keyfromJson1, valueFromJson1, json2, firstYKey, secondYKey) {
    for (var i = 0; i < json2.length; i++) {
        if (json2[i].key === keyfromJson1) {
            return "{'key':" + keyfromJson1 + "," + firstYKey + ":" + valueFromJson1 + "," + secondYKey + ":" + json2[i].Value + "}";
        };
    };
}*/

/*function jsonObjectStuff (firstDictKey, firstDictValue, firstYKey, secondYKey) {
    var xKey = firstDictKey;
    var xValue = firstDictKey;

    var firstYKey = firstYKey;
    var firstYValye = firstDictValue;

    var secondYKey = secondYKey;
    var secondYvalue = 0;

    function getObject () {
        return "{" + xKey + ":" + xValue + "," + firstYKey + ":" + firstYValue + "," + secondYKey + ":" + secondYvalue + "}";
    }
}*/

/* var jsonObject = "[";
        for (i = 0; i < json1.length; i++) {
            var lol = jsonObjectStuff("Key", json1[i].Key, firstYKey, secondYKey);
            for (var j = 0; j < json2.length; j++) {
                if (json2[j].Key == json1[i].Key) {
                    lol.secondYvalue = json2[j].Key
                }
            };
            jsonObject += lol.getValue();
            if (i != json1.length - 1) {
                jsonObject += ",";
            }

        }
        jsonObject += "]";*/


         /*  var JsonRoot = "[";
    for (i = 0; i < json1.length; i++) {
        if (!(i == json1.length - 1)) {
            JsonRoot += "{'key':" + json1[i].Key + "," + firstYKey + ":" + json1[i].Value + "," + secondYKey + ":" + json2[i].Value + "},";
        } else {
             JsonRoot += "{'key':" + json1[i].Key + "," + firstYKey + ":" + json1[i].Value + "," + secondYKey + ":" + json2[i].Value + "}";
        }

    };*/
    // JsonRoot += "]";

    /*for(var jsonObj in json1){
        console.log(json1[jsonObj]);
        //JsonRoot += "{key:" + jsonObj[key] + ", value1: " + json1[i][value] + ", value2: " + json2[i][value] + "}";
    }*/