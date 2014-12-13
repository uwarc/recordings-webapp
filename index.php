<?php
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

require_once('config.php');
require_once('classes/RecordingsSQLite3.class.php');

$recordings = new RecordingsSQLite3();

/* Path */
$request_uri = parse_url(str_replace(APP_BASE, '', $_SERVER['REQUEST_URI']));
$request = explode('/', (!empty($request_uri['path']) ? $request_uri['path'] : 'home'));

$raw_params = isset($request_uri['query']) ? explode('&', $request_uri['query']) : Array();

$params = Array();
foreach ($raw_params as $raw_param)
{
   $raw = explode('=', $raw_param);
   $params[$raw[0]] = urldecode($raw[1]);
}// End of foreach

switch($request[0])
{
   case 'recording':
      header('content-type: audio/x-wav');
      header("Content-Length: " . filesize(RECORDINGS_PATH . '/' . $request[1]));
      readfile(RECORDINGS_PATH . '/' . $request[1]);
      break;

   case 'resources':
   case 'views':
   case 'partials':
      header('HTTP/1.0 404 Not Found');
      break;

   case 'api':
      $endpoint = $request[1];

      switch($endpoint)
      {
         case 'recordings':
            header('content-type: application/json');
            echo json_encode($recordings->getRecordings($params));
            break;

         case 'favourite':
            $recordings->favouriteRecording($params['filename']);
            break;

         case 'unfavourite':
            $recordings->unfavouriteRecording($params['filename']);
            break;

         case 'comment':
            $recordings->setRecordingComment($params['filename'], isset($params['comment']) ? $params['comment'] : '');
            break;

         case 'talkgroups':
            echo json_encode($recordings->getTalkgroups(), JSON_FORCE_OBJECT);
            break;

         case 'radios':
            echo json_encode($recordings->getRadios(), JSON_FORCE_OBJECT);
            break;
      }// End of switch

      break;

   default:
      echo file_get_contents("app.html");
}// End of switch

?>
