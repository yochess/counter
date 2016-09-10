(() => {
  const app = angular.module('counterApp', []);

  app.controller('counterCtrl', ($scope, Counter) => {


    $scope.getCounter = () => {
      Counter.getCounter(1).then(data => {
        $scope.counter = data.counter
      });
    }


    $scope.getCounter();
  });

  app.factory('Counter', ($http) => {
    return {
      getCounter: (id) => {
        return $http.put(`/api/getCounter/${id}`).then(res => res.data);
      }
    }

  });

})();
