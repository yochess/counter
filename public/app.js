(() => {
  const app = angular.module('counterApp');

  app.controller('counterCtrl', ($scope, Counter) => {


    $scope.getCounter = () => {
      Counter.getCounter().then(data => { $scope.data = data });
    }

  });

  app.factory('Counter', ($http) => {
    return {
      getCounter: () => {
        $http.get('/api/getCounter').then(res => res.data);
      }
    }

  });

})();
