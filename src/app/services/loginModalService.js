(function () {
    'use strict';

    var app = angular.module('app');

    app.service('loginModalService', ['$log', '$uibModal',
        function ($log, $uibModal) {

            var login = function () {
                $uibModal.open({
                    template: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="close()"><span aria-hidden="true">×</span></button><h4 class="modal-title">Login</h4></div><div class="modal-body"><div class="msg msg-warning" ng-if="!loginAttempted">You must log in to continue</div><div data-login-form ng-model="user" on-login-attempt="onLoginAttempt()" on-login="onLogin()"></div></div>',
                    //backdrop: 'static',
                    //keyboard: false,
                    size: 'sm',
                    windowClass: 'modalCenter',
                    controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
                            $scope.onLoginAttempt = function () {
                                $scope.loginAttempted = true;
                            };

                            $scope.onLogin = function () {
                                $log.debug('login success');
                                $timeout(function () {
                                    $uibModalInstance.close();
                                }, 1000);
                            };
							
                            $scope.close = function() {
                                $uibModalInstance.close();
                            };
                        }]
                });
            };

            return {
                login: login
            };
        }]);

})();