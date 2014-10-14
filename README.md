#MetroUI 2.0
##Developer Preview 

Welcome to MetroUI
==================

A game-changing mobile app framework, driven by the powerful HTML5 and CSS3.

The key of MetroUI is absolute precision. Every feature, every detail looks and feels the same as Windows and Windows Phone.
Becuause Microsoft released design templates for new Store apps on both platforms, MetroUI has strict guidelines on how to look.

Features
========

MetroUI has almost any features found in Windows 8 and Windows Phone 8, so you can create the app you want without having to struggle through app review guidelines.

MetroUI adapts itself automatically to small screen sizes. Some features may not work as expected, but let's have a look at what features are availabe:

* Buttons
* Switches
* Checkboxes
* Radio Buttons
* Range Inputs
* Input fields (including Text Areas)
* Select fields
* Theme Colors (including Selector)
* Accent Colors (including custom accents and Selector)
* Notoifications
* Alerts + Confirm
* Prompts
* Page Transitions (internal + external loading)

Download & Install
==================

You can either

* download the [master zip](https://github.com/SniperGER/MetroUI/archive/master.zip) or
* clone the repo:

```shell
$ git clone git://github.com/SniperGER/MetroUI.git

```

MetroUI is ready to use, but you can build it yourself if you want to change something.
As MetroUI is built with Grunt.js, you need [Node.js](http://nodejs.org) as a prerequisite. Then you can create your build using these commands:

```shell
$ npm install
$ grunt build
```

You can find the output in `./build`

Using MetroUI
=============

MetroUI requires some third-party libraries, which can all be found in `./js/lib`. When you are creating a website, you need to include all of them. I might decide to merge them into a single library, so that HTTP GET request are reduced.

* jQuery (jquery.js) - DOM Management
* Fastclick.js (fastclick.js) - Eliminated 300ms click delay on mobile devices
* Ellipsis (wrapper.js) - Required for Notifications and Alerts
* IScroll (iscroll.js) - Required for horizontal page scrolling [**Optional**]

Documentation
=============

MetroUI does contain a (yet unfinished) documentation. In fact, the included pages ARE the documentation.
A much simpler documentation will be added here soon.
Documentation also includes application parameters.


**NOTE: This release is a developer preview! There are still bugs. Many things are not yet finished and might change over time.**

**At this time only WebKit (Safari) is fully supported. I didn't have much time to test this with other browsers.**

**Please report any unexpected behaviour to the Issues. It helps me a lot advancing the development and you'll receive a more stable version sooner.**