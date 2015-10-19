var globalStartDate, globalEndDate, isCustomDate = false;
var me;
var panelDict = [];
var position = 0;
Ext.define('RestTest.view.restView.RestViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restview',
    controller: 'chartview',

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
        'Ext.chart.series.Bar',
        'RestTest.view.chartView.ChartViewController'
    ],
    checkboxHandler: function (checkbox, checked) {
        // var startDatepicker = this.lookupReference('startDatepicker');
        // var endDatepicker = this.lookupReference('endDatepicker');
        // var dateCombo = this.lookupReference('datesCombo');
        // dateCombo.setHidden(checked);
        // startDatepicker.setVisible(checked);
        // endDatepicker.setVisible(checked);
        // isCustomDate = checked;
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

        // var datesChosen = this.lookupReference('datesCombo');
        
        // var whatToShowCombo = this.lookupReference('whatToShowCombo');
        // var howToShowCombo = this.lookupReference('howToShowCombo');
        // var maxResult = this.lookupReference('maxResultTextField').getValue();
        // var videoToShowStats = this.lookupReference('videosCombo').getValue();
        
        var whatToShowValue = this.lookupReference('whatToShowCombo').getValue();
        // var howToShowValue = howToShowCombo.getValue();
        // // var chosenDay = datesChosen.getValue();
        
        // var startDate, endDate;
        // if (isCustomDate) {
        //     startDate = globalStartDate;
        //     endDate = globalEndDate;
        // } else {
        //     startDate = getDatetime(chosenDay);
        //     endDate = new Date().toJSON().split('T')[0];
        // };
        // if (!maxResult) {
        //     maxResult = 25;
        // };
        // if (howToShowValue === 'null' || !howToShowValue) {
        //     howToShowValue = 'line';
        // };

        //var parameters = 'parameters=maxResult='+maxResult;//+'|startDate='+startDate+"|endDate="+endDate+'|seriesType='+howToShowValue;
        var label = function(v) { return v };

        // switch (whatToShowValue) {
        //     case 'GetHitsPerMilestone':
        //         parameters += '|itemId=' + videoToShowStats;
        //         break;
        //     case 'GetDropoutsPerMilestone':
        //         parameters += '|itemId=' + videoToShowStats;
        //         break;
        //     case 'GetDropoutsPercentForAllVideos':
        //         label = function(v) { return v + '%'; };
        //         parameters += '|itemId=' + videoToShowStats;
        //         break;
        //      case 'GetTimeSpentPerJob':
        //         parameters += '|jobChainId=' + this.lookupReference('jobChainIdTextField').getValue();;
        //         break;
        //     case 'GetCompletedTypeAllocationOverTime':
        //         parameters += ' |intervalType='+this.lookupReference('intervalCombo').getValue();
        //         break;
        //     default:
        //         yAxisName = 'Error';
        //         xAxisName = 'Error';
        //         title = 'Error';
        // }
        // console.log(parameters + "  " + whatToShowValue);
        addChartToPanel(whatToShowValue);
       
    }
});