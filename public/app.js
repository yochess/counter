(() => {
  const app = angular.module('counterApp', []);

  app.controller('counterCtrl', ($scope, Counter) => {
    $scope.input = {};
    $scope.input.radio = "one";

    $scope.getCounter = () => {
      Counter.getCounter(1).then(data => {
        $scope.counter = data.counter
      });
    };

    $scope.subscribe = () => {
      Counter.subscribe($scope.input).then(data => {
        console.log(data);
      });
    };

    $scope.getCounter();
  });

  app.factory('Counter', ($http) => {
    return {
      getCounter: (id) => {
        return $http.put(`/api/getCounter/${id}`).then(res => res.data);
      },

      subscribe: (input) => {
        return $http.post('/api/subscribe', input).then(res => res.data);
      }
    };

  });

})();
