function PubsCtrlFunc($scope, $http, $filter, $uibModal, cite_keys) {

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
        PubsCtrlFunc($scope, $http, $filter, $uibModal)
    }
])

app.controller('HTVPubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "camposLearningContinuousPiecewiseLinear2022",
            "aziznejadMeasuringComplexityLearning2023",
            "goujonStableParametrizationContinuous2022"
        ];
        PubsCtrlFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])

app.controller('DeepSplinesPubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "aziznejadDeepNeuralNetworks2020",
            "bohraLearningActivationFunctions2020"
        ];
        PubsCtrlFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])

app.controller('DisneyPubsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function ($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "djelouahNeuralInterFrameCompression2019",
            "camposContentAdaptiveOptimization2019",
        ];
        PubsCtrlFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])

app.controller('DisneyPatentsCtrl', ['$scope', '$http', '$filter', '$uibModal',
    function ($scope, $http, $filter, $uibModal) {
        const cite_keys = [
            "schroersContentAdaptiveOptimization2021",
            "schroersSystemsMethodsReconstructing2021",
            "schroersSystemsMethodsGenerating2021"
        ];
        PubsCtrlFunc($scope, $http, $filter, $uibModal, cite_keys)
    }
])


const inner_pubs = `
    <!-- initiate list of publications of that type (item in master list) -->
    <ul class="list-group">

                <!-- loop through pubications of that type (each one of this item <li>) -->
        <li class="list-group-item publist_row" ng-repeat="pub in filteredpubs = (pub_info.pubs | orderBy: getDate : true | filter:filter_text)">

            <!-- switch through publication types (set handler for click events and configure type of item) -->
            <span ng-switch on="pub.EntryType" ng-click="showMore = !showMore" >

                            <!-- format for case: unpublished (calling it preprints) -->
                <span ng-switch-when="unpublished">
                    <i class="material-icons pubs-icons">insert_drive_file</i>
                    <span ng-show="pub.Fields.github"> <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>,
                    <span ng-show="pub.Fields.journal"><em>{{pub.Fields.journal}}</em>, </span>
                    <span ng-show="pub.Fields.volume">vol. {{pub.Fields.volume}}, </span>
                    <span ng-show="pub.Fields.number">no. {{pub.Fields.number}}, </span>
                    <span ng-show="pub.Fields.pages">pp. {{pub.Fields.pages}}, </span>
                    {{pub.Fields.year}}
                            </span>
                            <!-- format for case: article -->
                <span ng-switch-when="article">
                    <i class="material-icons pubs-icons">insert_drive_file</i>
                    <span ng-show="pub.Fields.github"> <svg height="40" viewBox="0 0 16 16" version="1.1" width="40" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>,
                    <em>{{pub.Fields.journal}}</em>,
                    <span ng-show="pub.Fields.volume">vol. {{pub.Fields.volume}}, </span>
                    <span ng-show="pub.Fields.number">no. {{pub.Fields.number}}, </span>
                    <span ng-show="pub.Fields.pages">pp. {{pub.Fields.pages}}, </span>
                    {{pub.Fields.year}}
                            </span>
                            <!-- format for case: inproceedings -->
                <span ng-switch-when="inproceedings">
                    <i class="material-icons pubs-icons">insert_drive_file</i>
                    <span ng-show="pub.Fields.github"> <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>, in <em>{{pub.Fields.booktitle}}</em>,
                                        <span ng-show="pub.Fields.pages">pp. {{pub.Fields.pages}},</span> {{pub.Fields.year}}
                </span>
                <!-- format for case: book -->
                <span ng-switch-when="book">
                        <i class="material-icons pubs-icons">book</i>
                        <span ng-show="pub.Fields.github"> <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>, {{pub.Fields.publisher}}, {{pub.Fields.year}}
                </span>
                <!-- format for case: inbook (chapters) -->
                <span ng-switch-when="inbook">
                        <i class="material-icons pubs-icons">book</i>
                        <span ng-show="pub.Fields.github"> <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.chapter}}</strong>, in {{pub.Fields.title}}, pp. {{pub.Fields.pages}}, {{pub.Fields.publisher}}, {{pub.Fields.year}}
                </span>
                <!-- format for case: mastersthesis -->
                <span ng-switch-when="mastersthesis">
                    <i class="material-icons pubs-icons">book</i>
                    <span ng-show="pub.Fields.github"> <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></span>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>, <span ng-if="pub.Fields.type">{{pub.Fields.type}}</span><span ng-if="!pub.Fields.type">Master's thesis</span> at <em>{{pub.Fields.school}}</em>, {{pub.Fields.year}}
                </span>
                <!-- format for case: thesis -->
                <span ng-switch-when="thesis">
                    <i class="material-icons pubs-icons">book</i>
                    {{pub.Fields.author}}, <strong>{{pub.Fields.title}}</strong>, <span ng-if="pub.Fields.type">{{pub.Fields.type}}</span><span ng-if="!pub.Fields.type">Thesis</span> at <em>{{pub.Fields.school}}</em>, {{pub.Fields.year}}
                </span>
                <!-- format for case: phdthesis -->
                <span ng-switch-when="phdthesis">
                    <i class="material-icons pubs-icons">book</i>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>, Ph.D. thesis at <em>{{pub.Fields.school}}</em>, {{pub.Fields.year}}
                </span>
                <!-- format for case: patent -->
                <span ng-switch-when="patent">
                    <i class="material-icons pubs-icons">assignment_turned_in</i>
                    {{pub.Fields.author_noand}}, <strong>{{pub.Fields.title}}</strong>, {{pub.Fields.nationality}} <span ng-if="pub.Fields.type">{{pub.Fields.type}}</span><span ng-if="!pub.Fields.type">Patent</span><span ng-show="pub.Fields.number"> {{pub.Fields.number}}</span>, {{pub.Fields.year}}
                </span>
                <!-- arrow to expand, common to all cases (controlled by showMore variable for each pub) -->
                            <i id="morearrow" class="material-icons pubs-icons color-theme"> {{showMore ? 'arrow_downward' : 'arrow_forward'}} </i> </a>
            </span>

                        <!-- Extra info all pubs may have, show only if available. Abstract, DOI link, arXiv link, URL, slides link, and BibTex reference (always) -->
            <div ng-show="showMore" id="pubhidden">
                <span ng-show="pub.Fields.abstract">
                                    <p style="text-align:justify"><strong>Abstract: </strong>
                                    {{pub.Fields.abstract}} </p>
                                </span>
                <div id="pubButtons">
                    <a class="label pubs-label-theme" ng-show="pub.Fields.doi" href="https://doi.org/{{pub.Fields.doi}}">DOI: {{pub.Fields.doi}}</a>
                    <a class="label pubs-label-theme" ng-show="pub.Fields.eprint" href="https://arxiv.org/abs/{{pub.Fields.eprint}}">arXiv: {{pub.Fields.eprint}} [{{pub.Fields.eprintclass}}]</a>
                    <!-- <a class="label pubs-label-theme" ng-show="pub.Fields.doi" href="https://sci-hub.se/{{pub.Fields.doi}}">SCI-HUB</a> -->
                    <a class="label pubs-label-theme" ng-show="pub.Fields.url" href="{{pub.Fields.url}}">PDF</a>
                    <a class="label pubs-label-theme" ng-show="pub.Fields.slides" href="{{pub.Fields.slides}}">Slides</a>
                    <a class="label pubs-label-theme" ng-show="pub.Fields.github" href="https://github.com/{{pub.Fields.github}}">GitHub</a>
                    <a class="label pubs-label-theme" ng-click="open(pub)">BibTeX</a>
                </div>
            </div>
        </li>
    </ul>
`;

class PubsHeaders extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- error handling BibTex file (empty or bad syntax) -->
            <p ng-show="error" class="bg-danger">No publications found</p>
            
            <!-- loop through publication types -->
            <div class="pub-types" ng-repeat="pub_info in sorted_pubs">

                <!-- header for publication type (hide if none in this type, see header names in pubs.js) -->
                <h4 ng-hide = "!filteredpubs.length">{{pub_info.name}}</h4>
            
                ${inner_pubs}
            </div>
        `;
    }
}

class PubsNoHeaders extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- error handling BibTex file (empty or bad syntax) -->
            <p ng-show="error" class="bg-danger">No publications found</p>
            
            <!-- loop through publication types -->
            <div ng-repeat="pub_info in sorted_pubs">            
                ${inner_pubs}
            </div>
        `;
    }
}

customElements.define('pubs-headers', PubsHeaders);
customElements.define('pubs-no-headers', PubsNoHeaders);
