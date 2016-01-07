(function () {
    'use strict';

    var app = angular.module('app');

    app.service('messageModalService', ['$log', '$modal',
        function ($log, $modal) {            
            var show = function(title, message, className) {
                
                $log.debug('message modal open => ', title, message, className);
                
                $modal.open({
                    template: '<div class="modal-header"><b>{{title}}</b></div><div class="modal-body"><div class="alert alert-{{className}}">{{message}}</div></div></div><div class="modal-footer"><button class="btn btn-default" ng-click="close()">Close</button></div>',
                    //backdrop: 'static',
                    //keyboard: false,
                    windowClass: 'modalCenter',
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.title = title;
                            $scope.message = message;
                            $scope.className = className || 'danger';
                            
                            $scope.close = function() {
                                $modalInstance.close();
                            };
                        }]
                });
            };


            return {
                show: show
            };
        }]);

})();