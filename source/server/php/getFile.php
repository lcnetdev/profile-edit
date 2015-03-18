<?php

/**
 * Reached via HTTP GET to /server/getFile
 * Requires a GET parameter 'name'
 * Echoes the contents of the file with name 'name' as an attachment
 * Returns a 404 if the file is not found.
 * 
 * getFile returns the contents of the file as an attachment
 * get simply returns the contents of the file. Use get to display the
 * contents of the file on screen, and getFile for downloads.
 */

if(!$_SERVER['REQUEST_METHOD'] === 'GET'){
    die("Request is not get");
    return 405;
}

$PROFILE = "../../profiles";

if(file_exists($PROFILE . "/". $_GET['name'])) {
    header("Content-Type: application/json");
    header('Content-Disposition: attachment; filename="' . $_GET['name'] . '"');
    echo file_get_contents($PROFILE . "/". $_GET['name'] . "_tmp");
    unlink($PROFILE . "/". $_GET['name'] . "_tmp");
    return 200;
} else {
    header("HTTP/1.0 404 Not Found");
    echo "404 - File not found";
    return 404;
}

?>