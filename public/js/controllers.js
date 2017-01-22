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
  var eventId = $window.localStorage.getItem(LOCAL_ID_EVENT);
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

app.controller('PresentsCtrl', function($scope, $window, ProductService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);
  var eventId = $window.localStorage.getItem(LOCAL_ID_EVENT);
  $scope.page = 1;
  $scope.sort = 'rate';

  ProductService.findAll(userId, eventId)
    .then(function(result) {
      if (result.status == 200) {
        $scope.myList = result.data.data;
        $scope.getProducts(1, $scope.sort);
      } else {
        $scope.message = {
          'status': true,
          'type': 'error',
          'text': result.data.message
        };
      }
    }, function(status, result) {
      $scope.message = {
        'status': true,
        'type': 'error',
        'text': 'Erro!'
      };
    });

  $scope.getProducts = function(page, sort) {

    var search = $scope.search ? $scope.search : 'eletrodomestico';

    ProductService.searchBuscape(search, page, sort)
      .then(function(data) {
        if (data.status == 200) {

          // Check if Buscape product has already been added
          for (var i = 0; i < data.data.product.length; i++) {
            for (var j = 0; j < $scope.myList.length; j++) {
              if (data.data.product[i].product.id == $scope.myList[j].buscapeId) {
                data.data.product[i].product.added = true;
                data.data.product[i].product._id = $scope.myList[j]._id;
              }
            }
          }
          $scope.products = data.data.product;

          // Pagination
          var pages = [];
          for (var i = 1; i <= data.data.totalpages; i++) {
            pages.push(i);
          }
          $scope.totalPages = pages;
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
  }

  $scope.add = function(product) {

    var ProductNew = {
      id: product.id,
      categoryid: product.categoryid,
      productname: product.productname,
      pricemin: product.pricemin,
      pricemax: product.pricemax,
      link: product.links[0].link.url,
      image: product.thumbnail.url,
    };

    ProductService.add(userId, eventId, ProductNew)
      .then(function(result) {
        if (result.data.success) {
          $scope.message = {
            'status': true,
            'type': 'success',
            'text': 'Produto adicionado com sucesso!'
          };
          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].product.id == product.id) {
              $scope.products[i].product.added = true;
              $scope.products[i].product._id = result.data.data._id;
              break;
            }
          }
        } else {
          $scope.message = {
            'status': true,
            'type': 'error',
            'text': result.data.message
          };
        }
      }, function(status, result) {
        $scope.message = {
          'status': true,
          'type': 'error',
          'text': 'Erro!'
        };
      });
  }

  $scope.remove = function(product) {
    ProductService.delete(userId, eventId, product._id)
      .then(function(data) {
        if (data.data.success) {
          $scope.message = {
            'status': true,
            'type': 'success',
            'text': 'Produto removido com sucesso!'
          };
          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].product.id == product.id) {
              $scope.products[i].product.added = false;
              break;
            }
          }
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
  }

  $scope.sorting = function() {
    $scope.getProducts($scope.page, $scope.sort);
  }

  $scope.pagination = function(number) {
    if (number > 0 && number <= $scope.totalPages.length) {
      $scope.page = number;
      $scope.getProducts(number, $scope.sort);
      $window.scrollTo(0, angular.element(document.getElementById('header')).offsetTop);
    }
  }

  $scope.$watch('search', function() {
    $scope.getProducts(1, $scope.sort);
  });
});