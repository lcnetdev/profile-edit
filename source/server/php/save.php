<?php

/**
 * Reached via HTTP POST to /server/save
 * Requires POST parameters 'name' and 'json', where 'name' is the name 
 * of the Profile, and 'json' is the contents of the Profile.
 * Saves 'json' to a file with 'name'.
 */

if(!$_SERVER['REQUEST_METHOD'] === 'POST'){
    die("Request is not post");
    return 405;
}

error_log(print_r($_POST, true));
error_log(print_r($_GET, true));

$PROFILE = "/opt/bibframe-8283/bibframe-model/bfweb/static/bfe/static/profiles/bibframe";

$name = $_POST['name'];
$json = $_POST['json'];

if(!file_exists($PROFILE)) {
    mkdir($PROFILE, 0777);
}

$file = fopen($PROFILE . "/" . $name, 'w');

fwrite($file, $json);

fclose($file);

return 200;
?>
