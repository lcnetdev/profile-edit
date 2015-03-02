<?php

/*if(!$_SERVER['REQUEST_METHOD'] === 'POST'){
    die("Request is not post");
    return 405;
}*/

/**
 * Reached via HTTP request to /server/import
 * Requires the $_FILES array to be set, and $_FILES['file']['tmp_name'] to be set
 * Returns the contents of the file in $_FILES as a string
 */

$content = file_get_contents($_FILES['file']['tmp_name']);

if(isset($content)) {
    echo $content;
}

return 200;
?>
