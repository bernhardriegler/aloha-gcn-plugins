define([
	'aloha/core',
	'aloha/plugin',
	'gcn/gcn-plugin',
	'i18n!timemanagement/nls/i18n',
	'i18n!aloha/nls/i18n',
	'jquery',
	'css!timemanagement/css/timemanagement.css'
], function(Aloha,Plugin, GCNplugin, i18n, i18nCore, jQuery) {
	'use strict';

	
	
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
						You div contains: <span id="aloha-timemanagement-panel-effective-content"></span>\
					  </div>',
			onInit: function () {
				console.log("Init sidebar called");
			},
			onActivate: function(effective) {
				debugger;
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