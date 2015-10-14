Ext.define('RestTest.view.chartView.ChartViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.chartview',

    updateChart: function(button) {
        var chart = button.up().up();
        var maxResult = this.lookupReference('maxResultTextField').getValue();
        console.log(maxResult);
        var parameters = chart.parameters; 
        if (parameters) {
            parameters = this.parseParamsToArray(chart.parameters);
            for (var i = 0; i < parameters.length; i++) {
                if (parameters[i].key == 'seriesType')
                    parameters[i].value = chosenSeriesType;
                if (parseInt(maxResult) > 0 && parameters[i].key == 'maxResult')
                	parameters[i].value = maxResult;
            };
            if (typeof parameters['maxResult'] == 'undefined') 
            	parameters['maxResult'] = maxResult;

            parameters = this.serializeParams(parameters);
            var test = chosenSeriesType;
        } else 
        	parameters = 'parameters=' +
        	    'seriesType=' + chosenSeriesType +
        	    '|maxResult=' + 10 +
        	    '|startDate' + DateTime.Now.AddDays(-30).ToString("yyyy-MM-dd") +
        	    '|endDate' + DateTime.Now.ToString("yyyy-MM-dd") +
        	    '|jobChainId' + 50974 +
        	    '|intervalType' + 'month';
        	    //FIX IMORGEN

        var panel = chart.up('panel');
        var items = panel.items.items;
        var itemsArray = [];
        for (var i in items) {
            itemsArray.push(items[i].id);
        }
        chart.destroy();

        var positionInPanel = itemsArray.indexOf(chart.id);
        console.log(parameters);
        addChartToPanel(chart.method, parameters, positionInPanel);
    },

    parseParamsToArray: function(parameters) {
        parameters = parameters.replace('parameters=', '');
        var parametersArray = parameters.split('|');
        var parametersArray2 = [];
        for (var i in parametersArray) {
            var parameterKeyValue = parametersArray[i].split('=');
            var tempVar = {};
            tempVar.key = parameterKeyValue[0];
            tempVar.value = parameterKeyValue[1];
            parametersArray2.push(tempVar);
        }
        return parametersArray2;
    },

    serializeParams: function(params) {
        var paramsSerialized = 'parameters='
        for (var i = 0; i < params.length; i++) {
            paramsSerialized += params[i]['key'] + '=' + params[i]['value'] + '|';
        };
        paramsSerialized = paramsSerialized.substring(0, paramsSerialized.length - 1);
        return paramsSerialized;
    },

    removeButtonClick: function(button) {
        var chart = button.up().up();
        chart.destroy();
    },

    onChartTypeCheck: function(item, checked) {
        // console.log(item, checked);
        chosenSeriesType = item.id;
    }
});
var chosenSeriesType = 'line';

function addChartToPanel(whatToShowValue, parameters, position) {
    var panel = me.lookupReference('outputPanel');
    if (typeof position === "undefined") {
        position = 0;
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
            var dataFromWcf;
            try {
                dataFromWcf = Ext.JSON.decode(responseText);
                if (typeof dataFromWcf.KeyValues[0] === 'string') {
                    dataFromWcf.KeyValues = Ext.JSON.decode(dataFromWcf.KeyValues[0]);
                    console.log(dataFromWcf.KeyValues);
                };
            } catch (e) {
                console.log(e);
                Ext.Msg.alert('Alert!', responseText);
            }

            console.log(dataFromWcf);
            var store = Ext.create('Ext.data.Store', {
                data: dataFromWcf.KeyValues
            });
            var axes = getAxis(dataFromWcf);
            var series = getSeries(dataFromWcf);
            var listeners = getListeners(dataFromWcf, whatToShowValue);
            var toolbar = getTbar(whatToShowValue);
            var chart;
            if (dataFromWcf.Series[0].Type != 'pie') {
                chart = Ext.create('RestTest.view.chartView.CartesianChartView', {
                    title: dataFromWcf.Title,
                    store: store,
                    axes: axes,
                    series: series,
                    listeners: listeners,
                    parameters: parameters,
                    method: whatToShowValue,
                    tbar: toolbar
                });
            } else {
                chart = Ext.create('RestTest.view.chartView.PolarChartView', {
                    title: dataFromWcf.Title,
                    store: store,
                    series: series,
                    listeners: listeners,
                    parameters: parameters,
                    method: whatToShowValue,
                    tbar: toolbar
                });
            };
            //console.log("tbar",chart);

            panel.insert(position, chart);
            //console.log(panel.items);
        },
        failure: function(response) {
            if (response.text) {
                Ext.Msg.alert('Alert!', response.text);
            } else {
                Ext.Msg.alert('Failed to connect to webservice.');
            }

        }
    });

    function getAxis(dataFromWcf) {
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

    function getSeries(dataFromWcf) {
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
                        renderer: function(toolTip, storeItem, item) {
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
                    label: {
                        field: dataFromWcf.Series[i].XField
                    },
                    highlight: true,
                    tooltip: {
                        trackMouse: true,
                        interactions: [{
                            type: 'itemhighlight'
                        }],
                        scope: this,
                        renderer: function(toolTip, storeItem, item) {
                            toolTip.setHtml(storeItem.get('Tooltip'));
                        }
                    }
                };
            };

            series.push(serie);
        };
        return series;
    }

    function getListeners(dataFromWcf, whatToShowValue) {
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
                    var endDate = item.record.data.endDate;
                    // console.log(item.record.data);
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

    function getTbar(whatToShowValue) {
        /* switch(whatToShowValue)
             case 'GetCompletedTypeAllocationOverTime':*/
        var tbar = {
            scrollable: true,
            items: []
        };

        //Chart type
        if (whatToShowValue != 'GetCompletedTypeAllocationOverTime') {
            var seriesTypeMenu = {
                xtype: 'button',
                text: 'Choose chart type',
                menu: {
                    items: [{
                        text: 'Line',
                        id: 'line',
                        checked: true,
                        group: 'chartType',
                        checkHandler: 'onChartTypeCheck'
                    }, {
                        text: 'Bar',
                        id: 'bar',
                        checked: false,
                        group: 'chartType',
                        checkHandler: 'onChartTypeCheck'
                    }, {
                        text: 'Pie',
                        id: 'pie',
                        checked: false,
                        group: 'chartType',
                        checkHandler: 'onChartTypeCheck'
                    }]

                }
            };
            tbar.items.push(seriesTypeMenu);
        };

        //Max results
        if (whatToShowValue != 'GetCompletedTypeAllocationOverTime' && whatToShowValue != 'GetTimeSpentPerJob') {
            var maxResultTextField = {
                xtype: 'textfield',
                fieldLabel: 'Max results',
                reference: 'maxResultTextField'//,
                //maxWidth: '100',
                //labelWidth: '40'
            };
            tbar.items.push(maxResultTextField);
            console.log(tbar.items);

        };

        //Time interval (Day, week, month)
        if (whatToShowValue === 'GetCompletedTypeAllocationOverTime') {
            var timeIntervalCombo = {
                xtype: 'menu',
                text: 'Time interval',
                items: [{
                    xtype: 'combo',
                    forceSelection: true,
                    emptyText: 'Select interval',
                    bodyPadding: 2,
                    store: intertalTypes,
                    displayField: 'show',
                    valueField: 'abbr',
                    reference: 'intervalCombo',
                    width: 200
                }]
            }
            tbar.items.push(timeIntervalCombo);
        }

        //Video ID
        if (whatToShowValue === 'GetHitsPerMilestone' || whatToShowValue === 'GetDropoutsPerMilestone') {
            var videoId = {
                xtype: 'combo',
                forceSelection: true,
                emptyText: 'Select video',
                bodyPadding: 2,
                store: videos,
                displayField: 'show',
                valueField: 'abbr',
                reference: 'videosCombo',
                width: 200
            }
            tbar.items.push(videoId);
        };

        //Job chain ID
        if (whatToShowValue === 'GetTimeSpentPerJob') {
            var jobChainId = {
                xtype: 'textfield',
                fieldLabel: 'Job chain ID',
                reference: 'jobChainIdTextField'
            }
            tbar.items.push(jobChainId);
        }

        //Save chart as image
        var saveChartButton = {
            xtype: 'button',
            text: 'Save chart to PNG',
            region: 'east',
            handler: function(btn) {
                btn.up('panel').download({
                    format: 'png'
                });
            }
        }
        tbar.items.push(saveChartButton);

        //Timespan
        var timeToChoose = {
            xtype: 'button',
            text: 'Select timespan',
            menu: {
                items: [{
                    text: 'Pick a timespan',
                    menu: {
                        items: {
                            xtype: 'combo',
                            forceSelection: true,
                            emptyText: 'Select date',
                            bodyPadding: 2,
                            store: datesForCombo,
                            displayField: 'show',
                            valueField: 'abbr',
                            reference: 'datesCombo',
                            width: 200
                        }
                    }
                }, '-', {
                    text: 'Choose start date',
                    menu: {
                        items: {
                            xtype: 'datepicker',
                            reference: 'startDatepicker',
                            maxDate: new Date(),
                            handler: function(picker, date) {
                                globalStartDate = new Date(date.setDate(date.getDate() + 1)).toJSON().split('T')[0];
                            }
                        }
                    }
                }, {
                    text: 'Choose end date',
                    menu: {
                        items: {
                            xtype: 'datepicker',
                            reference: 'endDatepicker',
                            maxDate: new Date(),
                            handler: function(picker, date) {
                                globalEndDate = new Date(date.setDate(date.getDate() + 1)).toJSON().split('T')[0];
                            }
                        }
                    }
                }]
            }
        }
        tbar.items.push(timeToChoose);

        //Remove
        var removeButton = {
            xtype: 'button',
            text: 'Remove',
            listeners: {
                click: 'removeButtonClick'
            }
        }
        tbar.items.push(removeButton);

        //Update
        var updateButton = {
            xtype: 'button',
            text: 'Update',
            handler: 'updateChart'
        }
        tbar.items.push(updateButton);

        return tbar;
    }
}




// handler: function() {
//     var me = this;
//     updateChart(me, 'pie');
// }
