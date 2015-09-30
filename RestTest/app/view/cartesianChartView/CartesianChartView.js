Ext.define('RestTest.view.cartesianChartView.CartesianChartView', {
	extend: 'Ext.chart.CartesianChart',
	
    height: 500,
    width: 900,
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
            btn.up('panel').download({
                format: 'png'
            });
        }
    }
});