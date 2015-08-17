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
        // add tags which should be reachable in sidebar here
        tags : {
            // title: "Title, shown in sidebar",
            // tag: "keyword of tag"
            // cssclass: "set a individual class for each button"
            // checkProp: "", // property of the tag to check if not equal to checkPropValue, i.e. "text"
            // checkPropValue: "" // value compared to checkProp i.e. "" --> tagtype text(short): (tag.part("text") !== "")
        },
        // markup for buttons in sidebar
        template : '<button data-tag="{tag}" class="{cssclass}">{title}</button>'
    };

    // update validation when clsoing tagfill
    // compare and set/remove class "is-filled"
    function validateTag($elem) {
        // check if validation config is set
        if(tags[i].part(this.checkProp) !== null) {
        // focus event is fired on tagfill close (gcn-plugin.js:715)
        // handle this once
        $('body').one('focus.objectpropertiesplugin', function (e) {
                // get the page and tag obj after tagfill close to compare changes
                var pageId = GCNPlugin.page.id();
                GCN.page(pageId, function (page) {
                    // get fresh tag object
                    page.clear();
                    GCN.page(pageId).tag($elem.attr("data-keyword"), function(tag){
                        console.log('run validation for ', pageId, tag.prop('id'));
                        // get part and value to compare from html (write to html before)
                        if (tag.part($elem.attr("data-checkprop")).toString() !== $elem.attr("data-checkpropvalue")) {
                            // add class
                            $elem.addClass('aloha-op-button-isfilled');
                        } else {
                            // not filled - remove class "is-filled"
                            $elem.removeClass('aloha-op-button-isfilled');
                        }
                    });
                });
            });
        }
    }

    function openTag($elem) {
        var pageId = GCNPlugin.page.id();
        GCN.page(pageId).tag($elem.attr("data-keyword"), function(tag){
            //first we have to try to close any open tag fill
            try {
                GCNPlugin.closeLightbox();
            } catch(err) {
                //tag fill could not be closed because it was not open
            }
            //now we can open the desired object property as tag fill
            console.log('opening tag fill for', pageId, tag.prop('id'));
            // hook up validation
            validateTag($elem); 
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
                var pageId = GCNPlugin.page.id();

                GCN.page(pageId).tags(function(tags) {
                    $(plugin._settings.tags).each(function(){
                        var display = false;
                        var filled = false;
                        for(var i = 0; i<tags.length; i++) {
                            if(this.tag === tags[i]._name) {
                                display = true;
                                // check if validation config is set
                                if(tags[i].part(this.checkProp) !== null) {
                                    if (tags[i].part(this.checkProp) !== this.checkPropValue) {
                                        filled = true;
                                    }
                                }
                            }
                        }
                        if(display) {
                            var html = formatTemplate(plugin._settings.template, this);
                            var $button = $(html);
                            $button
                                .attr("data-keyword", this.tag)
                                // add validation info
                                .attr("data-checkprop", this.checkProp)
                                .attr("data-checkpropvalue", this.checkPropValue);
                            $button.addClass("aloha-op-button");
                            if(filled){
                                $button.addClass("aloha-op-button-isfilled");
                            }
                            $buttoncontainer.append($button);
                        }
                    });
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