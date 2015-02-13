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
   .module('waversurfer-js.angular', [])
   .directive('wavesurfer', ['$timeout', '$interval', function ($timeout, $interval) {
      return {
         restrict: 'AE',
         scope: {
            href : '@',
            config: '=?',
            title: '@',
            artist: '@',
            autoplay: '=?',
            finished: '&?'
         },
         template: '<div class="wavesurfer-container">' +
                     '<div class="wavesurfer"></div>' +
                     '<div class="controls">' +
                     '<span class="playPause" ng-hide="playing"><a ng-click="togglePlay()">&#xf04b;</a></span>' +
                     '<span class="playPause" ng-show="playing"><a ng-click="togglePlay()">&#xf04c;</a></span>' +
                     '<span class="info">{{title}} by {{artist}}</span>' +
                     '<span class="status">{{current | number:1}} / {{total | number:1}}</span>' +
                     '</div>' +
                     '</div>',
         link: function($scope, $element) {
            // Defaults
            var defaultConfig = {
               waveColor: '#3d7ad0',
               progressColor: '#245294',
               cursorColor: '#39360d',
               dragSelection: false,
               height: 58,
               scrollParent: false,
               normalize: true
            };

            // Initialize
            $scope.ready = false;
            $scope.playing = false;
            $scope.current = 0;
            $scope.total = 0;

            $scope.wavesurfer = Object.create(WaveSurfer);

            if (!$scope.config) {
               $scope.config = defaultConfig;
            }
            $scope.config.container = $element.find('.wavesurfer').get(0);

            // Register events
            $scope.wavesurfer.on('ready', function() {
               $scope.wavesurfer.seekTo(0);
               $scope.$apply(function() {
                  $scope.ready = true;
                  $scope.total = $scope.wavesurfer.getDuration();
                  $scope.current = $scope.wavesurfer.getCurrentTime();
               });

               if ($scope.autoplay) {
                  $scope.togglePlay();
               }// End of if
            });

            $scope.wavesurfer.on('finish', function() {
               $timeout(function() {
                  $scope.playing = false;
                  $scope.total = $scope.wavesurfer.getDuration();
                  $scope.current = $scope.wavesurfer.getCurrentTime();

                  if ($scope.finished) $scope.finished();
               }, 100);

               $interval.cancel($scope.updateInterval);
            });

            $scope.wavesurfer.on('play', function(progress) {
               $timeout(function() {
                  $scope.playing = true;
               }, 100);

               $scope.updateInterval = $interval(function() {
                  $scope.total = $scope.wavesurfer.getDuration();
                  $scope.current = $scope.wavesurfer.getCurrentTime();
               }, 100);
            });

            // Register functions
            $scope.togglePlay = function() {
               $scope.wavesurfer.playPause();
               $scope.playing = !$scope.playing;
            };

            $scope.$watch('autoplay', function(newValue, oldValue) {
               if (newValue) {
                  $scope.wavesurfer.play();
               }// End of if
            });

            $scope.$on('$destroy', function() {
               if (!(wavesurfer in $scope)) return;
               $scope.wavesurfer.empty();
               $scope.wavesurfer.destroy();
            });

            // Load
            $scope.wavesurfer.init($scope.config);
            $scope.wavesurfer.empty();
            $scope.wavesurfer.load($scope.href);
         }
      }
   }]);
