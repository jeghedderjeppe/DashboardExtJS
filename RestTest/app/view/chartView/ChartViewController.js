Ext.define('RestTest.view.chartView.ChartViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.chartview',
     requires: [
        'Ext.chart.interactions.Rotate',
        'Ext.chart.series.Pie',
        'Ext.chart.series.Area',
        'Ext.chart.interactions.CrossZoom',
        'Ext.chart.interactions.Crosshair',
        'Ext.chart.interactions.ItemHighlight',
        'RestTest.view.chartView.CartesianChartView',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Ext.chart.series.Bar'
    ],
   
    serializeParams: function(params) {
        var paramsSerialized = 'parameters=';
        for (var i in params) 
            paramsSerialized += i +'='+params[i]+'|';

        paramsSerialized = paramsSerialized.substring(0, paramsSerialized.length - 1);
        return paramsSerialized;
    },

    removeButtonClick: function(button) {
        var chart = this.getChart(button);
        chart.destroy();
    },



    addedStartDate: function(datepicker, container, pos, eOpts){
        var date = new Date();
        date.setMonth(date.getMonth() - 1);
        datepicker.setValue(new Date(date));
    },

    chartTypeMenucheckItemClick: function(menu, item, e, eOpts){
        var chart = this.getChart(menu);
        var panel = chart.up('panel');
        var items = panel.items.items;
        var itemsArray = [];
        for (var i in items) 
            itemsArray.push(items[i].id);
        var positionInPanel = itemsArray.indexOf(chart.id); //Kunne gøres bedre
        var parameters = parseParamsToArray(chart.parameters)
        parameters['seriesType'] = item.seriesType;
        parameters = this.serializeParams(parameters);
        addChartToPanel(chart.method, parameters, positionInPanel, chart);
    },

    timespanMenucheckItemClick: function(menu, item, e, eOpts){
        chosenTimePeriod = item.abbr;
        var startDate = getDatetime(chosenTimePeriod);
        var endDate = new Date();
        this.lookupReference('startDatepicker').setValue(startDate);
        this.lookupReference('endDatepicker').setValue(endDate);
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
            return new Date(date);
        }

        var chart = this.getChart(item);
        var keyValues = { 
            'startDate': startDate.toJSON(), 
            'endDate':endDate.toJSON()
        };
        this.ajaxUpdate(chart, keyValues); //this.ajaxUpdate(chart, method, parameters);      
    },

    dataGranularityMenuItemClick: function(menu, item, e, eOpts) {
        var chart = this.getChart(menu);
        var panel = chart.up('panel');
        var panelItems = panel.items.items;
        var positionInPanel;
        for (var i; i<panelItems.length; i++){
            if (panelItems[i].id == chart.id) {
                positionInPanel = i;
                break;
            }
        }
        var parameters = parseParamsToArray(chart.parameters)
        parameters['intervalType'] = item.interval;
        parameters = this.serializeParams(parameters);
        addChartToPanel(chart.method, parameters, positionInPanel, chart);
    },

    startDateSelected: function(datepicker, selectedDate, eOpts){
        var chart = this.getChart(datepicker);
        var keyValues = { 'startDate': selectedDate.toJSON() };
        this.ajaxUpdate(chart, keyValues);
    },
    
    endDateSelected: function(datepicker, selectedDate, eOpts){
        var chart = this.getChart(datepicker);
        var keyValues = { 'endDate': selectedDate.toJSON() };
        this.ajaxUpdate(chart, keyValues);

        var startDatepicker = this.lookupReference('startDatepicker');
        startDatepicker.maxDate = new Date(selectedDate);
        startDateValue = startDatepicker.getValue();
        if (startDateValue > selectedDate) 
            startDatepicker.setValue(selectedDate);
    },

    maxResultChange: function(textfield, newValue, oldValue, eOpts) {
        var chart = this.getChart(textfield);
        var keyValues = { 'maxResult': newValue };
        this.ajaxUpdate(chart, keyValues);
    },

    getChart: function(component){
        var chart = component.up('cartesian');
        if (chart == undefined) 
            chart = component.up('polar');
        return chart;
    },

    ajaxUpdate: function(chart, keyValues) {
        var method = chart.method;

        var parameters = parseParamsToArray(chart.parameters);
        for(var keyValue in keyValues)
            parameters[keyValue] = keyValues[keyValue];      
        parameters = this.serializeParams(parameters);

        Ext.Ajax.request({
            url: 'http://localhost:49879/SendStatistics.svc/rest/getrequest?method=' + method + '&' + parameters, //getpageviewsbybrowser
            method: 'GET',
            disableCaching: true,
            headers: {
                accept: 'application/json; charset=utf-8'
            },
            useDefaultXhrHeader: false,
            success: function(response) {
                var dataFromWcf = Ext.JSON.decode(response.responseText);
                if (method === 'GetCompletedTypeAllocationOverTime')
                    dataFromWcf.KeyValues = Ext.JSON.decode(dataFromWcf.KeyValues[0]);
                chart.setStore(Ext.create('Ext.data.Store', {
                    data: dataFromWcf.KeyValues
                }));
                chart.redraw();
                chart.parameters = parameters;
            },
            failure: function(response) {
                Ext.Msg.Alert(parameters + " is not valid input");
            }
        });
    }
});

function parseParamsToArray(parameters) {
    parameters = parameters.replace('parameters=', '');
    var parametersArray = parameters.split('|');
    var paramsObj = {};
    for (var i in parametersArray) {
        var parameterKeyValue = parametersArray[i].split('=');
        paramsObj[parameterKeyValue[0]] = parameterKeyValue[1];
    }    
    return paramsObj;
};
var firstChart;
var groupCounter = 0;
function addChartToPanel(whatToShowValue, parameters, position, chartToBeDestroyed) {
    var panel = me.lookupReference('outputPanel');
    if (typeof position === "undefined") {
        position = 0;
    };

    if (!parameters) {
        var startDate = new Date().setMonth(new Date().getMonth() - 1);
        var endDate = new Date().setDate(new Date().getDate());

        parameters = 'parameters=' +
            'seriesType=line' +
            '|maxResult=' + 999 +
            '|startDate=' + new Date(startDate).toJSON()+
            '|endDate=' + new Date(endDate).toJSON()+
            '|jobChainId=' + 50974 +
            '|itemId=' + 132 +
            '|intervalType=' + 'month';
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
                if (typeof dataFromWcf.KeyValues[0] === 'string') 
                    dataFromWcf.KeyValues = Ext.JSON.decode(dataFromWcf.KeyValues[0]);
            } catch (e) {
                Ext.Msg.alert('Alert!', responseText);
            }
            console.log(groupCounter, dataFromWcf);
            var store = Ext.create('Ext.data.Store', {
                data: dataFromWcf.KeyValues
            });
            if (parameters !== undefined) 
                parsedParameters = parseParamsToArray(parameters);
            var axes = getAxis(dataFromWcf);
            var series = getSeries(dataFromWcf);
            var listeners = getListeners(dataFromWcf, whatToShowValue);
            var toolbar = getTbar(whatToShowValue, parsedParameters);

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

            firstChart = chart;
            panel.insert(position, chart);
            if (chartToBeDestroyed) 
                chartToBeDestroyed.destroy();
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

    function getTbar(whatToShowValue, parameters) {
        var maxResult   = parameters['maxResult'], 
        startDate       = parameters['startDate'], 
        endDate         = parameters['endDate'], 
        seriesType      = parameters['seriesType'],  
        jobChainId      = parameters['jobChainId'], 
        intervalType    = parameters['intervalType'], 
        itemId          = parameters['itemId'];

        var tbar = {
            text: 'Filters',
            xtype: 'button',
            ctCls: 'x-btn-over',
            scrollable: true,
            menu: {
                items: []
            }
        };

        var returnTbar = {

            items: ['->',tbar]
        };

        //Chart type
        if (whatToShowValue != 'GetCompletedTypeAllocationOverTime') {
            var seriesTypeMenu = {
                xtype: 'button',
                text: 'Choose chart type',
                menu: {
                    reference: 'chartTypeMenu',
                    items: [{
                        text: 'Line',
                        seriesType: 'line',
                        checked: false,
                        group: 'chartType' + groupCounter
                    }, {
                        text: 'Bar',
                        seriesType: 'bar',
                        checked: false,
                        group: 'chartType' + groupCounter
                    }, {
                        text: 'Pie',
                        seriesType: 'pie',
                        checked: false,
                        group: 'chartType' + groupCounter
                    }],
                    listeners: {
                        click: 'chartTypeMenucheckItemClick'
                    }

                }
            };
            groupCounter++;
            for (var i = 0; i < seriesTypeMenu.menu.items.length; i++) {
                if (seriesTypeMenu.menu.items[i].seriesType == seriesType) {
                    seriesTypeMenu.menu.items[i].checked = true;
                    break;
                };
            };
            returnTbar.items.push(seriesTypeMenu);
        };

        //Max results
        if (whatToShowValue != 'GetCompletedTypeAllocationOverTime' && whatToShowValue != 'GetTimeSpentPerJob') {
            var maxResultTextField = {
                xtype: 'textfield',
                fieldLabel: 'Max results',
                reference: 'maxResultTextField',
                value: maxResult,
                maskRe: /[0-9.]/,
                listeners: {
                    change: 'maxResultChange'
                }
            };
            tbar.menu.items.push(maxResultTextField);
        };

        //Time interval (Day, week, month)
        if (whatToShowValue === 'GetCompletedTypeAllocationOverTime') {
            var timeIntervalCombo = {
                xtype: 'button',
                text: 'Data granularity',
                menu: {
                    reference: 'intervalMenu',
                    items: [{
                        text: 'Day',
                        interval: 'day',
                        checked: false,
                        group: 'interval' + groupCounter
                    }, {
                        text: 'Week',
                        interval: 'week',
                        checked: false,
                        group: 'interval' + groupCounter
                    }, {
                        text: 'Month',
                        interval: 'month',
                        checked: false,
                        group: 'interval' + groupCounter
                    }], listeners:{
                        click: 'dataGranularityMenuItemClick'
                    }
                }
            }
            groupCounter++;
            for (var i = 0; i < timeIntervalCombo.menu.items.length; i++) {
                if (timeIntervalCombo.menu.items[i].interval == parameters['intervalType']) {
                    timeIntervalCombo.menu.items[i].checked = true;
                    break;
                };
            };
            tbar.menu.items.push(timeIntervalCombo);
        }

        //Item ID
        if (whatToShowValue === 'GetHitsPerMilestone' || whatToShowValue === 'GetDropoutsPerMilestone') {
            var ItemIdAlt = {
                xtype: 'textfield',
                fieldLabel: 'Item ID',
                reference: 'itemIdTextField',
                value: itemId
            }
            tbar.menu.items.push(ItemIdAlt);
        };

        // //Job chain ID
        // if (whatToShowValue === 'GetTimeSpentPerJob') {
        //     var jobChainIdTextField = {
        //         xtype: 'textfield',
        //         fieldLabel: 'Job chain ID',
        //         reference: 'jobChainIdTextField',
        //         value: jobChainId
        //     }
        //     tbar.items.push(jobChainIdTextField);
        // }
        var datesForTimespanArray = [
            ['Today',       'zeroDay'    ],
            ['Yesterday',   'oneDay'     ],
            ['3 Days',      'threeDay'   ],
            ['1 week',      'oneWeek'    ],
            ['2 weeks',     'twoWeek'    ],
            ['3 weeks',     'threeWeek'  ],
            ['4 weeks',     'fourWeek'   ],
            ['1 month',     'oneMonth'   ],
            ['2 month',     'twoMonth'   ],
            
            ['3 month',     'threeMonth' ],
            ['4 month',     'fourMonth'  ]
        ];

        var checklistItemsForTimespan = [];
        for (var i = 0; i < datesForTimespanArray.length; i++) {
            var item = {
                xtype: 'menucheckitem',
                text: datesForTimespanArray[i][0],
                abbr: datesForTimespanArray[i][1],
                checked: false,
                group: 'datesPeriodSelection' + groupCounter
            }
            checklistItemsForTimespan.push(item);
        };

        //Timespan
        if (whatToShowValue !== 'GetTimeSpentPerJob') {
            var timeToChoose = {
                xtype: 'button',
                text: 'Select timespan',
                menu: {
                    items: [{
                        text: 'Pick a timespan',
                        menu: { 
                            items: checklistItemsForTimespan,
                            listeners: {
                                click: 'timespanMenucheckItemClick'
                            }
                        }
                    }, '-', {
                        text: 'Choose start date',
                        menu: {
                            items: {
                                xtype: 'datepicker',
                                reference: 'startDatepicker',
                                maxDate: new Date(),
                                listeners: {
                                    added: function(datepicker, container, pos, eOpts){
                                        datepicker.setValue(new Date(parameters['startDate']));
                                    }
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
                                listeners: {
                                    added: function(datepicker, container, pos, eOpts){
                                        datepicker.setValue(new Date(parameters['endDate']));
                                        datepicker.up();
                                    },
                                    select: 'endDateSelected'
                                }
                            }
                        }
                    }]
                }
            }
            tbar.menu.items.push(timeToChoose);
        };


        //Remove
        // var removeButton = {
        //     xtype: 'button',
        //     text: 'Remove',
        //     listeners: {
        //         click: 'removeButtonClick'
        //     }
        // }
        // tbar.menu.items.push(removeButton);

        //Save chart as image
        var saveChartButton = {
            xtype: 'button',
            text: 'Downloadable version',
            region: 'east',
            handler: function(btn) {
                btn.up().up().preview();
            }
        }
        returnTbar.items.push(saveChartButton);

  
        return returnTbar;
    }
}

// xtype: 'combo',
                        // forceSelection: true,
                        // emptyText: 'Select interval',
                        // bodyPadding: 2,
                        // store: intertalTypes,
                        // displayField: 'show',
                        // valueField: 'abbr',
                        // reference: 'intervalCombo',
                        // width: 200

      //Update
        // var updateButton = {
        //     xtype: 'button',
        //     text: 'Update',
        //     handler: 'updateChart'
        // }
        // returnTbar.items.push(updateButton);

 // updateChart: function(button) {
    //     var chart = this.getChart(button);

    //     //Set Max Result
    //     var maxResultTextField = this.lookupReference('maxResultTextField');
    //     var maxResult;
    //     if (maxResultTextField == null)
    //         maxResult = 999;
    //     else
    //         maxResult = maxResultTextField.getValue();

    //     //Set Job Chain Id
    //     var jobChainIdTextField = this.lookupReference('jobChainIdTextField');
    //     var jobChainId;
    //     if (jobChainIdTextField == null)
    //         jobChainId = 50974;
    //     else
    //         jobChainId = jobChainIdTextField.getValue();

    //     //Set ItemId
    //     var itemIdTextField = this.lookupReference('itemIdTextField');
    //     var itemId;
    //     if (itemIdTextField == null)
    //         itemId = 50974;
    //     else
    //         itemId = itemIdTextField.getValue();
        
    //     //Set seriesType
    //     var chosenSeriesType = 'line';
    //     chartTypeMenu = this.lookupReference('chartTypeMenu');
    //     if (chartTypeMenu != null) {
    //         var chartTypeButtons = chartTypeMenu.items.items;
    //         for (var i = 0; i < chartTypeButtons.length; i++)
    //             if (chartTypeButtons[i].checked === true)
    //                 chosenSeriesType = chartTypeButtons[i].seriesType;
    //     };

    //     //Set Interval
    //     var chosenInterval = 'month';
    //     intervalMenu = this.lookupReference('intervalMenu');
    //     if (intervalMenu != null) {
    //         var intervalButtons = intervalMenu.items.items;
    //         for (var i = 0; i < intervalButtons.length; i++)
    //             if (intervalButtons[i].checked === true)
    //                 chosenInterval = intervalButtons[i].interval;
    //     };

    //     //Add to parameters
    //     var parameters = chart.parameters;
    //     parameters = parseParamsToArray(chart.parameters);
    //     parameters['seriesType'] = chosenSeriesType;
    //     if (parseInt(maxResult) > 0)
    //         parameters['maxResult'] = maxResult;
    //     parameters['intervalType'] = chosenInterval;

    //     var startDateComponent = this.lookupReference('startDatepicker');
    //     var endDateComponent = this.lookupReference('endDatepicker');
    //     if (startDateComponent != null || endDateComponent != null) {
    //         parameters['startDate'] = startDateComponent.getValue().toJSON();
    //         parameters['endDate'] = endDateComponent.getValue().toJSON();
    //     };

    //     if (parseInt(jobChainId) > 0)
    //         parameters['jobChainId'] = jobChainId;
    //     if (parseInt(itemId) > 0)
    //         parameters['itemId'] = itemId;

    //     parameters = this.serializeParams(parameters);

    //     var panel = chart.up('panel');
    //     var items = panel.items.items;
    //     var itemsArray = [];
    //     for (var i in items) 
    //         itemsArray.push(items[i].id);
    //     var positionInPanel = itemsArray.indexOf(chart.id); //Kunne gøres bedre
    //     addChartToPanel(chart.method, parameters, positionInPanel, chart);
    // },
