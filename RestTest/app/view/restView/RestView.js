var showComboStore = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'GetMostPopularAssets',				'abbr': 'GetMostPopularAssets'},
		{'show': 'GetSessionsByBrowser',				'abbr': 'GetSessionsByBrowser'},
		{'show': 'GetSessionsByOS',						'abbr': 'GetSessionsByOS'},
		{'show': 'GetSessionsByCountry',				'abbr': 'GetSessionsByCountry'},
		{'show': 'GetSessionsByDeviceCategory',         'abbr': 'GetSessionsByDeviceCategory'},

		{'show': 'GetMostFavorizedDummy',				'abbr': 'GetMostFavorizedDummy'},
		{'show': 'GetAssetTypeAllocationDummy',			'abbr': 'GetAssetTypeAllocationDummy'},

		{'show': 'GetHitsPerMilestone',					'abbr': 'GetHitsPerMilestone'},
		{'show': 'GetDropoutsPerMilestone',				'abbr': 'GetDropoutsPerMilestone'},
		{'show': 'GetPercentageFinishedForAllVideos',	'abbr': 'GetPercentageFinishedForAllVideos'},
		{'show': 'GetDropoutsPercentForAllVideos',		'abbr': 'GetDropoutsPercentForAllVideos'},
		
		{'show': 'GetJobChainsByLongestCompletionTime', 'abbr': 'GetJobChainsByLongestCompletionTime'},
		{'show': 'GetFailedJobChains',                  'abbr': 'GetFailedJobChains'},
		{'show': 'GetTimeSpentPerJob',                  'abbr': 'GetTimeSpentPerJob'},
		{'show': 'GetFailedJobTypeAllocation',			'abbr': 'GetFailedJobTypeAllocation'},
		{'show': 'GetAverageJobTimePerBatchServer',     'abbr': 'GetAverageJobTimePerBatchServer'},
		{'show': 'GetAmountStartedForAllVideos',        'abbr': 'GetAmountStartedForAllVideos'},
		{'show': 'GetCompletedTypeAllocationOverTime',  'abbr': 'GetCompletedTypeAllocationOverTime'}

/*				{'show': 'Most viewed Assets',                  'abbr': 'GetMostPopularAssets'},
		{'show': 'View sessions by browser',            'abbr': 'GetSessionsByBrowser'},
		{'show': 'View sessions by OS',                 'abbr': 'GetSessionsByOS'},
		{'show': 'View sessions by country',            'abbr': 'GetSessionsByCountry'},
		{'show': 'View sessions by category',           'abbr': 'GetSessionsByDeviceCategory'},
		{'show': 'View Assets by most favorized',       'abbr': 'GetMostFavorizedDummy'},
		{'show': 'View Asset types by amount',          'abbr': 'GetAssetTypeAllocationDummy'},
		{'show': 'View hits per milestone',             'abbr': 'GetHitsPerMilestone'},
		{'show': 'Dropouts per milestone',              'abbr': 'GetDropoutsPerMilestone'},
		{'show': 'Percentage finished for all videos',  'abbr': 'GetPercentageFinishedForAllVideos'},
		{'show': 'Average percent watched',             'abbr': 'GetDropoutsPercentForAllVideos'},
		{'show': 'GetJobChainsByLongestCompletionTime', 'abbr': 'GetJobChainsByLongestCompletionTime'},
		{'show': 'GetFailedJobChains',                  'abbr': 'GetFailedJobChains'},
		{'show': 'GetTimeSpentPerJob',                  'abbr': 'GetTimeSpentPerJob'},
		{'show': 'Failed Job Allocation',               'abbr': 'GetFailedJobTypeAllocation'},
		{'show': 'GetAverageJobTimePerBatchServer',     'abbr': 'GetAverageJobTimePerBatchServer'},
		{'show': 'GetAmountStartedForAllVideos',        'abbr': 'GetAmountStartedForAllVideos'},
		{'show': 'GetCompletedTypeAllocationOverTime',  'abbr': 'GetCompletedTypeAllocationOverTime'}*/
	]
});

var datesForCombo = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'Today',     	'abbr' : 'zeroDay'},
		{'show': 'Yesterday', 	'abbr' : 'oneDay'},
		{'show': '3 Days', 		'abbr' : 'threeDay'},
		{'show': '1 week', 		'abbr' : 'oneWeek'},
		{'show': '2 weeks', 	'abbr' : 'twoWeek'},
		{'show': '3 weeks', 	'abbr' : 'threeWeek'},
		{'show': '4 weeks', 	'abbr' : 'fourWeek'},
		{'show': '1 month', 	'abbr' : 'oneMonth'},
		{'show': '2 month', 	'abbr' : 'twoMonth'},
		{'show': '3 month', 	'abbr' : 'threeMonth'},
		{'show': '4 month', 	'abbr' : 'fourMonth'}
	]
});

var showHow = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'Line chart', 'abbr' : 'line'},
		{'show': 'Bar chart', 'abbr' : 'bar'},
		{'show': 'Pie chart', 'abbr' : 'pie'}
	]
});

var intertalTypes = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'Day', 'abbr' : 'day'},
		{'show': 'Week', 'abbr': 'week'},
		{'show': 'Month', 'abbr' : 'month'}
	]
});

var videos = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'Klint', 'abbr' : 128},
		{'show': 'Bike Ferry', 'abbr': 129},
		{'show': 'Food Stuff', 'abbr': 116}
	]
});

Ext.define("RestTest.view.restView.RestView", {
	extend: 'Ext.container.Viewport',
	
	requiers:[
		'RestTest.view.restview.RestViewController'
	],

	controller: 'restview',

	layout: {
		type: 'vbox',
		align: 'stretch',
		flex: 1
	},
	autoScroll:true,
	scrollable:true,
	items: [{
		xtype:'panel',
		reference: 'inputPanel',
		bodyPadding: 10,
		autoScroll: true,
		scrollable: true,
		defaults: {
			style:'padding-left:10px;'
		},
		layout: {
			type: 'hbox'
		},
		items: [{
			xtype: 'combo',
			forceSelection: true,
			emptyText:'Select data',
			bodyPadding: 2,
			store: showComboStore,
			displayField: 'show',
			valueField: 'abbr',
			reference: 'whatToShowCombo',
			width: 200,
			listeners:{
			    select: 'selectHandler'
			}
		},{
			xtype: 'button',
			text: 'Show stats',
			listeners:{
				click: 'onShowButtonClick'
			}
		}]
	},{
		xtype: 'panel',
		reference: 'outputPanel',
		width: 800,
		layout: {
			type: 'table',
			columns: 2,
			tableAttrs:{
				style: {
					width: '100%'
				}
			}
		}		
	}]
});

