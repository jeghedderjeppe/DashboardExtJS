Ext.define('RestTest.view.chartView.PolarChartView', {
    extend: 'Ext.chart.PolarChart',

    controller: 'chartview',
    interactions: ['rotate', 'itemhighlight'],
    height: 500,
    width: 900,
    style: 'padding-bottom:10px;',
    plugins: {
        ptype: 'chartitemevents'
    },
    legend: {
        docked: 'right',
        scrollable: true
    }
});
