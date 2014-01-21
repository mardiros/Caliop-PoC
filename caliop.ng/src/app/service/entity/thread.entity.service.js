(function() {

"use strict";

angular.module('caliop.service.entity.thread', [
    'restangular',
    'caliop.service.helpers',

    'caliop.service.entity.recipient'
])

.factory('thread', ['Restangular', 'string', 'recipient',
    function (Restangular, stringSrv, recipientSrv) {

    var Thread = function Thread(obj) {
        var self = this;

        angular.extend(self, obj);

        // save obj struct in the object
        angular.forEach(obj, function(value, key) {
            key = stringSrv.toCamelCase(key);
            self[key] = value;

            // convert dates to moment objects
            if (/^date/.test(key)) {
                self[key] = moment(self[key]);
            }
        });
    };

    /**
     * Return the list of recipients
     * @return [{caliop.service.entity.recipient}]
     */
    Thread.prototype.getRecipients = function() {
        var that = this;

        var recipients = [];
        angular.forEach(this.recipients, function(recipient) {
            recipients.push(recipientSrv.new_(recipient));
        });

        that.recipients = recipients;
        return that.recipients;
    };

    Thread.new_ = function(obj) {
        var thread = new Thread(obj);
        thread.getRecipients();
        return thread;
    };

    Restangular.addElementTransformer('threads', false, function(obj) {
        return Thread.new_(obj);
    });

    return {
        new_: Thread.new_,
        Restangular: Restangular
    };
}]);

}());
