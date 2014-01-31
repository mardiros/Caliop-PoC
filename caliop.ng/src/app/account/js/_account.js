(function() {

"use strict";

angular.module('caliop.account', [
    'caliop.service.account'
]);


angular.module('caliop.service.account', [
    'caliop.entity.session'
]);


angular.module('caliop.entity.session', [
    'restangular',

    'caliop.common.service.helpers'
]);

}());
