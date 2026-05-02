/* globals app,window */

app.controller("ConfigController", function($scope, $rootScope, storage, api) {
  $rootScope.config = $scope;
  $scope.edit = false;
  $scope.toggle = function(b) {
    $scope.edit = b === undefined ? !$scope.edit : b;
  };
  $scope.clampPositive = function(k, v) {
    if (k === 'MinFreeDiskGB' && v < 0) return 0;
    return v;
  };
  $scope.submitConfig = function() {
    var data = JSON.stringify($rootScope.state.Config);
    api.configure(data);
  };
});
