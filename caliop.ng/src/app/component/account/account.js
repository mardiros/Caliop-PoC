/**
 * Account component.
 */
angular.module('caliop.component.account', [
    'ui.router',

    'caliop.service.account'
])

.config(function config($stateProvider) {
    $stateProvider
        .state('app.account', {
            url: 'account',
            views: {
                'layout@': {
                    templateUrl: 'component/common/fullpage.tpl.html'
                },
                'main@app.account': {
                    templateUrl: 'component/account/account.tpl.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        .state('app.preferences', {
            url: 'preferences',
            views: {
                'layout@': {
                    templateUrl: 'component/common/fullpage.tpl.html'
                },
                'main@app.preferences': {
                    templateUrl: 'component/account/preferences.tpl.html',
                    controller: 'PreferencesCtrl'
                }
            }
        });
})

/**
 * AccountCtrl
 */
.controller('AccountCtrl', ['$scope', 'auth',
    function AccountCtrl($scope, authSrv) {

    // $scope.contact = authSrv.getContact();
}])

/**
 * PreferencesCtrl
 */
.controller('PreferencesCtrl', ['$scope', 'auth',
    function PreferencesCtrl($scope, authSrv) {

    // console.log('PreferencesCtrl');
}]);