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

include './profile.php';

$name = $_POST['name'];
$json = $_POST['json'];

if(!file_exists($profiledir)) {
    mkdir($profiledir, 0777);
}

$file = fopen($profiledir . "/" . $name, 'w');

fwrite($file, $json);

fclose($file);

return 200;
?>
