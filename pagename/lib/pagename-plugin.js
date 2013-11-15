define([
	'aloha/core',
	'aloha/plugin',
	'gcn/gcn-plugin',
	'i18n!pagename/nls/i18n',
	'i18n!aloha/nls/i18n',
	'aloha/jquery',
	'css!pagename/css/pagename.css'
], function(Aloha,Plugin, GCNPlugin, i18n, i18nCore, $) {
	'use strict';
	
	var $nameelement;
	
	
	/**
	 * We want to use the sidebar too
	 * Have a look at http://www.aloha-editor.org/guides/sidebar.html
	 */
	function prepareSidebar(sidebar) {
		sidebar.addPanel({
			id: 'aloha-pagename-panel',
			title: i18n.t( 'sidebar.pagename.title' ),
			expanded: true,
			activeOn: true,
			content: '<div id="aloha-pagename-panel-content">\
						<fieldset>\
							<label for="aloha-pagetitle-name">'+i18n.t( 'sidebar.pagename.label' )+'</label>\
							<input type="text" id="aloha-pagetitle-name" />\
						</fieldset>\
					  </div>',
			onInit: function () {
		
				//INIT PAGENAME
				$nameelement = $('#aloha-pagetitle-name',this.element);			
				
				$nameelement.on('change', function(){
					var that = $(this);
					GCN.page(GCNPlugin.page.id(), function(page){
						//wert aus textfeld holen
						var newvalue = that.attr("value");
						//wert in textfeld schreiben
						page.prop('name', newvalue);
					});
				});

				
				//INIT VALUES
				GCN.page(GCNPlugin.page.id(), function(page){
					$nameelement.attr("value",page.prop('name'));
				});
			}
		});
		sidebar.show();
	}

	/**
	 * We create and return the plugin.
	 */
    return Plugin.create('pagename', {
		
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