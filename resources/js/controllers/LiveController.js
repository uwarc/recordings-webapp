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
   .controller('LiveController', ['$scope', 'RecordingsAPI', '$interval', '$timeout', function($scope, RecordingsAPI, $interval, $timeout) {
      $scope.data = [];
      $scope.data.recordings = [];
      $scope.autoplayIndex = 0;
      $scope.autoplay = true;
      $scope.max = 50;

      RecordingsAPI.recordings().get({ max: $scope.max }, function(data) {
         $scope.data = data;
         $scope.autoplayIndex = $scope.data.recordings.length;

         $scope.newRecordingsInterval = $interval(function() {
            RecordingsAPI.recordings().get({ start: $scope.data.end + 1, max: $scope.max }, function(data) {
               if (data.recordings.length == 0) return;

               var oldLength = $scope.data.recordings.length;
               $scope.data.end = data.end;

               for (var x in data.recordings) {
                  $scope.data.recordings.push(data.recordings[x]);
               }// End of for

               if ($scope.autoplay) {
                  $timeout(function() {
                     if (oldLength == $scope.autoplayIndex) {
                        $scope.data.recordings[$scope.autoplayIndex].autoplay = true;
                     }
                  }, 1000);
               } else {
                  $scope.autoplayIndex = $scope.data.recordings.length;
               }// End of if/else
            });
         }, 5000);
      });

      $scope.finishedPlayingRecording = function(recording) {
         if ($scope.autoplay && $scope.data.recordings.indexOf(recording) == $scope.autoplayIndex) {
            recording.autoplay = false;
            $scope.autoplayIndex += 1;

            if ($scope.autoplayIndex < $scope.data.recordings.length) {
               $timeout(function() {
                  $scope.data.recordings[$scope.autoplayIndex].autoplay = true;
               }, 1000);
            }// End of if
         }// End of if
      };

      $scope.$on('$destroy', function() {
         if ($scope.newRecordingsInterval) {
            $interval.cancel($scope.newRecordingsInterval);
         }// End of if
      });
   }]);
