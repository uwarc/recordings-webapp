<?php

/*
The MIT License (MIT)

Copyright (c) 2014 University of Waterloo Amateur Radio Club

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

require_once('Recordings.class.php');

class RecordingsSqlite3 implements Recordings
{
   private $path;
   private $db;

   public function __construct($path = RECORDINGS_PATH, $dbFilename = SQLITE_DATABASE)
   {
      $this->path = $path;
      $this->db = new SQLite3($dbFilename);
      $this->db->busyTimeout(SQLITE_BUSY_TIMEOUT);

      // Create the required tables if they don't exist
      $this->db->query("BEGIN;
                        CREATE TABLE IF NOT EXISTS recordings
                        (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           filename CHAR(255),
                           timestamp UNSIGNED INTEGER,
                           length UNSIGNED INTEGER,
                           rid INT,
                           tgid INT,
                           favourite BOOLEAN NOT NULL CHECK (favourite IN (0,1)),
                           comment TEXT
                        );
                        COMMIT;");
   }// End of constructor method

   public function __destruct()
   {
      $this->db->close();
   }// End of destructor method

   // Return existing recordings
   public function getRecordings($filters = Array())
   {
      if (!$this->db) return FALSE;

      // Create the query based on the information provided in the query
      $stmt = null;
      $start = isset($filters['start']) ? (int)($filters['start']) : -1;
      $max = isset($filters['max']) ? (int)($filters['max']) : 50;

      $sql = "";

      $sql = "SELECT * FROM (SELECT * FROM recordings WHERE 1=1 ";

      if (isset($filters['favourite']))
      {
         if (strtolower($filters['favourite']) == 'yes')
         {
            $sql .= ' AND favourite=1 ';
            $max = PHP_INT_MAX;
         }// End of if
         else if (strtolower($filters['favourite']) == 'no')
         {
            $sql .= ' AND favourite=0 ';
            $max = PHP_INT_MAX;
         }// End of else if
      }// End of if

      if (isset($filters['minLength']))
      {
         $sql .= " AND length >= " . ((int)$filters['minLength']);
      }// End of if

      if (isset($filters['startDate']) && isset($filters['endDate']))
      {
         $startDate = strtotime($filters['startDate']);
         $endDate = strtotime($filters['endDate']);

         $sql .= " AND timestamp >= $startDate AND timestamp <= $endDate ";
         $max = PHP_INT_MAX;
      }// End of if

      $sort = isset($filters['start']) ? "ASC" : "DESC";
      $res_sort = isset($filters['sort']) && strtoupper($filters['sort']) === 'DESC' ? 'DESC' : 'ASC';

      $sql .= " AND id >= $start  ORDER BY timestamp $sort LIMIT 0, $max) tmp ORDER BY tmp.id $res_sort";

      $stmt = $this->db->prepare($sql);

      $res = $stmt->execute();

      $recordings = Array();
      while ($row = $res->fetchArray(SQLITE3_ASSOC))
      {
         $row['favourite'] = $row['favourite'] != 0;
         $row['date'] = date('Y-m-d\TH:i:sO', $row['timestamp']);
         $recordings[] = $row;
      }// End of while

      if ($start == -1 && count($recordings) > 0) $start = $recordings[0]['id'];
      if ($start == -1) $start = 0;
      return Array(
         'recordings' => $recordings,
         'start' => $start,
         'end' => max($start, (count($recordings) > 0) ? $recordings[count($recordings) - 1]['id'] : 0));
   }// End of getRecordings method

   // Adding new recordings
   public function addRecording($filename)
   {
      $str_date = preg_replace('/.*(\d{4})-(\d{2})-(\d{2})-(\d{2}):?(\d{2}):?(\d{2}).*/', '$1-$2-$3 $4:$5:$6', $filename);

      // Get the time of the recording
      // https://www.simonholywell.com/post/2013/12/convert-utc-to-local-time.html
      $utcDate = DateTime::createFromFormat(
          'Y-m-d H:i:s',
          $str_date,
          new DateTimeZone('UTC')
      );

      if (!$utcDate) { return FALSE; }

      // Get the length of the recording
      $length = filesize($this->path . '/' . $filename);
      $length = ($length - 44) / (8000 * 2);
      $length = (float)number_format((float)$length, 2, '.', '');

      $stmt = $this->db->prepare("INSERT INTO recordings (id, filename, timestamp, length, rid, tgid, favourite) VALUES (NULL, :filename, :timestamp, :length, :rid, :tgid, 0)");

      $stmt->bindValue(':filename', $filename);
      $stmt->bindValue(':timestamp', $utcDate->getTimestamp());
      $stmt->bindValue(':length', $length);
      $stmt->bindValue(':rid', -1);
      $stmt->bindValue(':tgid', -1);

      return $stmt->execute() !== FALSE;
   }// End of addRecording method

   // Favourite/Unfavourite recording
   public function favouriteRecording($filename)
   {
      if (!$this->db) return FALSE;

      $stmt = $this->db->prepare("UPDATE recordings SET favourite=1 WHERE filename=:filename");
      $stmt->bindValue(':filename', $filename);
      return $stmt->execute() !== FALSE;
   }// End of favouriteRecording method

   public function unfavouriteRecording($filename)
   {
      if (!$this->db) return FALSE;

      $stmt = $this->db->prepare("UPDATE recordings SET favourite=0 WHERE filename=:filename");
      $stmt->bindValue(':filename', $filename);
      return $stmt->execute() !== FALSE;
   }// End of unfavouriteRecording method

   // Set the comment on a recording
   public function setRecordingComment($filename, $comment = "")
   {
      if (!$this->db) return FALSE;

      $stmt = $this->db->prepare("UPDATE recordings SET comment=:comment WHERE filename=:filename");
      $stmt->bindValue(':filename', $filename);
      $stmt->bindValue(':comment', $comment);
      return $stmt->execute() !== FALSE;
   }// End of setRecordingComment method
}// End of Recordings interface
