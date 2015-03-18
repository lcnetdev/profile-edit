<?php

/**
 * Reached via HTTP POST to /server/updateTemplateRefs
 * Requires a POST parameter 'template'
 * Adds 'template' to the list of template references on the server,
 * if the template is not already present in the list
 */

if(!$_SERVER['REQUEST_METHOD'] === 'POST'){
    die("Request is not post");
    return 405;
}

$filename = '../../templateRefs/templateRefs';
$list = file($filename);
$cleanList = [];

$newItem = $_POST["template"];

foreach($list as $item) {
    $cleanItem = trim(preg_replace('/\s\s+/', '', $item));
    array_push($cleanList, $cleanItem);
    if(strcmp($cleanItem, $newItem) == 0) {
        return 200;
    }
}

array_push($cleanList, $newItem);

file_put_contents($filename, print_r(implode("\n", $cleanList), true));

return 200;

?>

