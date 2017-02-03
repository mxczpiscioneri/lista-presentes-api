app.factory('TokenInterceptor', function($q, $window, $location) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.localStorage.getItem(LOCAL_TOKEN_KEY)) {
        config.headers['x-access-token'] = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
      }
      return config;
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    /* Set Authentication.isAuthenticated to true if 200 received */
    response: function(response) {
      return response || $q.when(response);
    },

    /* Revoke client authentication if 401 is received */
    responseError: function(rejection) {
      if (rejection != null && rejection.status === 401 && ($window.localStorage.getItem(LOCAL_TOKEN_KEY))) {
        $window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        $window.localStorage.removeItem(LOCAL_ID_USER)
        $location.path("/login");
      }

      return $q.reject(rejection);
    }
  };
});

app.factory('UserService', function($http, $rootScope) {
  return {
    login: function(user) {
      return $http.post(API_ENDPOINT + '/authenticate/', user);
    },
    findAll: function() {
      return $http.get(API_ENDPOINT + '/users/');
    },
    findById: function(id) {
      return $http.get(API_ENDPOINT + '/users/' + id);
    },
    add: function(user) {
      return $http.post(API_ENDPOINT + '/users/', user);
    },
    update: function(id, user) {
      return $http.put(API_ENDPOINT + '/users/' + id, user);
    },
    delete: function(id) {
      return $http.delete(API_ENDPOINT + '/users/' + id);
    },
    get: function() {
      return $rootScope.user;
    },
    set: function(user) {
      $rootScope.user = user;
    }
  }
});

app.factory('EventService', function($http, Upload) {
  return {
    findAll: function(userId) {
      return $http.get(API_ENDPOINT + '/users/' + userId + '/events/');
    },
    findById: function(userId, eventId) {
      return $http.get(API_ENDPOINT + '/users/' + userId + '/events/' + eventId);
    },
    findByName: function(slug) {
      return $http.get(API_ENDPOINT + '/events/' + slug);
    },
    add: function(userId, event) {
      return $http.post(API_ENDPOINT + '/users/' + userId + '/events/', event);
    },
    update: function(userId, eventId, event) {
      return $http.put(API_ENDPOINT + '/users/' + userId + '/events/' + eventId, event);
    },
    delete: function(userId, eventId) {
      return $http.delete(API_ENDPOINT + '/users/' + userId + '/events/' + eventId);
    },
    upload: function(userId, eventId, fileUpload) {
      return Upload.upload({ url: API_ENDPOINT + '/users/' + userId + '/upload/', data: { file: fileUpload } });
    }
  }
});

app.factory('ProductService', function($http) {
  return {
    searchBuscape: function(search, page, sort) {
      return $http.get(API_ENDPOINT + '/products/search/' + search + '/' + page + '/' + sort);
    },
    findAll: function(userId) {
      return $http.get(API_ENDPOINT + '/users/' + userId + '/products/');
    },
    findById: function(userId, productId) {
      return $http.get(API_ENDPOINT + '/users/' + userId + '/products/' + productId);
    },
    add: function(userId, product) {
      return $http.post(API_ENDPOINT + '/users/' + userId + '/products/', product);
    },
    update: function(userId, productId) {
      return $http.put(API_ENDPOINT + '/users/' + userId + '/products/' + productId, product);
    },
    delete: function(userId, productId) {
      return $http.delete(API_ENDPOINT + '/users/' + userId + '/products/' + productId);
    }
  }
});
