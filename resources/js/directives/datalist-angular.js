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
   .module('combobox.angular', [])
   .directive('combobox', ['$timeout', '$interval', function ($timeout, $interval) {
      return {
         restrict: 'AE',
         scope: {
            bindModel : '=ngModel',
            type: '@',
            options: '=?'
         },
         template: '<input type="{{type}}" list="{{datalistId}}">' +
                     '<datalist id="{{datalistId}}">' +
                        '<option value="{{key}}" ng-repeat="(key, value) in options">{{value}}</option>' +
                     '</datalist>' +
                   '</input>',
         link: function($scope, $element) {
            $scope.datalistId = 'dl' + Math.floor(Math.random() * 100);

            if (!Modernizr.input.list || (parseInt($.browser.version) > 400)) {
               $timeout(function() {
                  $element.find('input').relevantDropdown();
               }, 1000);
            }// End of if
         }
      }
   }]);
