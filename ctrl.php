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

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

require_once('classes/RecordingsSQLite3.class.php');
require_once('config.php');

/** Intialize objects **/
$recordings = new RecordingsSQLite3();

if (!isset($argv[0])) die('Sorry, you are not permitted to execute this file.' . PHP_EOL);
if (!isset($argv[1])) die('Usage: php ctrl.php (add-recording|add-all-recordings|clear)' . PHP_EOL);

switch($argv[1])
{
   case 'add-recording':
      if (!isset($argv[2])) die('Must provided the filename of a recording to add.' . PHP_EOL);
      $recordings->addRecording($argv[2]);
      break;

   case 'add-all-recordings':
      echo 'This will add all recordings in ' . RECORDINGS_PATH . ' and my include duplicates. Do you want to continue (Y/n)?' . PHP_EOL;

      $stdin = fopen('php://stdin', 'r');
      $answer = fgets($stdin, 2);
      $answer = rtrim($answer);
      fclose($stdin);

      if ($answer == 'Y' || $answer == 'y')
      {
         echo 'Adding all recordings...';

         $files = Array();
         if ($handle = opendir(RECORDINGS_PATH))
         {
            while (false !== ($entry = readdir($handle)))
            {
               if (is_dir($entry)) continue;

               $str_date = preg_replace('/.*(\d{4})-(\d{2})-(\d{2})-(\d{2}):?(\d{2}):?(\d{2}).*/', '$1-$2-$3 $4:$5:$6', $entry);

               // Get the time of the recording
               // https://www.simonholywell.com/post/2013/12/convert-utc-to-local-time.html
               $utcDate = DateTime::createFromFormat(
                   'Y-m-d H:i:s',
                   $str_date,
                   new DateTimeZone('UTC')
               );

               if (!$utcDate) continue;
               $files[] = Array(
                  'file' => $entry,
                  'timestamp' => $utcDate->getTimestamp()
               );
            }// End of while
         }// End of if

         usort($files, function($a, $b) {
            return $a['timestamp'] > $b['timestamp'];
         });

         foreach ($files as $file)
         {
            echo 'Adding: ' . $file['file'] . PHP_EOL;
            $recordings->addRecording($file['file']);
         }// End of foreach
      }// End of if

      break;

   case 'clear':
      echo 'This will add all recordings in ' . RECORDINGS_PATH . ' and my include duplicates. Do you want to continue (Y/n)?' . PHP_EOL;

      $stdin = fopen('php://stdin', 'r');
      $answer = fgets($stdin, 2);
      $answer = rtrim($answer);
      fclose($stdin);

      if ($answer == 'Y' || $answer == 'y')
      {
         unlink(SQLITE_DATABASE);
      }// End of if
      break;
}// End of switch
