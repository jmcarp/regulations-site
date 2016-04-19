'use strict';
var _ = require('underscore');
var Backbone = require('backbone');
var MainView = require('./views/main/main-view');
var MainEvents = require('./events/main-events');
var BreakawayEvents = require('./events/breakaway-events');
require('backbone-query-parameters');

var RegsRouter;

if (typeof window.history.pushState === 'undefined') {
    RegsRouter = function() {
        this.start = function() {};
        this.navigate = function() {};
        this.hasPushState = false;
    };
}
else {
    RegsRouter = Backbone.Router.extend({
        routes: {
            'sxs/:section/:version': 'loadSxS',
            'search/:reg': 'loadSearchResults',
            'diff/:section/:baseVersion/:newerVersion': 'loadDiffSection',
            ':section/:version': 'loadSection',
            ':section': 'loadSection'
        },

        initialize: function() {
          this.route(/preamble\/(.*)/, 'loadPreamble');
        },

        loadSection: function(section) {
            var options = {id: section};

            // to scroll to paragraph if there is a hadh
            options.scrollToId = Backbone.history.getHash();

            // ask the view not to route, its not needed
            options.noRoute = true;

            MainEvents.trigger('section:open', section, options, 'reg-section');
        },

        loadPreamble: function(section) {
            section = section.split('/').join('-');
            var options = {id: section};

            // ask the view not to route, its not needed
            options.noRoute = true;

            MainEvents.trigger('section:open', section, options, 'preamble-section');
        },

        loadDiffSection: function(section, baseVersion, newerVersion, params) {
            var options = {};

            options.id = section;
            options.baseVersion = baseVersion;
            options.newerVersion = newerVersion;
            options.noRoute = true;
            options.fromVersion = params.from_version;

            MainEvents.trigger('diff:open', section, options, 'diff');
        },

        loadSxS: function(section, version, params) {
            BreakawayEvents.trigger('sxs:open', {
                regParagraph: section,
                docNumber: version,
                fromVersion: params.from_version
            });
        },

        loadSearchResults: function(reg, params) {
            var config = {
                query: params.q,
                regVersion: params.regVersion
            };

            // if there is a page number for the query string
            if (typeof params.page !== 'undefined') {
                config.page = params.page;
            }

            MainEvents.trigger('search-results:open', null, config, 'search-results');
        },

        start: function() {
            var root = window.APP_PREFIX || '';

            Backbone.history.start({
                pushState: 'pushState' in window.history,
                silent: true,
                root: root
            });
        },

        hasPushState: true
    });

    var History = Backbone.History.extend({
      navigate: function(fragment, options) {
        if (!Backbone.History.started) return false;
        if (!options || options === true) options = {trigger: !!options};

        // Normalize the fragment.
        fragment = this.getFragment(fragment || '');

        // Don't include a trailing slash on the root.
        var rootPath = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
          rootPath = rootPath.slice(0, -1) || '/';
        }
        var url = rootPath + fragment;

        // Decode for matching.
        fragment = this.decodeFragment(fragment);

        if (this.fragment === fragment) return;
        this.fragment = fragment;

        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
        if (options.trigger) return this.loadUrl(fragment);
      }
    });
    Backbone.history = new History();

}

var router = new RegsRouter();
module.exports = router;
