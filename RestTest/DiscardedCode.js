// var series = [];
//                 for (var i = 0; i < dataFromWcf.Series.length; i++) {
//                     if (dataFromWcf.Series[].Type != 'pie') {
//                         var serie = {
//                             title: dataFromWcf.Series[i].Title,
//                             type: dataFromWcf.Series[i].Type,
//                             smooth: dataFromWcf.Series[i].Smooth,
//                             xField: dataFromWcf.Series[i].XField, 
//                             yField: dataFromWcf.Series[i].YField, 
//                             marker: true,
//                             tooltip: {
//                                 trackMouse: true,
//                                 interactions: [{
//                                     type: 'itemhighlight'
//                                 }],
//                                 scope: this,
//                                 renderer: function (toolTip, storeItem, item) {
//                                     toolTip.setHtml(storeItem.get('Tooltip'));
//                                 }
//                             }
//                         };
//                     } else {
//                         var serie = {
//                             title: dataFromWcf.Series[i].Title,
//                             type: dataFromWcf.Series[i].Type,
//                             smooth: dataFromWcf.Series[i].Smooth,
//                             xField: dataFromWcf.Series[i].XField,
//                             marker: true,
//                             label:{
//                                 field: dataFromWcf.Series[i].YField, 
//                                 display: 'outside'
//                             },
//                             tooltip: {
//                                 trackMouse: true,
//                                 interactions: [{
//                                     type: 'itemhighlight'
//                                 }],
//                                 scope: this,
//                                 renderer: function (toolTip, storeItem, item) {
//                                     toolTip.setHtml(storeItem.get('Tooltip'));
//                                 }
//                             }
//                         };
//                     };
//                     series.push(serie);
//                 };
 
// var getStoreFromTwoJsonObject = function(json1, json2, yKey1, yKey2) {
//     var JsonRoot = "[";
//     for (i = 0; i < json1.length; i++) {
//         for (j = 0; j < json2.length; j++) {
//             if (json1[i].Key == json2[j].Key) {
//                 console.log(json1[i].Key + " " + json2[j].Key)
//                 JsonRoot += "{'key':" + json1[i].Key + "," + "value1" + ":" + json1[i].Value + "," + "value2" + ":" + json2[j].Value + "},";
//             };
//         }
//     };
//     JsonRoot = JsonRoot.substring(0, JsonRoot.length - 1);
//     JsonRoot += "]";
//     //console.log(Ext.JSON.decode(JsonRoot));
//     /*for(var jsonObj in json1){
//     	console.log(json1[jsonObj]);
//     	//JsonRoot += "{key:" + jsonObj[key] + ", value1: " + json1[i][value] + ", value2: " + json2[i][value] + "}";
//     }
//     console.log(JsonRoot);
//     var store = Ext.create('Ext.data.Store',{
//     	fields: ['key', 'value1', 'value2'],

//     	data: Ext.JSON.decode(JsonRoot)
//     });

//     return store;
// };*/


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






    //testChart 1

                        // var chart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart', {
                        //     store: store,
                        //     height: 400,
                        //     width: 800,
                        //     axes: [{
                        //         title: 'Views',
                        //         type: 'numeric',
                        //         position: 'left',
                        //         grid: true,
                        //         fields: [dataFromWcf.Fields[1].Name] //value1
                        //     },{
                        //         title: 'Favorizations',
                        //         type: 'numeric',
                        //         position: 'right',
                        //         fields: [dataFromWcf.Fields[2].Name] //value2
                        //     }, {
                        //         title: 'Asset ID',
                        //         type: 'category',
                        //         position: 'bottom',
                        //         fields: [dataFromWcf.Fields[0].Name] //key
                        //     }],
                        //     series: [{
                        //         title: 'Favorizations',
                        //         type: 'bar',
                        //         xField: dataFromWcf.Fields[0].Name, //key
                        //         yField: dataFromWcf.Fields[2].Name, //value2
                        //         style: {
                        //              fill: "#C92020"
                        //         },
                        //         tooltip: {
                        //             trackMouse: true,
                        //             interactions: [{
                        //                 type: 'itemhighlight'
                        //             }],
                        //             width: 100,
                        //             height: 100,
                        //             scope: this,
                        //             renderer: function (toolTip, storeItem, item) {
                        //                 toolTip.setHtml(storeItem.get('Title') + 'Value: ' + storeItem.get('Value'));
                        //                 // console.log(toolTip);
                        //                 //console.log(storeItem);
                        //                 // console.log(item);
                        //             }
                        //         }
                        //     },{
                        //         title: 'Views',
                        //         type: 'line',
                        //         xField: dataFromWcf.Fields[0].Name, //key
                        //         yField: [dataFromWcf.Fields[1].Name],//value1
                        //         markerConfig: {
                        //             type: 'cross',
                        //             size: 4,
                        //             radius: 4,
                        //             'stroke-width': 100
                        //         },
                        //         style: {
                        //             stroke: '#798EE0',
                        //              width: 100
                        //         },
                        //         marker: true,
                        //         listeners: {
                        //             itemmousemove: function (series, item, event) {
                        //                 console.log('itemmousemove', item.category, item.field);
                        //             }
                        //         }
                        //     }],
                        //     legend: {
                        //         docked: 'right'
                        //     }
                        // }); 

// showTestChart: function() {
//         var panel = this.lookupReference('outputPanel');
//         /*var testchart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart');
//         panel.add(testchart);*/
//         var mostviewedAssetJson;
//         var mostFavorizedAssetJson;
//         Ext.Ajax.request({
//                     url: 'http://localhost:49879/SendStatistics.svc/rest/GetRequest?method=GetMostPopularAssetVsVsFavorized&parameters=maxResult=100|jobChainId=42665',
//                     method: 'GET',
//                     disableCaching: true,
//                     headers: {
//                         accept: 'application/json; charset=utf-8'
//                     },
//                     useDefaultXhrHeader: false,

//                     success: function(response) {
//                         var responseText = response.responseText;
//                         //outputContainer.update(responseText);
//                         mostFavorizedAssetJson = Ext.JSON.decode(responseText);
//                         var store = Ext.create('Ext.data.Store',{
//                                 fields: ['key', 'value1', 'value2'],
//                                 data: Ext.JSON.decode(responseText)
//                             });//getStoreFromTwoJsonObject(mostviewedAssetJson, mostFavorizedAssetJson, "Views", "Favorizations");
//                         console.log(store);
//                         var chart = Ext.create('RestTest.view.testViews.MultipleDatasetsChart', {
//                             store: store,
//                             height: 400,
//                             width: 800,
//                             axes: [{
//                                 title: 'y axis 1',
//                                 type: 'numeric',
//                                 position: 'left',
//                                 grid: true,
//                                 fields: ['value1']
//                             },{
//                                 title: 'y axis 2',
//                                 type: 'numeric',
//                                 position: 'right',
//                                 fields: ['value2']
//                             }, {
//                                 title: 'x axis',
//                                 type: 'category',
//                                 position: 'bottom',
//                                 fields: ['key']
//                             }],
//                             series: [{
//                                 type: 'bar',
//                                 xField: 'key',
//                                 yField: 'value2',
//                                 style: {
//                                      fill: "#C92020"
//                                 }
//                             },{
//                                 type: 'line',
//                                 xField: 'key',
//                                 yField: ['value1'],
//                                 markerConfig: {
//                                     type: 'cross',
//                                     size: 4,
//                                     radius: 4,
//                                     'stroke-width': 100
//                                 },
//                                 style: {
//                                     stroke: '#798EE0',
//                                      width: 100
//                                 },
//                                 marker: true,
//                                 listeners: {
//                                     itemmousemove: function (series, item, event) {
//                                         console.log('itemmousemove', item.category, item.field);
//                                     }
//                                 }
//                             }],
//                             legend: {
//                                 docked: 'bottom'
//                             }
//                         }); 
//                         panel.add(chart);
//                     },
//                     failure: function(response) {
//                         Ext.Msg.alert('Fail! Here\'s why: ' + response.responseText);
//                     }
//                 });
//     }

/*    tooltipTestShow: function () {
        var panel = this.lookupReference('outputPanel');
        Ext.Ajax.request({
                    url: 'http://localhost:49879/SendStatistics.svc/rest/GetRequest?method=GetSessionsByDeviceCategory&parameters=maxResult=100|itemId=129',
                    method: 'GET',
                    disableCaching: true,
                    headers: {
                        accept: 'application/json; charset=utf-8'
                    },
                    useDefaultXhrHeader: false,

                    success: function(response) {
                        
                        var responseText = response.responseText;
                        var dataFromWcf = Ext.JSON.decode(responseText);

                        console.log(dataFromWcf);
                        var store = Ext.create('Ext.data.Store',{
                                data: dataFromWcf.KeyValues
                            });
                        var axes = [];
                        for (var i = 0; i < dataFromWcf.Axis.length; i++) {
                            var axis = {
                                title: dataFromWcf.Axis[i].Title,
                                type: dataFromWcf.Axis[i].Type,
                                position: dataFromWcf.Axis[i].Position,
                                fields: dataFromWcf.Axis[i].Fields
                            };
                            axes.push(axis);
                        };
                        var series = [];
                        for (var i = 0; i < dataFromWcf.Series.length; i++) {
                            var serie = {
                                title: dataFromWcf.Series[i].Title,
                                type: dataFromWcf.Series[i].Type,
                                smooth: dataFromWcf.Series[i].Smooth,
                                xField: dataFromWcf.Series[i].XField, 
                                yField: dataFromWcf.Series[i].YField, 
                                tooltip: {
                                    trackMouse: true,
                                    interactions: [{
                                        type: 'itemhighlight'
                                    }],
                                    scope: this,
                                    renderer: function (toolTip, storeItem, item) {
                                        toolTip.setHtml(storeItem.get('Tooltip'));
                                    }
                                }
                            };
                            series.push(serie);
                        }
                        var chart = Ext.create('Ext.chart.CartesianChart', {
                            title: dataFromWcf.Title,
                            store: store,
                            height: 400,
                            width: 800,
                            axes:axes,
                            series: series,
                            legend:{
                                docked: 'right'
                            },
                            bbar: {
                                xtype: 'button',
                                text: 'Remove',
                                listeners: {
                                    click: 'removeButtonClick'
                                }
                            }

                        });
                        
                      
                        console.log(chart.series);
                        panel.add(chart);
                    },
                    failure: function(response) {
                        Ext.Msg.alert('Fail! Here\'s why: ' + response.responseText);
                    }
                });
    },*/


   /*         case 'GetMostPopularAssets':
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
                xAxisName = 'AssetType';
                yAxisName = 'Amount';
                title = 'GetAssetTypeAllocationDummy';
                break;
            case 'GetFailedJobTypeAllocation':
                xAxisName = 'JobID';
                yAxisName = 'Times failed';
                title = 'GetFailedJobTypeAllocation';
                break;
            case 'GetPercentageFinishedForAllVideos':
                xAxisName = 'Video';
                yAxisName = 'Percent';
                title = 'GetPercentageFinishedForAllVideos';
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
            case 'GetAverageJobTimePerBatchServer':
                xAxisName = 'Batch server';
                yAxisName = 'Avg. Job time';
                title = 'GetAverageJobTimePerBatchServer';
                break;
            case 'GetAmountStartedForAllVideos':
                xAxisName = 'Asset ID';
                yAxisName = 'Hits';
                title = 'GetAmountStartedForAllVideos';
                break;*/


    //     onPostButtonClick: function() {
    //     var outputContainer = this.lookupReference('outputContainer');
    //     var outputChart = this.lookupReference('outputChart');


    //     var ajax = Ext.Ajax.request({
    //         url: 'http://localhost:49879/SendStatistics.svc/rest/PostRequest',
    //         method: 'POST',
    //         /*          disableCaching: false,
    //                     cors:true,*/
    //         headers: {
    //             accept: 'application/json; charset=utf-8'
    //         },
    //         //params: Ext.encode({parameterOne: 1}),
    //         jsonData: {
    //             "parameterOne": "1"
    //         },


    //         useDefaultXhrHeader: false,

    //         success: function(response) {
    //             console.log('post success!')


    //         },
    //         failure: function(response, conn) {
    //             console.log(conn);
    //         }
    //     });
    //     console.log(ajax.getDefaultXhrHeader()); //getDefaultXhrHeader
    // },

    

    // onGetButtonClick: function() {
    //     var outputChart = this.lookupReference('outputChart');
    //     outputContainer.update(input);

    //     Ext.Ajax.request({
    //         url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest/GetMostPopularAssets/10', //getpageviewsbybrowser
    //         method: 'GET',
    //         disableCaching: true,
    //         headers: {
    //             accept: 'application/json; charset=utf-8'
    //         },
    //         useDefaultXhrHeader: false,

    //         success: function(response) {
    //             var responseText = response.responseText;
    //             //outputContainer.update(responseText);
    //             var jsonDataObj = Ext.JSON.decode(responseText);
    //             var datastore = Ext.create('Ext.data.Store', {
    //                 data: jsonDataObj
    //             });

    //             outputChart.bindStore(datastore);


    //         },
    //         failure: function(response) {
    //             outputContainer.update('failure');
    //         }
    //     });

    //     console.log('after request');
    // },