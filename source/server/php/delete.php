<?php
    /**
     * Reached via HTTP POST or HTTP DELETE to /server/delete
     * Requires a request parameter 'name'.
     * Deletes the file with name from the server if it exists.
     */

    if(!($_SERVER['REQUEST_METHOD'] === 'DELETE' || $_SERVER['REQUEST_METHOD'] === 'POST')){
        die("Request is not delete");
        return 405;
    }

    $fileName = isset($_REQUEST['name']) ? $_REQUEST['name'] : null;

    $profiledir = "../../../../bibframe-model/bfweb/static/bfe/static/profiles/bibframe/"

    $path = $profiledir . $fileName;

    if(isset($fileName) && file_exists($path) && !unlink($path)) {
            throw new Exception("Failed to delete file");
    }
    
    return 200;
?>
