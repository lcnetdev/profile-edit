<?php

/**
 * Reached via HTTP GET to /server/list
 * Takes an optional GET parameter 'query'
 * Returns list of profiles whose contents contain the 'query' string,
 * or the entire profile list if the 'query' parameter is not set.
 */

if(!$_SERVER['REQUEST_METHOD'] === 'GET'){
    die("Request is not get");
    return 405;
}

include 'profile.php';

$scanned = array_diff(scandir($profiledir), array('..','.', '.svn'));

$query = isset($_GET['query']) ? $_GET['query'] : null;

$data = [];

foreach($scanned as $filename) {
    $file = fopen($profiledir . '/' . $filename, "r") or die("hi");
    $item = fread($file, filesize($profiledir . '/' . $filename));
    
    if($query) {
        if(strpos($item, $query) !== false) {
            array_push($data, json_decode($item));
        }
    } else {
        array_push($data, json_decode($item));
    }
}

echo json_encode($data);

return 200;
?>
