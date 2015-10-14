Ext.define('RestTest.view.chartView.CartesianChartView', {
    extend: 'Ext.chart.CartesianChart',
	
    controller: 'chartview',
    height: 500,
    width: 900,
    interactions: 'crosszoom',
    style:'padding-bottom:10px;',
    plugins: {
        ptype: 'chartitemevents'
    },
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
    }
});
