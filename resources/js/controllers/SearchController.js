/*
The MIT License (MIT)

Copyright (c) 2014 University of Waterloo Amateur Radio Club

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

angular
    .module('DSDRecordings')
    .controller('SearchController', ['$scope', 'RecordingsAPI', function($scope, RecordingsAPI) {
         $scope.radioIds = [];
         $scope.talkgroupIds = [];

         // Load information
         RecordingsAPI.talkgroups().get(function(talkgroups) {
            talkgroups.$promise.then(function(data) {
               $scope.talkgroupIds = data;
            });
         });

         RecordingsAPI.radios().get(function(radios) {
            radios.$promise.then(function(data) {
               $scope.radioIds = data;
            });
         });

         $scope.settings = [];
         $scope.settings.favourite = "any";
         $scope.settings.minLength = 0.0;
         $scope.settings.sort = "DESC";

         $scope.data = [];
         $scope.data.recordings = [];

         $scope.search = function() {
            $scope.data = [];
            $scope.showResults = false;

            var settings = [];

            settings.favourite = $scope.settings.favourite;
            settings.minLength = $scope.settings.minLength;
            settings.sort = $scope.settings.sort;
            if ($scope.settings.startDate != "") settings.startDate = $scope.settings.startDate;
            if ($scope.settings.endDate != "") settings.endDate = $scope.settings.endDate;
            if ($scope.settings.talkgroup != "") settings.talkgroup = $scope.settings.talkgroup;
            if ($scope.settings.radio != "") settings.radio = $scope.settings.radio;

            RecordingsAPI.recordings().get(settings, function(data) {
               $scope.data = data;
               $scope.showResults = true;
            });
         };
    }]);
