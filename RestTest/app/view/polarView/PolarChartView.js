Ext.define('RestTest.view.polarChartView.PolarChartView', {
	extend: 'Ext.chart.PolarChart',

	interactions: ['rotate', 'itemhighlight'],
    height: 500,
    width: 900,
    style:'padding-bottom:10px;',
    legend:{
        docked: 'right',
        scrollable: true
    },
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