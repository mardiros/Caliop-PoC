(function() {

"use strict";

angular.module('caliop.user')

.config(function config($stateProvider) {
    $stateProvider
        .state('app.user', {
            url: 'user/',
            abstract: true,
            views: {
                // ui-view="layout" of index.tpl.html
                'layout@': {
                    templateUrl: 'common/html/2columns.tpl.html'
                },
                // ui-view="main" of 2columns.tpl.html
                'main@app.user': {
                    templateUrl: 'inbox/html/layout.tpl.html',
                    controller: 'TabsManagementCtrl'
                },
                // ui-view="tabContent" of inbox/html/layout.tpl.html
                'tabContent@app.user': {
                    templateUrl: 'user/html/create.tpl.html',
                    controller: 'UserCreationCtrl'
                },
                // ui-view="panel" of 2columns.tpl.html
                'panel@app.user': {
                    templateUrl: 'panel/html/panel.tpl.html',
                    controller: 'PanelCtrl'
                }
            }
        })
        .state('app.user.create', {
            url: 'create',
            views: {
                // // ui-view="main" of 2columns.tpl.html
                // 'main@app.user': {
                //     templateUrl: 'user/html/create.tpl.html',
                //     controller: 'UserCreationCtrl'
                // }
            }
        });
})

/**
 * UserCreationCtrl
 */
.controller('UserCreationCtrl', ['$scope', 'tabs',
    function AccountCtrl($scope, tabsSrv) {

}]);

}());
