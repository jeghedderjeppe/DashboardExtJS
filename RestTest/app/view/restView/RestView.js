var showComboStore = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'Most viewed Assets',        'abbr': 'GetMostPopularAssets'},
		{'show': 'View sessions by browser',  'abbr': 'GetSessionsByBrowser'},
		{'show': 'View sessions by OS',       'abbr': 'GetSessionsByOS'},
		{'show': 'View sessions by country',  'abbr': 'GetSessionsByCountry'},
		{'show': 'View sessions by category', 'abbr': 'GetSessionsByDeviceCategory'},

		{'show': 'View Assets by most favorized', 'abbr': 'GetMostFavorizedDummy'},
		{'show': 'View Asset types by amount', 'abbr': 'GetAssetTypeAllocationDummy'}
	]
});

var showHow = Ext.create('Ext.data.Store',{
	fields: ['show', 'abbr'],
	data: [
		{'show': 'Line chart', 'abbr' : 'line'},
		{'show': 'Bar chart', 'abbr' : 'bar'}
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
		bodyPadding: 10,
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
			width: 200
		},{
			xtype: 'combo',
			forceSelection: true,
			emptyText:'Select graph',
			bodyPadding: 2,
			store: showHow,
			displayField: 'show',
			valueField: 'abbr',
			reference: 'howToShowCombo',
			width: 200
		}, {
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