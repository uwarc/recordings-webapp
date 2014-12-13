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
   .controller('RecordingsController', ['$scope', 'RecordingsAPI', function($scope, RecordingsAPI) {
      $scope.radioIds = [];
      $scope.talkgroupIds = [];

      // Load information
      RecordingsAPI.talkgroups().get(function(talkgroups) {
         $scope.talkgroupIds = talkgroups;
      });

      RecordingsAPI.radios().get(function(radios) {
         $scope.radioIds = radios;
      });

      // Functions
      $scope.toggleFavourite = function(recording) {
         if (!recording.favourite) {
            RecordingsAPI.favouriteRecording().get({filename: recording.filename});
         } else {
            RecordingsAPI.unfavouriteRecording().get({filename: recording.filename});
         }// End of if/else

         recording.favourite = !recording.favourite;
      }; // End of toggleFavourite function

      $scope.toggleShowComment = function(recording) {
         recording.showComment = !recording.showComment;
      }; // End of toggleShowComment method

      $scope.setComment = function(recording) {
         RecordingsAPI.setRecordingComment().get({filename: recording.filename, comment: recording.comment});
      }; // End of setComment method

      $scope.prettifyTalkgroupId = function(talkgroupId) {
         talkgroupId = parseInt(talkgroupId);

         if (talkgroupId <= 0) {
            return 'Unknown'
         } else if ($.inArray(talkgroupId, $scope.talkgroupIds)) {
            return $scope.talkgroupIds[talkgroupId];
         } else {
            return talkgroupId;
         }// End of if/else if/else
      }; // End of prettifyTalkgroupId method

      $scope.prettifyRadioId = function(radioId) {
         radioId = parseInt(radioId);

         if (radioId <= 0) {
            return 'Unknown'
         } else if ($.inArray(radioId, $scope.radioIds)) {
            return $scope.radioIds[radioId];
         } else {
            return radioId;
         }// End of if/else if/else
      }; // End of prettifyRadioId method
    }]);
