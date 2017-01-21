app.controller('LoginCtrl', function($scope, $http, $location, $window, UserService) {

  // Start variables
  $scope.message = {
    status: false,
    type: '',
    text: ''
  };

  $scope.user = {
    email: '',
    password: ''
  };

  // Close alert
  $scope.closeAlert = function() {
    $scope.message = {
      'status': false,
      'type': '',
      'text': ''
    };
  };

  // Submit login form
  $scope.submit = function() {
    UserService.login($scope.user)
      .then(function(data) {
        if (data.data.success) {
          $window.localStorage.setItem(LOCAL_ID_USER, data.data.user);
          $window.localStorage.setItem(LOCAL_TOKEN_KEY, data.data.token);
          $location.path("/dashboard");
        } else {
          $scope.message = {
            'status': true,
            'type': 'error',
            'text': data.data.message
          };
        }
      }, function(status, data) {
        $scope.message = {
          'status': true,
          'type': 'error',
          'text': 'Erro!'
        };
      });
  };

  // Load Token and redirect to dashboard
  function loadUserCredentials() {
    var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      $location.path("/dashboard");
    }
  }

  // loadUserCredentials();
});

app.controller('LogoutCtrl', function($location, $window) {
  $window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  $window.localStorage.removeItem(LOCAL_ID_USER);
  $location.path('/login');
});
