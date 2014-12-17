# Rapid Widget Development App (RWDA)  [![Circle CI](https://circleci.com/gh/Rise-Vision/widget-preview/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/widget-preview/tree/master)

## Introduction
Rapid Widget Development App (RWDA) is a widget development utility that enables developers and enthusiasts to develop their own custom Rise Vision widgets from a personal computer.

RWDA is currently available for Windows, Mac OS X and Linux.

RWDA works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Built With
- NPM (node package manager)
- AngularJS
- Gulp
- Bower

## Development

### Download
The latest versions can be downloaded via one of these addresses:
http://192.254.220.36/~rvi/widget-preview/

* Windows (32 bit): 
* Mac OS X: 
* Linux:

### Installation
Unzip the package and run the executable nw (or nw.exe if you are on Windows). 

### Build
(Note: this only works on Linux & OS X)

Run

```bash
npm run dev-install
```

### Run RWDA as a Node.js Server

Run 
```bash
npm run dev-install
npm run dev #starts the widget dev server at port 8000
```

Access [http://localhost:8000](http://localhost:8000) to debug widget.

### Dependencies
* **Gulp** - is used as a task runner. It lints, runs unit tests and E2E (end to end) tests, minimizes files, etc.  all dependencies for this is in the gulp.js file.
* **Bower** - is used as a package manager for javascript libraries and frameworks. All third-party javascript frameworks and libraries are listed as dependencies in the bower.json file.
* **NPM & Nodejs** - the node package manager is used in hand in hand with gulp to start a server to host the app and all the dependencies needed from using a node server. All these node dependencies are listed in the package.json file


## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it

### Languages
In order to support languages i18n needs to be added to this repository.  Please refer to our Suggested Contributions.

### Suggested Contributions
- We could use i18n Language Support
- We need an improved UI design

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Stuart Lees](https://github.com/stulees "Stuart Lees")
