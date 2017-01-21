var app = angular.module('myApp', ['ngRoute', 'ngResource', 'ngFileUpload']);

var API_ENDPOINT = "http://localhost:8080/api";
var LOCAL_TOKEN_KEY = "TokenListaPresentes";
var LOCAL_ID_USER = "IdUserListaPresentes";

app.config(function($routeProvider, $locationProvider, $httpProvider) {

  $routeProvider
    .when('/', {
      pageTitle: 'Dashboard',
      menuActive: 'dashboard',
      templateUrl: '/views/dashboard.html',
      controller: 'DashboardCtrl',
      requiredAuthentication: true
    })
    .when('/evento', {
      pageTitle: 'Meu evento',
      menuActive: 'event',
      templateUrl: '/views/evento.html',
      controller: 'EventCtrl',
      requiredAuthentication: true
    })
    .when('/lista-presentes', {
      pageTitle: 'Lista de Presentes',
      menuActive: 'presents',
      templateUrl: '/views/lista-presentes.html',
      controller: 'PresentsCtrl',
      requiredAuthentication: true
    })
    .when('/minha-lista', {
      pageTitle: 'Minha Lista de Presentes',
      menuActive: 'myList',
      templateUrl: '/views/minha-lista.html',
      controller: 'MyListCtrl',
      requiredAuthentication: true
    })
    .when('/login', {
      pageTitle: 'Login',
      menuActive: 'login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/logout', {
      templateUrl: '/views/login.html',
      controller: 'LogoutCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

  // Insert Token in Header HTTP
  $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $route, $location, $window) {
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if (nextRoute != null && nextRoute.requiredAuthentication && !$window.localStorage.getItem(LOCAL_TOKEN_KEY)) {
      $location.path("/login");
    }
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    document.title = $route.current.pageTitle;
    $rootScope.menuActive = $route.current.menuActive;
  });
});