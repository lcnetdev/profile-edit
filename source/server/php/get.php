<?php

/**
 * Reached via HTTP GET to /server/get.
 * Requires a GET parameter 'filename'
 * Returns the contents of the file with name filename
 * Returns a 404 if the file does not exist
 * 
 * getFile returns the contents of the file as an attachment
 * get simply returns the contents of the file. Use get to display the
 * contents of the file on screen, and getFile for downloads.
 */

if(!$_SERVER['REQUEST_METHOD'] === 'GET'){
    die("Request is not get");
    return 405;
}

$filename = "../../profiles/" . $_REQUEST['filename'] . '.json';

if(!file_exists($filename)) {
    echo("File does not exist");
    return 404;
}

$file = fopen($filename, "r") or die("hi");

echo fread($file, filesize($filename));

return 200;
?>