(function () {
    'use strict';

    var app = angular.module('app');

    app.service('messageModalService', ['$log', '$uibModal',
        function ($log, $uibModal) {            
            var show = function(title, message, className) {
                
                $log.debug('message modal open => ', title, message, className);
                
                $uibModal.open({
                    template: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="close()"><span aria-hidden="true">×</span></button><h4 class="modal-title">{{title}}</h4></div><div class="modal-body"><div class="alert alert-{{className}}">{{message}}</div></div></div><div class="modal-footer"><button class="btn btn-default" ng-click="close()">Close</button></div>',
                    //backdrop: 'static',
                    //keyboard: false,
                    windowClass: 'modalCenter',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                            $scope.title = title;
                            $scope.message = message;
                            $scope.className = className || 'danger';
                            
                            $scope.close = function() {
                                $uibModalInstance.close();
                            };
                        }]
                });
            };


            return {
                show: show
            };
        }]);

})();