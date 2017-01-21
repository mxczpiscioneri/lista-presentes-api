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

app.controller('EventCtrl', function($scope, $window, UserService, EventService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);
  var eventId = '587f7fbf1eb5f517d0c01e7c';
  var fileChanged = false;

  EventService.findById(userId, eventId)
    .then(function(data) {
      if (data.data.success) {
        $scope.event = data.data.data.events[0];
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


  // Close alert
  $scope.closeAlert = function() {
    $scope.message = {
      'status': false,
      'type': '',
      'text': ''
    };
  };

  // Check if uploaded
  $scope.fileChanged = function() {
    fileChanged = true;
  }

  $scope.editEvent = function() {
    // Check if uploaded
    if (fileChanged) {
      $scope.upload($scope.event.image);
    } else {
      $scope.update();
    }
  }

  $scope.upload = function(file) {
    EventService.upload(userId, eventId, file)
      .then(function(resp) {
        if (resp.data.success) {
          console.log('Success ' + resp.config.data.file.name + ' uploaded');
        } else {
          console.log('Error: ' + resp.status);
        }
        $scope.update(resp.data.data);
      }, function(resp) {
        console.log('Error status: ' + resp.status);
      });
  };

  $scope.update = function(image) {
    // Check for new image
    if (image) {
      $scope.event.image = image;
    }
    EventService.update(userId, eventId, $scope.event)
      .then(function(resp) {
        if (resp.data.success) {
          $window.scrollTo(0, angular.element(document.getElementById('header')).offsetTop);
          $scope.message = {
            'status': true,
            'type': 'success',
            'text': 'Evento atualizado com sucesso.'
          };
        } else {
          $scope.message = {
            'status': true,
            'type': 'error',
            'text': resp.data.message
          };
        }
      }, function(status, resp) {
        $scope.message = {
          'status': true,
          'type': 'error',
          'text': 'Erro!'
        };
      });
  };
});