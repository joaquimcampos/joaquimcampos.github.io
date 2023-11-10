angular.module('acadApp', ['ngRoute', 'ui.bootstrap', 'ngResource'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        templateUrl:'html/main.html'
        })
        .when('/pubs', {
        controller:'PubsCtrl',
        templateUrl:'html/pubs.html'
        })
        .when('/about', {
        templateUrl:'html/about.html'
        })
        .when('/projects', {
        templateUrl:'html/projects.html'
        })
        .when('/radiobooks', {
        templateUrl:'html/radiobooks.html'
        })
        .when('/compression', {
        templateUrl:'html/compression.html'
        })
        .when('/htv', {
        templateUrl:'html/htv.html'
        })
        .when('/deepsplines', {
        templateUrl:'html/deepsplines.html'
        })
        .when('/mahayana', {
        templateUrl:'html/mahayana.html'
        })
        .when('/next', {
        templateUrl:'html/next.html'
        })
        .otherwise({
        redirectTo:'html/main.html'
        })

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
})
.controller('mainCtrl', ['$scope', '$window', '$location', '$rootScope', '$uibModal', function($scope, $window, $location, $rootScope, $uibModal) {
    var updateButton = function() {
        $scope.button = $location.url();
    };

    $scope.navbarCollapsed = true;

    $scope.$on('$routeChangeStart', updateButton);

    // Manually trigger MathJax to render the formulas
    var renderMathJax = function() {
        if (typeof MathJax !== 'undefined') {
            MathJax.typeset();
        }
    };

    $scope.$on('$viewContentLoaded', renderMathJax);

    // Function to handle navbar toggle click and custom functionality
    $scope.toggleNavbar = function() {
        $scope.navbarCollapsed = !$scope.navbarCollapsed; // Toggle navbar state

        if (!$scope.navbarCollapsed) {
            console.log("Navbar expanded.");
            var mainContentContainer = document.querySelector(".main-content"); // Change to your container class
            mainContentContainer.style.paddingTop = "230.5px";
        } else {
            var mainContentContainer = document.querySelector(".main-content"); // Change to your container class
            mainContentContainer.style.paddingTop = "0";
            // remove focus on collapsed navbar
            document.activeElement.blur();
        }
    };

    // Function to collapse the navbar when clicking away
    var collapseNavbar = function () {
        $scope.navbarCollapsed = true;
        var mainContentContainer = document.querySelector(".main-content"); // Change to your container class
        mainContentContainer.style.paddingTop = "0";
    };

    angular.element(document).on('click', function(e) {
        if (e.target.closest('.navbar') === null) {
            $scope.$apply(collapseNavbar);
        }
    });

    // Function to collapse the navbar after clicking on a navbar icon
    $scope.closeNavbar = function () {
        if (!$scope.navbarCollapsed) {
          $scope.navbarCollapsed = true;
        }
    };

    $scope.open_pic = function(pic_location) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'html/picmodal.html',
            controller: 'PicModalCtrl',
            size: 'lg',
            resolve: {
                pic_location: function () {
                    return pic_location
                }
            },
            windowClass: 'pic-modal',
            backdropClass: 'pic-modal-back'
        }).result.then(function(){}, function(res){});
    }

    $scope.scrollToElement = function(ElementId) {
        var Element = document.getElementById(ElementId);
        if (Element) {
            Element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    $rootScope.$on('$routeChangeSuccess', function () {
        // Scroll to the top of the page
        $window.scrollTo(0, 0);
    });
}])
.filter('floor', function() {
    return function(input) {
        return Math.floor(input);
    };
});
