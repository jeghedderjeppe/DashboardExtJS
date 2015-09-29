var globalStartDate, globalEndDate, isCustomDate = false;
var me;
Ext.define('RestTest.view.restView.RestViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restview',

    requires: [
        'RestTest.view.barChartView.BarChart',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.series.Pie',
        'Ext.chart.series.Area',
        'Ext.chart.interactions.CrossZoom',
        'Ext.chart.interactions.Crosshair',
        'Ext.chart.interactions.ItemHighlight'
    ],
    checkboxHandler: function (checkbox, checked) {
        var startDatepicker = this.lookupReference('startDatepicker');
        var endDatepicker = this.lookupReference('endDatepicker');
        var dateCombo = this.lookupReference('datesCombo');
        dateCombo.setHidden(checked);
        startDatepicker.setVisible(checked);
        endDatepicker.setVisible(checked);
        isCustomDate = checked;
    },
    onShowButtonClick: function() {
        me = this;
        function getDatetime(valueFromDatesCombo) {
            var date = new Date();
            switch (valueFromDatesCombo) {
                case "zeroDay":
                    date = date.setDate(date.getDate());
                    break;
                case "oneDay":
                    date = date.setDate(date.getDate() - 1);
                    break;
                case "threeDay":
                    date = date.setDate(date.getDate() - 3);
                    break;
                case "oneWeek":
                    date = date.setDate(date.getDate() - 7);
                    break;
                case "twoWeek":
                    date = date.setDate(date.getDate() - 14);
                    break;
                case "threeWeek":
                    date = date.setDate(date.getDate() - 21);
                    break;
                case "fourWeek":
                    date = date.setDate(date.getDate() - 28);
                    break;
                case "oneMonth":
                    date = date.setMonth(date.getMonth() - 1);
                    break;
                case "twoMonth":
                    date = date.setMonth(date.getMonth() - 2);
                    break;
                case "threeMonth":
                    date = date.setMonth(date.getMonth() - 3);
                    break;
                case "fourMonth":
                    date = date.setMonth(date.getMonth() - 4);
                    break;
                default:
                    date = date.setMonth(date.getMonth() - 1);
            }
            return new Date(date).toJSON().split("T")[0];
        }

        var datesChosen = this.lookupReference('datesCombo');
        
        var whatToShowCombo = this.lookupReference('whatToShowCombo');
        var howToShowCombo = this.lookupReference('howToShowCombo');
        var maxResult = this.lookupReference('maxResultTextField').getValue();
        var videoToShowStats = this.lookupReference('videosCombo').getValue();
        
        var whatToShowValue = whatToShowCombo.getValue();
        var howToShowValue = howToShowCombo.getValue();
        var chosenDay = datesChosen.getValue();
        
        var startDate, endDate;
        if (isCustomDate) {
            startDate = globalStartDate;
            endDate = globalEndDate;
        } else {
            startDate = getDatetime(chosenDay);
            endDate = new Date().toJSON().split('T')[0];
        };
        if (!maxResult) {
            maxResult = 25;
        };
        if (howToShowValue === 'null' || !howToShowValue) {
            howToShowValue = 'line';
        };

        var parameters = 'parameters=maxResult='+maxResult+'|startDate='+startDate+"|endDate="+endDate+'|seriesType='+howToShowValue;
        var label = function(v) { return v };

        switch (whatToShowValue) {
            case 'GetHitsPerMilestone':
                parameters += '|itemId=' + videoToShowStats;
                break;
            case 'GetDropoutsPerMilestone':
                parameters += '|itemId=' + videoToShowStats;
                break;
            case 'GetDropoutsPercentForAllVideos':
                label = function(v) { return v + '%'; };
                parameters += '|itemId=' + videoToShowStats;
                break;
             case 'GetTimeSpentPerJob':
                parameters += '|jobChainId=' + this.lookupReference('jobChainIdTextField').getValue();;
                break;
            case 'GetCompletedTypeAllocationOverTime':
                parameters += ' |intervalType='+this.lookupReference('intervalCombo').getValue();
                break;
            default:
                yAxisName = 'Error';
                xAxisName = 'Error';
                title = 'Error';
        }
        console.log(parameters + "  " + whatToShowValue);
        addChartToPanel(whatToShowValue, parameters);
       
    },
    removeButtonClick: function (button) {
        var chart = button.up();
        chart.destroy();
    }
});

function addChartToPanel (whatToShowValue, parameters) {      
    var panel = me.lookupReference('outputPanel');  
     Ext.Ajax.request( { 
            url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest?method=' + whatToShowValue + '&' + parameters, //getpageviewsbybrowser
            method: 'GET',
            disableCaching: true,
            headers: {
                accept: 'application/json; charset=utf-8'
            },
            useDefaultXhrHeader: false,

            success: function(response) {
                var responseText = response.responseText;
                var dataFromWcf;
                try{
                    dataFromWcf = Ext.JSON.decode(responseText);
                    if (typeof dataFromWcf.KeyValues[0] === 'string') { 
                        dataFromWcf.KeyValues = Ext.JSON.decode(dataFromWcf.KeyValues[0]);
                        console.log(dataFromWcf.KeyValues);
                    };
                } catch(e){
                    console.log(e);
                    Ext.Msg.alert(response.responseText);
                }

                console.log(dataFromWcf);
                var store = Ext.create('Ext.data.Store',{
                        data: dataFromWcf.KeyValues
                    });
                var axes = [];
                if (dataFromWcf.Series[0].Type != 'pie') {
                    for (var i = 0; i < dataFromWcf.Axis.length; i++) {
                        var axis = {
                            title: dataFromWcf.Axis[i].Title,
                            type: dataFromWcf.Axis[i].Type,
                            position: dataFromWcf.Axis[i].Position,
                            fields: dataFromWcf.Axis[i].Fields
                        };
                        axes.push(axis);
                    };
                };
                var series = [];

                for (var i = 0; i < dataFromWcf.Series.length; i++) {
                    var serie;
                    if (dataFromWcf.Series[0].Type != 'pie') {
                         serie = {
                            title: dataFromWcf.Series[i].Title,
                            type: dataFromWcf.Series[i].Type,
                            smooth: dataFromWcf.Series[i].Smooth,
                            xField: dataFromWcf.Series[i].XField, 
                            yField: dataFromWcf.Series[i].YField, 
                            marker: true,
                            highlight: {
                                size: 7,
                                radius: 7
                            },
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
                    } else {
                        var serie = {
                            title: dataFromWcf.Series[i].Title,
                            type: dataFromWcf.Series[i].Type,
                            xField: dataFromWcf.Series[i].YField,
                            marker: true,
                            label:{
                                field: dataFromWcf.Series[i].XField
                            },
                            highlight: true,
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
                    };
                   
                    series.push(serie);
                };
                var listeners;
                if (whatToShowValue === 'GetJobChainsByLongestCompletionTime' || whatToShowValue === 'GetFailedJobChains') {
                    listeners = {
                        itemdblclick: function(chart, item, event) {
                            var seriesType = chart.getSeries()[0].type;
                            var jobChainId = item.record.data.JobChainId;

                            addChartToPanel('GetTimeSpentPerJob', 'parameters=seriesType=' + seriesType + '|jobChainId=' + jobChainId);
                        }
                    }
                } else if (whatToShowValue === 'GetCompletedTypeAllocationOverTime') { //HER SKAL VI FORTSÆTTE FRA
                    listeners = {
                        itemdblclick: function(chart, item, event) {
                            var intervalType;
                            if (item.record.data.hasOwnProperty('day')) {
                                
                            } else if (item.record.data.hasOwnProperty('week')) {
                                intervalType = 'day';
                            } else if (item.record.data.hasOwnProperty('month')) {
                                intervalType = 'week';
                            } else {
                                //ERROR
                            }

                            var seriesType = chart.getSeries()[0].type;

                            var startDate = item.record.data.startDate;
                            var endDate   = item.record.data.endDate;
                            console.log(item.record.data);
                            addChartToPanel('GetCompletedTypeAllocationOverTime', 'parameters=' +
                                'maxResult=' + 7 +
                                '|startDate=' + startDate +
                                '|endDate=' + endDate +
                                '|seriesType=' + seriesType +
                                '|intervalType=' + intervalType
                            );
                        }
                    }
                }
                var chart;
                if (dataFromWcf.Series[0].Type != 'pie') {
                    chart = Ext.create('Ext.chart.CartesianChart', {
                        plugins: {
                            ptype: 'chartitemevents'
                        },
                        title: dataFromWcf.Title,
                        store: store,
                        height: 500,
                        width: 900,
                        axes:axes,
                        series: series,
                        interactions: 'crosszoom',
                        style:'padding-bottom:10px;',
                        legend:{
                            docked: 'right',
                            scrollable: true
                        },
                        interactions: {
                            type: 'crosshair',
                            axes: {
                                left: {
                                    label: {
                                        fillStyle: 'white'
                                    },
                                    rect: {
                                        fillStyle: 'brown',
                                        radius: 6
                                    }
                                },
                                bottom: {
                                    label: {
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            lines: {
                                horizontal: {
                                    strokeStyle: 'brown',
                                    lineWidth: 2,
                                    lineDash: [20, 2, 2, 2, 2, 2, 2, 2]
                                }
                            }
                        },
                        listeners: listeners,
                        bbar: {
                            xtype: 'button',
                            text: 'Remove',
                            listeners: {
                                click: 'removeButtonClick'
                            }
                        },
                        tbar: {
                            xtype: 'button',
                            text: 'Save chart to PNG',
                            handler: function (btn) {
                              // console.log();
                                btn.up('panel').download({
                                    format: 'png'
                                });
                            }
                        }
                    });
                } else {
                    chart = Ext.create('Ext.chart.PolarChart', {
                        plugins: {
                            ptype: 'chartitemevents'
                        },
                        interactions: ['rotate', 'itemhighlight'],
                        title: dataFromWcf.Title,
                        store: store,
                        height: 500,
                        width: 900,
                        series: series,
                        style:'padding-bottom:10px;',
                        legend:{
                            docked: 'right',
                            scrollable: true
                        },
                        listeners: listeners,
                        bbar: {
                            xtype: 'button',
                            text: 'Remove',
                            listeners: {
                                click: 'removeButtonClick'
                            }
                        },
                        tbar: {
                            xtype: 'button',
                            text: 'Save chart to PNG',
                            handler: function (btn) {
                              // console.log();
                                btn.up('panel').download({
                                    format: 'png'
                                });
                            }
                        }
                    });
                };       
                //console.log(series);
               // console.log(chart.series);
                panel.add(chart);
            },
            failure: function(response) {
                Ext.Msg.alert('Failed to connect to webservice.');
            }
        });
}






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