#MetroUI 2.0
##Developer Preview 

Welcome to MetroUI
==================

A game-changing mobile app framework, driven by the powerful HTML5 and CSS3.

The key of MetroUI is absolute precision. Every feature, every detail looks and feels the same as Windows and Windows Phone.
Because Microsoft released design templates for new Store apps on both platforms, MetroUI has strict guidelines on how to look.

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
As MetroUI is built with Grunt and Node, you need [Node.js](http://nodejs.org) as a prerequisite. Then you can create your build using these commands:

```shell
$ npm install
$ grunt build
```

You can find the output in `./build`

Using MetroUI
=============

MetroUI requires some third-party libraries, which can all be found in `./js/lib`. When you are creating a website, you need to include all of them. I might decide to merge them into a single library, so that HTTP GET requests are reduced.

* jQuery (jquery.js) - DOM Management
* Fastclick.js (fastclick.js) - Eliminated 300ms click delay on mobile devices
* Ellipsis (wrapper.js) - Required for Notifications and Alerts
* IScroll (iscroll.js) - Required for horizontal page scrolling [**Optional**]

Documentation
=============

MetroUI does contain a (yet unfinished) documentation. In fact, the included pages ARE the documentation.

This is the Documentation of the JavaScript methods only:
## App Initialization
```javascript
var app = new MetroUI({
	// App parameters
});
```

## Modals
### Alert
Simple Alert that informs the user of something that requires his attention.

*Available in:* Desktop, Phone
```javascript
app.alert(title, message, [okCallback]);
```
`title`: Specifies the Alert's title

`message`: The message that should be displayed

`[okCallback]`: Optional callback when the user clicks OK

### Confirm
Confirm Dialog that confirms the user's action.

*Available in:* Desktop, Phone
```javascript
app.confirm(title, message, [okCallback], [cancelCallback])
```
`title`: Specifies the Alert's title

`message`: The message that should be displayed

`[okCallback]`: Optional callback when the user clicks OK

`[cancelCallback]`: Optional callback when the user clicks Cancel

### Text Prompt
Prompts for an username or any other kind of text.

*Available in:* Desktop, Phone
```javascript
app.prompt(title, message, [okCallback], [cancelCallback])
```
`title`: Specifies the Alert's title

`message`: The message that should be displayed

`[okCallback]`: Optional callback when the user clicks OK

`[cancelCallback]`: Optional callback when the user clicks Cancel

### Password Prompt
Same as Text Prompt, but has an password field instead of a text field.

*Available in:* Desktop, Phone
```javascript
app.modalPassword(title, message, [okCallback], [cancelCallback])
```
`title`: Specifies the Alert's title

`message`: The message that should be displayed

`[okCallback]`: Optional callback when the user clicks OK

`[cancelCallback]`: Optional callback when the user clicks Cancel

### Login Prompt
Combination of both Text Prompt and Password Prompt. Made for Login purposes.

*Available in:* Desktop, Phone
```javascript
app.modalLogin(title, message, [okCallback], [cancelCallback])
```
`title`: Specifies the Alert's title

`message`: The message that should be displayed

`[okCallback]`: Optional callback when the user clicks OK

`[cancelCallback]`: Optional callback when the user clicks Cancel

### Notifications
Displays a notification at the screen's top.

*Available in:* Desktop, Phone
```javascript
app.notify(title, message, [icon], [callback])
```
`title`: Specifies the Notification's title

`message`: The message that should be displayed

`icon`: Icon file that is shown with the Notification

`[okCallback]`: Optional callback when the user interacts with the Notification

## Bars
### Application Bar
#### Open the Application Bar (if available).

*Available in:* Desktop, Phone
```javascript
app.openAppbar();
```

#### Close the Application Bar (if available).

*Available in:* Desktop, Phone
```javascript
app.closeAppbar();
```

#### Toggle the Application Bar (if available).

*Available in:* Desktop, Phone
```javascript
app.toggleAppbar();
```
### Navigation Bar
#### Open the Navigation Bar (if available).

*Available in:* Desktop, Phone
```javascript
app.openNavbar();
```

#### Close the Navigation Bar (if available).

*Available in:* Desktop, Phone
```javascript
app.closeNavbar();
```

#### Toggle the Navigation Bar (if available).

*Available in:* Desktop, Phone
```javascript
app.toggleNavbar();
```

### Open/Close/Toggle both bars at once
```javascript
app.openBars();
app.closeBars();
app.toggleBars();
```

## Theming
### Accent color
Apply a new accent color and save the setting to LocalStorage.

*Available in:* Desktop, Phone
```javascript
app.changeAccent(accentColor);
```
`accentColor`: Any accent color available in Windows Phone

### Background color
Apply a new background color and save the setting to LocalStorage.

*Available in:* Desktop, Phone
```javascript
app.changeTheme(themeColor);
```
`themeColor`: `dark` or `light`

## Page Loading
### Load page from DOM
Load any page that is found in the current DOM.

*Available in:* Desktop, Phone
```javascript
app.loadPage(page, createScroll);
```
`page`: Page with specified `data-page` attribute

`createScroll`: Create IScroll after loading the page (`true`, `false`)

### Load external page
Load any page with a minimal layout from a file on the server.

*Available in:* Desktop, Phone
```javascript
app.loadPageExternal(url);
```
`url`: URL of the file that contains the page

### Navigate back
Navigate back to the last opened page.

*Available in:* Desktop, Phone
```javascript
app.navigateBack();
```
Developer Notice
================
**This release is a developer preview! There are still bugs. Many things are not yet finished and might change over time.**

**At this time only WebKit (Safari) is fully supported. I didn't have much time to test this with other browsers.**

**Please report any unexpected behaviour to the Issues. It helps me a lot advancing the development and you'll receive a more stable version sooner.**