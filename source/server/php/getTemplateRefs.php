<?php

/**
 * Reached via HTTP GET to /server/getTemplateRefs
 * Requires no GET parameters
 * Returns the list of template references stored on the server
 */

if(!$_SERVER['REQUEST_METHOD'] === 'GET'){
    die("Request is not get");
    return 405;
}

$filename = '../../templateRefs/templateRefs';
$list = file($filename);
$cleanList = [];

foreach($list as $item) {
    array_push($cleanList, trim(preg_replace('/\s\s+/', '', $item)));
}

echo json_encode($cleanList);

return 200;
?>