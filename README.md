# BIBRAME Profile Editor

## Overview
The BIBFRAME Profile Editor was designed to work on the widest range of machines possible. As such, most of the business logic is implemented client-side in JavaScript. This code can run in Chrome, FireFox, IE 8+, and Safari. The AngularJS framework used is the latest in client-side MVC architecture, and provides a clear model for structuring and organizing code. Every effort has been made to follow this structure and document the code, making future modifications as easy as possible.
All of the JavaScript code comes with comments explaining what each bit does. Documentation tools were used to generate documentation for this part of the application automatically. This documentation is available in /source/documentation/jsdoc/. It is also viewable from the web interface at /documentation/jsdoc/. The Editor also contains a help link containing a FAQ section.
There is a small amount of server-side logic in the application that mainly handles storing profiles, template references and vocabularies on the server. This was written in PHP and set up to run on an Apache web server. This code is explained below under the sub-heading 'Server Dependent Files'.

## Installation Prerequisites

The Profile Editor is now a submodule of [Recto](http://github.com/lcnetdev/recto), which is an Express-based web service which uses [Verso](http://github.com/lcnetdev/verso) to store data. The PHP files in 1.2 have been removed and have been replaced with node.js functions. Verso should be installed and configured, then Recto should be installed and configured, and `git submodule update` will install the profile-editor.

## Installation

1.	In recto, run git submodule update.
2. 	cd profile-edit/source
3.	Run 'npm init', and follow the instructions that follow.
4.	Run 'npm install'. This installs everything needed for Grunt to run successfully.
5.	Run 'npm install angular-local-storage'. This installs a library for local storage that uses cookies as a backup on older browsers.
6.	Run 'grunt' to generate the minified javascript and css files that run the site, as well as several files that document the code in the editor.
7.	In index.html, change the 'base' property to the base for your webserver. 

## Data References

Profiles, templates, properties, vocabularies, and ontologies are all stored in the "config" database in Verso. 

## Acknowledgements

Thank you [IndexData](http://indexdata.com/) for your assistance on the latest build!

Contributors:
* [Kirk Hess](https://github.com/kirkhess)
* [Charles Ledvina](https://github.com/cledvina)
* [Wayne Schneider](https://github.com/wafschneider)
