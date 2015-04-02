*BIBRAME Editor Documentation*

Overview

The BIBFRAME Editor was designed to work on the widest range of machines possible. As such, most of the Editor's business logic is implemented client-side in JavaScript. This code can run in Chrome, FireFox, IE 8+, and Safari. The AngularJS framework used is the latest in client-side MVC architecture, and provides a clear model for structuring and organizing code. Every effort has been made to follow this structure and document the code, making future modifications as easy as possible.
All of the JavaScript code comes with comments explaining what each bit does. Documentation tools were used to generate documentation for this part of the application automatically. This documentation is available in /source/documentation/jsdoc/. It is also viewable from the web interface at /documentation/jsdoc/. The Editor also contains a help link containing a FAQ section.
There is a small amount of server-side logic in the application that mainly handles storing profiles, template references and vocabularies on the server. This was written in PHP and set up to run on an Apache web server. This code is explained below under the sub-heading 'Server Dependent Files'.

Installation Prerequisites

Users should already have npm (documentation can be found at https://www.npmjs.com/package/npm), and Apache installed (documentation can be found at http://httpd.apache.org/) with PHP 5.4 or higher (documentation can be found at http://php.net/). These instructions further assume that the user is familiar with the Linux command line. Some syntax may need to be changed for a Windows environment.
Server Dependent files
The files located in /source/server/php all handle server-side processing, and are thus dependent on the server architecture. Each file is described below with its purpose, expected inputs and output.
•	delete.php responds to an HTTP DELETE or POST with a 'name' parameter. The script deletes the file with 'name' if it exists, and returns a 200 status code. If the HTTP verb is not DELETE or POST, the server returns a 405 error code.
•	get.php responds to an HTTP GET request with a 'filename' parameter. It returns the contents of the file 'filename' as a string if the file exists, and 200 status code. If the file does not exist, it returns a 404 error code. If the request is not a GET, it returns a 405 status code.
•	getFile.php responds to an HTTP GET request with a 'name' parameter. It returns the contents of the file 'name' as a file download if the file exists, and a 200 status code. It returns a 404 error code if the file does not exist, and a 405 error code if the request is not a GET.
•	getTemplateRefs.php responds to an HTTP GET request containing no parameters. It returns a json encoded string of the template references on the server, and 200 status code. If the request is not a GET, it returns a 405 error code.
•	import.php responds to an HTTP request with a $_FILES array. It returns the contents of the file sent as a string with a 200 status code. The file sent is located at $_FILES['file']['tmp_name'].
•	list.php responds to an HTTP GET request with an optional 'query' parameter. It returns a list of profiles whose contents contain the 'query' string, or the entire profile list if 'query' is not set. In either case it returns a 200 status code. If the request is not a GET, it returns a 405 error code.
•	save.php responds to an HTTP POST request containing both 'name' and 'json' parameters. It saves the contents of 'json' to a file 'name'. It returns a 200 status code on success. If the request is not a POST, it returns a 405 error code.
•	updateTemplateRefs.php responds to an HTTP POST request with a 'template' parameter. It adds 'template' to the list of template references if it does not already exist, and returns a 200 status code. If the request is not a POST, it returns a 405 error code.
In addition to the files listed above, the /source/server directory contains a file .htaccess. This file is read by Apache, and handles URL re-writing on the server. This makes it possible to extend the app to run on multiple servers without changing the client-side code. It also enables cleaner, more meaning URLs for the user.

Installation
1.	Download the source code into the desired directory.
2.	Open a command line terminal, and navigate to the project's source folder
3.	Ensure that the permissions on all files are 775. (On Linux sudo chmod 775 -R .)
4.	Ensure that Apache is the owner of the files. (On Linux sudo chown apache -R .)
5.	Run 'npm init', and follow the instructions that follow.
6.	Run 'npm install'. This installs everything needed for Grunt to run successfully.
7.	Run 'npm install angular-local-storage'. This installs a library for local storage that uses cookies as a backup on older browsers.
8.	Run 'grunt' to generate the minified javascript and css files that run the site, as well as several files that document the code in the editor.
9.	Set up a virtual host for Apache that points the DocumentRoot to the source folder, and sets AllowOverride to All. If the Editor exists in a folder call /project, the Apache configuration would be as follows:
		<VirtualHost *:80>
			ServerName: yourdomain.com
			DocumentRoot /project/source
		</VirtualHost>
		<Directory /project/source>
			AllowOverride All
		</Directory>
10.	Restart Apache.

Vocab-List
Vocabulary list files may be stored at any place on the server but for testing purposes were placed in /server using a .rdf extension. In order for the application to identify the location of a vocabulary file, vocabList.json is used to map the file with a name.
	VocabList.json uses the json format to handle the mapping, a look at the file will see:
		{“key”: “MADSRDF”, “value”: “/server/v1.rdf”}
This is the format that the application will expect. “key” refers to the name that will appear in the application when you go to choose a resource or property template. “value” is the file path that the application will use. If the application cannot find the file the site will report it in the browser's console and will ignore the file.
Template Reference
A file that should be of note is /templateRefs/templateRefs . This file is used to hold the template values that are used most often for the templates that are created. The application will create this file on its own and should not have to be touched, examining the file will show that it stores a list of template references.

Troubleshooting
Although every effort has been made to ensure that the Editor can be easily installed and run, we recognize that errors do occasionally happen. Should you have problems installing or running the Editor, the following steps will resolve most errors quickly.
1.	Ensure Apache is the owner of all the files. The command 'ls -al' will display the files in a folder with their owner and permissions. The third and fourth columns list the owner and group, respectively. As long as Apache is the owner, or in the group, the site should work correctly.
2.	Ensure that the permissions for all the files are 775. Running 'ls -al' will list the files in a folder with their owner and permissions. The first column is the permissions. 775 corresponds to 'rwxrwxr-x'.
3.	Ensure that Apache is pointed to the source folder. Step 14 of the installation instructions provides an example of the Apache host configuration file. On linux, these files are typically located at /etc/httpd/conf.d/
4.	Ensure that Apache is aware of the new host. Modifying the host configuration requires restarting Apache before the changes take effect. The command for restarting Apache varies by operating system and version, but 'sudo service httpd restart' usually works.
5.	Ensure that all dependencies are installed in package.json. These include 'grunt', 'grunt-contrib-cssmin', 'grunt-contrib-uglify', 'grunt-ng-annotate', 'grunt-plato', 'grunt-jsdoc' and 'grunt-ngdocs'. If any of these dependencies is missing, run 'npm install {{missing dependency}} –save-dev' from the command line in the source folder.
6.	Ensure that the minified javascript and css files were properly created. Running 'grunt' from the command line in the source folder should generate these files for you. If you receive any errors, see step 4 for how to resolve them. Plato will return an error the first time it is run. This will have no effect on the Editor. You may also check that the minified files exist in /source/assets/js/dist/US-LOC-ProfileEditor.min.js and /source/assets/css/dist/US-LOC-ProfileEditor.min.css.
