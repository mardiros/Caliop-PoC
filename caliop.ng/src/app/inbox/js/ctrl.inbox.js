(function() {

"use strict";

angular.module('caliop.inbox', [
    'caliop.inbox.entity.thread',
    'caliop.inbox.service.filter',
    'caliop.user.filter',
    'caliop.inbox.directive',

    'caliop.message',
    'caliop.attachment'
])

.config(['$stateProvider',
    function config($stateProvider) {

    $stateProvider
        .state('app.inbox', {
            url: 'inbox',
            views: {
                // ui-view="layout" of index.tpl.html
                'layout@': {
                    templateUrl: 'common/html/2columns.tpl.html'
                },
                // ui-view="main" of 2columns.tpl.html
                'main@app.inbox': {
                    templateUrl: 'inbox/html/layout.tpl.html',
                    controller: 'InBoxLayoutCtrl'
                },
                // ui-view="tabContent" of inbox/html/layout.tpl.html
                'tabContent@app.inbox': {
                    templateUrl: 'inbox/html/list.tpl.html',
                    controller: 'InBoxCtrl'
                },
                // ui-view="panel" of 2columns.tpl.html
                'panel@app.inbox': {
                    templateUrl: 'panel/html/panel.tpl.html',
                    controller: 'PanelCtrl'
                }
            }
        });
}])

/**
 * InBoxLayoutCtrl
 */
.controller('InBoxLayoutCtrl', [
    '$scope',
    'tabs', 'filter', 'tag',

    function InBoxLayoutCtrl(
        $scope,
        TabsSrv, FilterSrv) {

    /**
     * Watch the tabs list in the service.
     */
    $scope.$watch(function() {
        return TabsSrv.tabs;
    }, function(tabs) {
        $scope.tabs = tabs;
    });

    /**
     * Load the content of a tab.
     */
    $scope.loadContent = function(tab) {
        TabsSrv.select(tab);
    };

    /**
     * Close a tab.
     */
    $scope.closeTab = function(tab) {
        TabsSrv.close(tab);
    };

    /**
     * Initialize a shared variable between this controller and its children
     * which allows to refresh the filter query.
     */
    $scope.filter = {query: ''};

    /**
     * When submitting the filter form, refresh the query.
     * The watchers in the child controller will observe the filter service
     * and reload threads.
     */
    $scope.submitFilter = function() {
        FilterSrv.parseQuery($scope.filter.query).then(function() {
            $scope.filter.query = FilterSrv.makeQuery();
        });
    };
}])

/**
 * InBoxCtrl
 */
.controller('InBoxCtrl', [
    '$scope', '$state', '$filter', '$modal',
    'tabs', 'thread', 'tag', 'filter',

    function InBoxCtrl(
        $scope, $state, $filter, $modal,
        TabsSrv, ThreadSrv, TagSrv, FilterSrv) {

    // init
    $scope.threads = {};

    /**
     * Go inside a thread to list messages.
     */
    $scope.openThread = function(thread) {
        var stateMessages = 'app.inbox.thread';

        TabsSrv.add({
            title: $filter('joinUsers')(thread.users, 3),
            tooltip: $filter('joinUsers')(thread.users, -1),
            state: stateMessages,
            stateParams: {
                type: 'thread',
                id: thread.id
            }
        });

        // set the thread as read
        thread.setRead();
    };

    /**
     * Open a modalbow to download the attachment.
     */
    $scope.openAttachment = function(extension) {
        var modalInstance = $modal.open({
            templateUrl: 'attachment/html/download.tpl.html',
            controller: 'AttachmentCtrl',
            resolve: {
                extension: function () {
                    return extension;
                }
            }
        });
    };

    /**
     * Show actions icons if a (or more) thread has been selected.
     */
    $scope.showThreadActions = function() {
        return _.filter($scope.threads.list, function(thread) {
            return thread.selected;
        }).length > 0;
    };

    /**
     * Tags selector popover.
     */
    $scope.openTagSelector = function() {
        TagSrv.getList().then(function(tags) {
            $scope.tagSelector = $scope.tagSelector || {};
            $scope.tagSelector.tags = tags;

            console.log($scope.tagSelector.tags);
        });
    };

    /**
     * Select/unselect all threads.
     */
    $scope.$watch('selectAllThreads', function(checked) {
        angular.forEach($scope.threads.list, function(thread) {
            thread.selected = checked;
        });
    });

    /**
     * Add a tag to the filters.
     */
    $scope.filterByTag = function(tagId) {
        TagSrv.byId(tagId).then(function(tag) {
            FilterSrv.addTag(tag);
        });
    };

    /**
     * When adding/removing tags,
     *  - update filter query,
     *  - reload the list of threads.
     */
    $scope.$watch(function() {
        return FilterSrv.tags.length;
    }, function(tags) {
        // update the filter query
        $scope.filter.query = FilterSrv.makeQuery();

        // filter by tags
        var params = {};
        if (FilterSrv.tags.length) {
            params = {tag: _.map(FilterSrv.tags, function(tag) {
                return tag.id;
            })};
        }

        $scope.reloadThreads(params);
    });

    /**
     * Reload threads with optional search params
     */
    $scope.reloadThreads = function(params) {
        // make query parameters to reload threads
        ThreadSrv.getList(params).then(function(threads) {
            $scope.threads.list = threads;

            // count unread threads
            $scope.threads.unread = _.filter($scope.threads.list, function(thread) {
                return thread.isUnread();
            }).length;
        });
    };
}]);

}());
