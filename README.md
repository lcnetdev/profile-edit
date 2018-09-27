# BIBRAME Profile Editor

## Overview
The BIBFRAME Profile Editor was designed to work on the widest range of machines possible. As such, most of the business logic is implemented client-side in JavaScript. This code can run in Chrome, FireFox, IE 8+, and Safari. The AngularJS framework used is the latest in client-side MVC architecture, and provides a clear model for structuring and organizing code. Every effort has been made to follow this structure and document the code, making future modifications as easy as possible.
All of the JavaScript code comes with comments explaining what each bit does. Documentation tools were used to generate documentation for this part of the application automatically. This documentation is available in /source/documentation/jsdoc/. It is also viewable from the web interface at /documentation/jsdoc/. The Editor also contains a help link containing a FAQ section.

## Installation Prerequisites

The Profile Editor is now a submodule of [Recto](http://github.com/lcnetdev/recto), which is an Express-based web service which uses [Verso](http://github.com/lcnetdev/verso) to store data. The PHP files in 1.2 have been removed and have been replaced with api methods in recto, or loopback functions in verso. To use the Profile Editor, Verso should be installed and configured, then Recto should be installed and configured which will install the profile-editor as a submodule.

## Installation

1.	Clone recto w/submodules: `git clone --recursive https://github.com/lcnetdev/recto`
2. cd profile-edit/source
3.	Run 'npm init', and follow the instructions that follow.
4.	Run 'npm install'. This installs everything needed for Grunt to run successfully.
5.	Run 'grunt' to generate the minified javascript and css files that run the site, as well as several files that document the code in the editor.
6.	In index.html, change the 'base' property to the base for your webserver. 

## Data References

Profiles, templates, properties, vocabularies, and ontologies are all stored in the "config" database in Verso. 

## Acknowledgements

Thank you [IndexData](http://indexdata.com/) for your assistance on the latest build!

Contributors:
* [Kirk Hess](https://github.com/kirkhess)
* [Charles Ledvina](https://github.com/cledvina)
* [Wayne Schneider](https://github.com/wafschneider)

## License

As a work of the United States government, this project is in the public domain within the United States.

Additionally, we waive copyright and related rights in the work worldwide through the CC0 1.0 Universal public domain dedication.
