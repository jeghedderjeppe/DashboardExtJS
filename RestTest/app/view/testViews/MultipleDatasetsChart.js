Ext.define('RestTest.view.testViews.MultipleDatasetsChart', {
	extend: 'Ext.chart.CartesianChart',

	xtype: 'jeppes-multi-chart',

	requires: [
		'Ext.chart.interactions.ItemHighlight'
	],

	title: 'Multi Chart test',
	width: 800,
	height: 400,
	padding: 10,
	animate: true,
	insetPadding: 10,

	store: {
	        fields: ['pet', 'households', 'total'],
	        data: [
	            {pet: 'Cats', households: 38, total: 93},
	            {pet: 'Dogs', households: 45, total: 79},
	            {pet: 'Fish', households: 13, total: 171}
	        ]
	    },
	    axes: [{
    	title: 'lol stuff',
        type: 'numeric',
        position: 'left',
        fields: ['households', 'total']
    }, {
    	title: 'lol 2',
        type: 'category',
        position: 'bottom',
        fields: ['pet']
    }],
    series: [{
        type: 'line',
        xField: 'pet',
        yField: ['households', 'total'],
        listeners: {
            itemmousemove: function (series, item, event) {
                console.log('itemmousemove', item.category, item.field);
            }
        }
    },{
        type: 'line',
        xField: 'pet',
        yField: 'total',
        marker: true
    }]
});
