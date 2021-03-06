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
    .factory('RecordingsAPI', ['$resource', function($resource) {

       return {
         recordings: function() {
            return $resource('api/recordings', {}, { get: { method: 'GET', cache: false }});
         },

         favouriteRecording: function() {
            return $resource('api/favourite', {}, { get: { method: 'GET', cache: false }});
         },

         unfavouriteRecording: function() {
            return $resource('api/unfavourite', {}, { get: { method: 'GET', cache: false }});
         },

         setRecordingComment: function() {
            return $resource('api/comment', { comment: '' }, { get: { method: 'GET', cache: false }});
         },

         talkgroups: function() {
            return $resource('api/talkgroups', {}, { get: { method: 'GET', cache: false }});
         },

         radios: function() {
            return $resource('api/radios', {}, { get: { method: 'GET', cache: false }});
         }
       };
    }]);
