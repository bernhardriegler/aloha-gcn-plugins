define([
	'aloha/core',
	'aloha/plugin',
	'gcn/gcn-plugin',
	'i18n!objectproperties/nls/i18n',
	'i18n!aloha/nls/i18n',
	'aloha/jquery',
	'css!objectproperties/css/objectproperties.css'
], function(Aloha,Plugin, GCNPlugin, i18n, i18nCore, $) {
	'use strict';
	
	
	var plugin;

	var defaults = {
		tags : {},
		template : '<button data-tag="{tag}" class="{cssclass}">{title}</button>',
		test : "test"
	};

	function openTag($elem) {
		var pageId = GCNPlugin.page.id();
		GCN.page(pageId).tag($elem.attr("data-keyword"), function(tag){
			console.log('opening tag fill for', pageId, tag.prop('id'));
			GCNPlugin.openTagFill(tag.prop('id'), pageId);
		});
	}

	/**
	 * This is a small templating function
	 */
	function formatTemplate(template, obj) {
		return template.replace(/{(\w+)}/g, function(match, keyword) { 
		    return typeof obj[keyword] != 'undefined'
		      ? obj[keyword]
		      : match
		    ;
		});
	}
	
	/**
	 * We want to use the sidebar too
	 * Have a look at http://www.aloha-editor.org/guides/sidebar.html
	 */
	function prepareSidebar(sidebar) {
		sidebar.addPanel({
			id: 'aloha-objectproperties-panel',
			title: i18n.t('sidebar.objectproperties.title'),
			expanded: true,
			activeOn: true,
			content: '<div id="aloha-objectproperties-panel-content">\
						<fieldset id="aloha-objectproperties-panel-buttoncontainer">\
						</fieldset>\
					  </div>',
			onInit: function () {
				var $buttoncontainer = $(this.content).find('#aloha-objectproperties-panel-buttoncontainer');
				$buttoncontainer.on('click', '.aloha-op-button', function(){
					openTag($(this));
				});
				$(plugin._settings.tags).each(function(){
					var html = formatTemplate(plugin._settings.template, this);
					var $button = $(html);
					$button.attr("data-keyword", this.tag);
					$button.addClass("aloha-op-button");
					$buttoncontainer.append($button);
				});
			}
		});
		sidebar.show();
	}

	/**
	 * We create and return the plugin.
	 */
    return Plugin.create('objectproperties', {
		
		/**
		 * Configure the available languages
		 */
		languages: ['en', 'de'],

		/**
		 * Initialize the plugin
		 */
		init: function () {
			plugin = this;
			plugin._settings = $.extend({}, defaults, plugin.settings.config);
			prepareSidebar(Aloha.Sidebar.right);
		}
	});
});