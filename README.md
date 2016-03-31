# Widget Preview

## Introduction
Widget Preview is a widget development utility that enables developers and enthusiasts to preview and browser test their own custom Rise Vision widgets locally from a personal computer.

Widget Preview is currently available for Windows, Mac OS X and Linux.

Widget Preview works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Download
The latest platform specific versions can be downloaded via one of the following links:

- [Windows (32 bit)](http://s3.amazonaws.com/widget-preview-dl/0.3.0/widget-preview-win32.zip) 
- [Windows (64 bit)](http://s3.amazonaws.com/widget-preview-dl/0.3.0/widget-preview-win64.zip) 
- [Mac OSX (32 bit)](http://s3.amazonaws.com/widget-preview-dl/0.3.0/widget-preview-osx32.zip) 
- [Mac OSX (64 bit)](http://s3.amazonaws.com/widget-preview-dl/0.3.0/widget-preview-osx64.zip) 
- [Linux (32 bit)](http://s3.amazonaws.com/widget-preview-dl/0.3.0/widget-preview-linux32.zip)
- [Linux (64 bit)](http://s3.amazonaws.com/widget-preview-dl/0.3.0/widget-preview-linux64.zip)

### Installation
Unzip the package and run the executable named **rv-widget-dev-app** (paths to the executable will differ upon platform). 


## Built With
- [AngularJS](https://angularjs.org/)
- [Bower](http://bower.io/)
- [Gulp](http://gulpjs.com/)
- [npm](https://www.npmjs.org)

## Development

### Dependencies
* [Git](http://git-scm.com/) - Git is a free and open source distributed version control system that is used to manage our source code on Github.
* [npm](https://www.npmjs.org/) & [Node.js](http://nodejs.org/) - npm is the default package manager for Node.js. npm runs through the command line and manages dependencies for an application. These dependencies are listed in the _package.json_ file.
* [Bower](http://bower.io/) - Bower is a package manager for Javascript libraries and frameworks. All third-party Javascript dependencies are listed in the _bower.json_ file.
* [Gulp](http://gulpjs.com/) - Gulp is a Javascript task runner. It lints, runs unit and E2E (end-to-end) tests, minimizes files, etc. Gulp tasks are defined in _gulpfile.js_.

### Local Development Environment Setup and Installation
To make changes to the Preview Widget, you'll first need to install [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

The Preview Widget can now be installed by executing the following command at the command line:
```
git clone https://github.com/Rise-Vision/widget-preview.git
```

### Build
(Note: this only works on Linux & OS X)

Run

```
npm run dev-install
```

### Run Widget Preview as a Node.js Server

Run 
```
npm run dev-install
npm run dev #starts the widget dev server at port 8000
```

Access [http://localhost:8000](http://localhost:8000) to debug widget.

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it.

### Languages
In order to support languages i18n needs to be added to this repository.  Please refer to our Suggested Contributions.

### Suggested Contributions
- We could use i18n Language Support
- We need an improved UI design

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision, please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision, please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Stuart Lees](https://github.com/stulees "Stuart Lees")
