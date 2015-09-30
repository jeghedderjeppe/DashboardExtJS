var globalStartDate, globalEndDate, isCustomDate = false;
var me;
Ext.define('RestTest.view.restView.RestViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restview',

    requires: [
        'Ext.chart.interactions.Rotate',
        'Ext.chart.series.Pie',
        'Ext.chart.series.Area',
        'Ext.chart.interactions.CrossZoom',
        'Ext.chart.interactions.Crosshair',
        'Ext.chart.interactions.ItemHighlight',
        'RestTest.view.cartesianChartView.CartesianChartView',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Ext.chart.series.Bar'
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
                    Ext.Msg.alert('Alert!', 'Could not parse response from server.');
                }

                console.log(dataFromWcf);
                var store = Ext.create('Ext.data.Store',{
                        data: dataFromWcf.KeyValues
                    });
                var axes = getAxis(dataFromWcf);
                var series = getSeries(dataFromWcf);
                var listeners = getListeners(dataFromWcf, whatToShowValue);
                var chart;
                if (dataFromWcf.Series[0].Type != 'pie') {
                    chart = Ext.create('RestTest.view.cartesianChartView.CartesianChartView', {
                        plugins: {
                            ptype: 'chartitemevents'
                        },
                        title: dataFromWcf.Title,
                        store: store,
                        axes: axes,
                        series: series,
                        listeners: listeners
                    });
                } else {
                    chart = Ext.create('RestTest.view.polarChartView.PolarChartView', {
                        plugins: {
                            ptype: 'chartitemevents'
                        },
                        title: dataFromWcf.Title,
                        store: store,
                        series: series,
                        listeners: listeners
                    });
                };
                //console.log(series);
               // console.log(chart.series);
                panel.add(chart);
            },
            failure: function(response) {
                if (response.text) {
                    Ext.Msg.alert('Alert!', response.text);
                } else {
                    Ext.Msg.alert('Failed to connect to webservice.');
                }
                
            }
        });
}

function getAxis (dataFromWcf) { 
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
    return axes;
}

function getSeries (dataFromWcf) {
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
    return series;
}

function getListeners (dataFromWcf, whatToShowValue) {
    var listeners;
    if (whatToShowValue === 'GetJobChainsByLongestCompletionTime' || whatToShowValue === 'GetFailedJobChains') {
        listeners = {
            itemdblclick: function(chart, item, event) {
                var seriesType = chart.getSeries()[0].type;
                var jobChainId = item.record.data.JobChainId;

                addChartToPanel('GetTimeSpentPerJob', 'parameters=seriesType=' + seriesType + '|jobChainId=' + jobChainId);
            }
        }
    } else if (whatToShowValue === 'GetCompletedTypeAllocationOverTime') {
        listeners = {
            itemdblclick: function(chart, item, event) {
                var intervalType;
                if (item.record.data.hasOwnProperty('day')) {
                    return null;
                } else if (item.record.data.hasOwnProperty('week')) {
                    intervalType = 'day';
                } else if (item.record.data.hasOwnProperty('month')) {
                    intervalType = 'week';
                } else {
                    Ext.Msg.alert('Invalid interval type');
                    return null;
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
    return listeners;
}