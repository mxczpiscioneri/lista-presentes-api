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

app.controller('DashboardCtrl', function($scope, $window, UserService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);

  UserService.findById(userId)
    .then(function(result) {
      if (result.data.success) {
        UserService.set(result.data.data);
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
});

app.controller('EventCtrl', function($scope, $window, UserService, EventService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);
  var fileChanged = false;

  EventService.findById(userId)
    .then(function(data) {
      if (data.data.success) {
        $scope.event = data.data.data;
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
    EventService.upload(userId, file)
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
    EventService.update(userId, $scope.event)
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

  $scope.$watch('event.name', function() {
    $scope.event.slug = slugGenerate($scope.event.name);
  });

  // Generate slug
  function slugGenerate(input) {
    if (!input) return;
    // make lower case and trim
    var slug = input.toLowerCase().trim();
    // replace invalid chars with spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ');
    // replace multiple spaces or hyphens with a single hyphen
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
  }
});

app.controller('PresentsCtrl', function($scope, $window, ProductService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);
  $scope.page = 1;
  $scope.sort = 'rate';

  ProductService.findAll(userId)
    .then(function(result) {
      if (result.data.success) {
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
          if (data.data.product.length > 0) {
            for (var i = 0; i < data.data.product.length; i++) {
              for (var j = 0; j < $scope.myList.length; j++) {
                if (data.data.product[i].product.id == $scope.myList[j].buscapeId) {
                  data.data.product[i].product.added = true;
                  data.data.product[i].product._id = $scope.myList[j]._id;
                }
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
      buscapeId: product.id,
      categoryid: product.categoryid,
      name: product.productname,
      pricemin: product.pricemin,
      pricemax: product.pricemax,
      link: product.links[0].link.url,
      image: product.thumbnail.url,
      bought: 0
    };

    ProductService.add(userId, ProductNew)
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
              $scope.products[i].product._id = result.data.productId;
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

  $scope.remove = function(productId) {
    ProductService.delete(userId, productId)
      .then(function(result) {
        if (result.data.success) {
          $scope.message = {
            'status': true,
            'type': 'success',
            'text': 'Produto removido com sucesso!'
          };
          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].product._id == productId) {
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

app.controller('MyListCtrl', function($scope, $window, ProductService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);

  ProductService.findAll(userId)
    .then(function(result) {
      if (result.data.success) {
        $scope.myList = result.data.data;
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

  $scope.remove = function(productId) {
    ProductService.delete(userId, productId)
      .then(function(data) {
        if (data.data.success) {
          $scope.message = {
            'status': true,
            'type': 'success',
            'text': 'Produto removido com sucesso!'
          };
          $scope.myList = $scope.myList.filter(function(el) {
            return el._id !== productId;
          });
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
});

app.controller('MyPresentsCtrl', function($scope, $window, ProductService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);

  ProductService.bought(userId)
    .then(function(result) {
      if (result.data.success) {
        $scope.myPresents = result.data.data;
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
});

app.controller('PublicCtrl', function($scope, $routeParams, $window, $location, EventService, ProductService) {

  var userId = $window.localStorage.getItem(LOCAL_ID_USER);

  EventService.findByName($routeParams.slug)
    .then(function(result) {
      if (result.data.success) {
        $scope.event = result.data.data.events[0];
        console.log(result.data.data.events[0]);
      } else {
        $location.path("/404");
      }
    }, function(status, result) {
      $location.path("/404");
    });

  $scope.buy = function(product) {
    if (product.bought > 0) {
      if ($window.confirm("Este produto já foi comprado por outro convidado. Se realmente desejar comprar este produto, escolha uma loja que ofereça a troca do produto. Obrigado!")) {
        bought(product);
      }
    } else {
      bought(product);
    }
  }

  function bought(product) {
    product.bought = (product.bought || 0) + 1;

    ProductService.buy(userId, product._id, product.bought)
      .then(function(result) {
        if (!result.data.success) {
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
});
