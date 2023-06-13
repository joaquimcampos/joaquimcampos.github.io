function SharedFunc($scope, $http, $filter, $uibModal, cite_keys) {

    $scope.getDate = function (pub) {
        if (pub.Fields.month) {
            return new Date(Date.parse(pub.Fields.month + " 1, " + pub.Fields.year));
        } else {
            return new Date(Date.parse("Jan 1, " + pub.Fields.year));
        }
    };

    // Remove ands
    var replaceAllButLast = function (string, token) {
        if (string.indexOf(token) == -1) {
            return string;
        }
        var parts = string.split(token);
        return parts.slice(0, -1) + token + parts.slice(-1)
    };

    // Give a nicely formatted bibtex entry
    var setBib = function (pub) {
        var text = '@' + pub.EntryType + '{' + pub.EntryKey
        Object.keys(pub.Fields).forEach(function (key) {
            if (key != 'abstract' && key != 'author_noand'
                && key != 'url' && key != 'slides') {
                text += ', \n  ' + key + ' = {' + pub.Fields[key] + '}'
            }
        })
        text += '\n}'
        return text;
    };

    // Read data from bibfile
    $http({ method: 'GET', url: 'assets/pubs/bibfile.bib' }).
        then(function (response) {
            // Parse bibtex to JSON
            rawbib = response.data;
            var rawjson = angular.fromJson(BibtexParser(response.data));

            // Remove `and' between authors
            for (index = 0; index < rawjson.entries.length; ++index) {
                rawjson.entries[index].Fields.author_noand =
                    replaceAllButLast(rawjson.entries[index].Fields.author, " and");
            }
            
            if (typeof cite_keys !== 'undefined') {
                // Filter cite_keys
                var filtered_entries = []
                for (index = 0; index < cite_keys.length; ++index) {
                    pub_search = $filter('filter')(
                        rawjson.entries, { "EntryKey": cite_keys[index] }, false
                    );

                    if (pub_search.length) {
                        filtered_entries = filtered_entries.concat(pub_search)
                    };
                }
                rawjson.entries = filtered_entries
            }

            sorted_pubs = [];
            pub_search = $filter('filter')(
                rawjson.entries, { 'EntryType': 'unpublished' }, false
            );
            if (pub_search.length) {
                sorted_pubs.push({ name: 'Preprints', pubs: pub_search })
            };

            pub_search = $filter('filter')(
                rawjson.entries, { 'EntryType': 'article' }, false
            );
            if (pub_search.length) {
                sorted_pubs.push({ name: 'Journal papers', pubs: pub_search })
            };

            pub_search = $filter('filter')(
                rawjson.entries, { 'EntryType': 'inproceedings' }, false
            );
            if (pub_search.length) {
                sorted_pubs.push({ name: 'Conference proceedings', pubs: pub_search })
            };

            pub_search = $filter('filter')(
                rawjson.entries, { 'EntryType': 'book' }, false
            );
            if (pub_search.length) {
                sorted_pubs.push({ name: 'Books and chapters', pubs: pub_search })
            };

            pub_search = $filter('filter')(
                rawjson.entries, { 'EntryType': 'patent' }, false
            );
            if (pub_search.length) {
                sorted_pubs.push({ name: 'Patents', pubs: pub_search })
            };

            pub_search = $filter('filter')(
                rawjson.entries, { 'EntryType': 'thesis' }, false
            );
            if (pub_search.length) {
                sorted_pubs.push({ name: 'Theses', pubs: pub_search })
            };

            $scope.sorted_pubs = sorted_pubs

        }, function (response) {
            $scope.error = "No publications found";
        });

    // Open the bibtex modal
    $scope.open = function (pub) {
        var modalInstance = $uibModal.open({
            templateUrl: 'html/bibmodal.html',
            controller: 'BibModalCtrl',
            size: 'lg',
            resolve: {
                text: function () {
                    return setBib(pub);
                }
            }
        }).result.then(function () { }, function (res) { });
    };
}

var app = angular.module('acadApp')

app.controller('PubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function ($scope, $http, $filter, $uibModal) {
        SharedFunc($scope, $http, $filter, $uibModal)
    }
])

app.controller('HTVPubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "camposLearningContinuousPiecewiseLinear2022",
            "aziznejadMeasuringComplexityLearning2023",
            "goujonStableParametrizationContinuous2022"
        ];
        SharedFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])

app.controller('DeepSplinePubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "aziznejadDeepNeuralNetworks2020",
            "bohraLearningActivationFunctions2020"
        ];
        SharedFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])

app.controller('DisneyPubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function ($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "djelouahNeuralInterFrameCompression2019",
            "camposContentAdaptiveOptimization2019",
            "schroersContentAdaptiveOptimization2021",
            "schroersSystemsMethodsReconstructing2021",
            "schroersSystemsMethodsGenerating2021"
        ];
        SharedFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])
