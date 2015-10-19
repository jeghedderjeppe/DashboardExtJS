var globalStartDate, globalEndDate, isCustomDate = false;
var me;
var panelDict = [];
var position = 0;
Ext.define('RestTest.view.restView.RestViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restview',
    controller: 'chartview',

   requires: [
        
        'RestTest.view.chartView.ChartViewController'
    ],

    onShowButtonClick: function() {
        me = this;
        var whatToShowValue = this.lookupReference('whatToShowCombo').getValue();
        // var label = function(v) {
        //     return v
        // };

        var parameters;
        var JobChainIdTextfield = this.lookupReference('JobChainIdTextfield')
        var itemIdTextfield = this.lookupReference('itemIdTextfield')
        if (JobChainIdTextfield) {
            parameters = 'parameters=jobChainId=' + JobChainIdTextfield.getValue();

        } else if (itemIdTextfield) {
            parameters = 'parameters=itemId=' + itemIdTextfield.getValue();        
        };
        addChartToPanel(whatToShowValue, parameters); //whatToShowValue, parameters, position

        var inputPanel = this.lookupReference('inputPanel');
        if (inputPanel.items.items.length === 3) {
            inputPanel.items.items[1].destroy();
            inputPanel.down('button').setDisabled(false);
        }
    },

    selectHandler: function(combo, record, eOpts) {
        var inputPanel = this.lookupReference('inputPanel');
        var showStatsButton = inputPanel.down('button');

        var comboValue = combo.getValue();
        if (comboValue === 'GetTimeSpentPerJob') {
            inputPanel.insert(1, Ext.create('Ext.form.field.Text', {
                emptyText: 'Job Chain ID',
                reference: 'JobChainIdTextfield',
                listeners: {
                    change: function(this2, newValue2, oldValue2, eOpts2) {
                        if (parseInt(newValue2) > 0)
                            showStatsButton.setDisabled(false);
                        else
                            showStatsButton.setDisabled(true);
                    }
                }
            }));
            showStatsButton.setDisabled(true);
        } else if (comboValue === 'GetHitsPerMilestone' || comboValue === 'GetDropoutsPerMilestone') {
            inputPanel.insert(1, Ext.create('Ext.form.field.Text', {
                emptyText: 'Item ID',
                reference: 'itemIdTextfield',
                listeners: {
                    change: function(this2, newValue2, oldValue2, eOpts2) {
                        if (parseInt(newValue2) > 0)
                            showStatsButton.setDisabled(false);
                        else
                            showStatsButton.setDisabled(true);
                    }
                }
            }));
        } else {
            if (inputPanel.items.items.length === 3) {
                inputPanel.items.items[1].destroy();
                showStatsButton.setDisabled(false);
            }
        }
    }
});

/*function getDatetime(valueFromDatesCombo) {
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
        */
/*        switch (whatToShowValue) {
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
console.log(parameters + "  " + whatToShowValue);*/

/*        var howToShowValue = howToShowCombo.getValue();
// var chosenDay = datesChosen.getValue();

var parameters = 'parameters=maxResult='+maxResult;//+'|startDate='+startDate+"|endDate="+endDate+'|seriesType='+howToShowValue;*/
