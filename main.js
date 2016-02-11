'use strict';

var app = angular.module('stockTracker', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', { url: '/', templateUrl: './pages/home.html' })  
    .state('list', { url: '/list', templateUrl: './pages/list.html', controller: 'listCtrl' })  
    .state('add', { url: '/add', templateUrl: './pages/add.html', controller: 'addCtrl' })  
  $urlRouterProvider.otherwise('/');
});



app.service('Stocks', function($http){
  if (!this.stockSymbols){
    this.stocks = [];
  };
  var thisStock = this;

  this.addStock = function(symbolAdd){
    var promise = $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${symbolAdd}&jsoncallback=JSON_CALLBACK`);
    promise.then(function(res){
      console.log(res);
      thisStock.stocks.push(res);
      swal("Your Stock Has Been Added")
      location.href= '/#/list'
    });
    };

  this.lookUp = function(symbolName){
    return $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${symbolName}&jsoncallback=JSON_CALLBACK`);
  };


  this.deleteFromAray = function (index){
    thisStock.stocks.splice(index, 1);
    console.log('index', index);
    swal("Deleted")
  }
});

app.controller('listCtrl', function($scope, $state, Stocks){
  console.log(Stocks.stocks)
  $scope.stocks = Stocks.stocks;


 $scope.deleteName = function(value){
  var index = this.$index;
  console.log(index);
  Stocks.deleteFromAray(index)
  }


});

app.controller('addCtrl', function($scope, $state, Stocks){

  $scope.addSymbol = function(){
    Stocks.addStock($scope.symbol);
  };


  $scope.symbolSearch = function(){
    var promise = Stocks.lookUp($scope.search);

    promise.then(function(res){
      $scope.searchResults = res.data;
      $scope.showTable = true;
      });

  };
});