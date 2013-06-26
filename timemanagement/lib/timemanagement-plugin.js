define([
	'aloha/core',
	'aloha/plugin',
	'gcn/gcn-plugin',
	'i18n!timemanagement/nls/i18n',
	'i18n!aloha/nls/i18n',
	'aloha/jquery',
	'timemanagement/./datetimepicker',
	'css!timemanagement/css/timemanagement.css'
], function(Aloha,Plugin, GCNplugin, i18n, i18nCore, $) {
	'use strict';
	
	var $cdateelement;
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
							<input type="text" id="aloha-timemanagement-cdate">\
						</fieldset>\
					  </div>',
			onInit: function () {
				$cdateelement = $('#aloha-timemanagement-cdate',this.element);
				$cdateelement.datetimepicker({
					dateFormat : 'dd.mm.yy',
					microsecMax: 999,
					onSelect:function(textDate, dateTimepicker){
						GCN.page(GCNplugin.page.id(), function(page){
							var d = $cdateelement.datetimepicker('getDate');
						});
					} 
				});
			},
			onActivate: function(effective) {
				GCN.page(GCNplugin.page.id(), function(page){
					var timemanagement = page.prop('timeManagement');
					var cdate = page.prop('cdate');
					$('#aloha-timemanagement-cdate').datetimepicker('setDate', new Date(cdate * 1000));
				});
				this.content.find('#aloha-timemanagement-panel-effective-content').html($(effective).html());
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