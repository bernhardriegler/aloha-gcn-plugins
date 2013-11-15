define([
	'aloha/core',
	'aloha/plugin',
	'gcn/gcn-plugin',
	'i18n!timemanagement/nls/i18n',
	'i18n!aloha/nls/i18n',
	'aloha/jquery',
	'timemanagement/./datetimepicker',
	'css!timemanagement/css/timemanagement.css'
], function(Aloha,Plugin, GCNPlugin, i18n, i18nCore, $) {
	'use strict';
	
	var $cdateelement;
	var $fromelement;
	var $toelement;
	/**
	 * We want to use the sidebar too
	 * Have a look at http://www.aloha-editor.org/guides/sidebar.html
	 */
	function prepareSidebar(sidebar) {
		sidebar.addPanel({
			id: 'aloha-timemanagement-panel',
			title: i18n.t( 'sidebar.timemanagement.title' ),
			expanded: true,
			activeOn: true,
			content: '<div id="aloha-timemanagement-panel-content">\
						<fieldset>\
							<label for="aloha-timemanagement-cdate">'+i18n.t( 'sidebar.timemanagement.label.cdate' )+'</label>\
							<input type="text" id="aloha-timemanagement-cdate"/>\
							<label for="aloha-timemanagement-from">'+i18n.t( 'sidebar.timemanagement.label.from' )+'</label>\
							<input type="text" id="aloha-timemanagement-from"/>\
							<label for="aloha-timemanagement-to">'+i18n.t( 'sidebar.timemanagement.label.to' )+'</label>\
							<input type="text" id="aloha-timemanagement-to"/>\
						</fieldset>\
					  </div>',
			onInit: function () {
				//INIT CDATE
				$cdateelement = $('#aloha-timemanagement-cdate',this.element);
				$cdateelement.datetimepicker({
					dateFormat : 'dd.mm.yy',
					microsecMax: 999,
					firstDay: 1
				});
				$cdateelement.on('change', function(){
					var elem = this;
					GCN.page(GCNPlugin.page.id(), function(page){
						var cdate = 0;
						if ($(elem).val() != "") {
							var d = $cdateelement.datetimepicker('getDate');
							cdate = d.getTime() / 1000;
						}						
						page.prop('cdate', cdate);
					});
				});

				//INIT FROM DATE
				$fromelement = $('#aloha-timemanagement-from',this.element);
				$fromelement.datetimepicker({
					dateFormat : 'dd.mm.yy',
					microsecMax: 999,
					firstDay: 1
				});
				$fromelement.on('change', function(){
					var elem = this;
					GCN.page(GCNPlugin.page.id(), function(page){
						var time = 0;
						var timemanagement = GCNPlugin.page.prop('timeManagement');
						if ($(elem).val() != "") {
							var d = $fromelement.datetimepicker('getDate');
							time = d.getTime() / 1000;
						}
						if(typeof timemanagement !== 'undefined') {
							timemanagement.start = time;
							page.prop('timeManagement', timemanagement);
						}
					});
				});
				//INIT TO DATE
				$toelement = $('#aloha-timemanagement-to',this.element);
				$toelement.datetimepicker({
					dateFormat : 'dd.mm.yy',
					microsecMax: 999,
					firstDay: 1
				});
				$toelement.on('change', function(){
					var elem = this;
					GCN.page(GCNPlugin.page.id(), function(page){
						var time = 0;
						var timemanagement = page.prop('timeManagement');
						if ($(elem).val() != "") {
							var d = $toelement.datetimepicker('getDate');
							time = d.getTime() / 1000;
						}
						if(typeof timemanagement !== 'undefined') {
							timemanagement.end = time;
							page.prop('timeManagement', timemanagement);
						}
					});
				});
				//INIT VALUES
				GCN.page(GCNPlugin.page.id(), function(page){
					var timemanagement = page.prop('timeManagement');
					var cdate = page.prop('cdate');
					if (cdate > 0) {
						$cdateelement.datetimepicker('setDate', new Date(cdate * 1000));
					}
					if (timemanagement.start > 0) {
						$fromelement.datetimepicker('setDate', new Date(timemanagement.start * 1000));
					}
					if (timemanagement.end > 0) {
						$toelement.datetimepicker('setDate', new Date(timemanagement.end * 1000));
					}
				});
			}
		});
		sidebar.show();
	}

	/**
	 * We create and return the plugin.
	 */
    return Plugin.create('timemanagement', {
		
		/**
		 * Configure the available languages
		 */
		languages: ['en', 'de'],

		/**
		 * Initialize the plugin
		 */
		init: function () {
			prepareSidebar(Aloha.Sidebar.right);
		}
	});
});