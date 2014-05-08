README.md

#MetroUI
Documentation
(C) 2014 Sniper_GER

##Table of content
####Introduction

+ Required libraries
+ The Metro font
+ Touch support
+ The 'create' function

####UI Elements

+ Buttons
+ Switches
+ Notifications & alerts
+ Lists & accent color lists

####Other stuff

+ Theming support
+ Where is the rest?

##Required libraries

The JavaScript components of MetroUI are based on jQuery, so you will need to include it before anything else. Then you can include MetroUI's JavaScript file. And don't forget to include the CSS file!
```html
<link rel="stylesheet" type="text/css" href="css/MetroUI.css">
	
<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="javascript/MetroUI.js"></script>
```

##The Metro font

As the original Metro fonts, called 'Segoe UI' for Windows 8 and 'Segoe WP' for Windows Phone 8, are distributed via licenses, MetroUI can't just include them so everyone gets their hands on it.<br>Instead, MetroUI uses a font called 'Open Sans' in various font weights, which really looks a lot like Segoe. And the best of it: it is distributed for free via Google Fonts, so we won't get into licensing troubles.<br><br>If you want Open Sans on your site too, just include the following lines in the `<head></head>` region of your HTML and you're good to go. Just make anything use "font-family: 'Open Sans', sans-serif" and one of the font-weights.
```html
<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700' rel='stylesheet' type='text/css'>
```

##Touch support

MetroUI and its components support touch based input. Touch based input removes the annoying 300ms delay on touch devices, so actions are performed instantaneously. It is achieved with two variables setting an event based on the users screen.
```javascript
var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';
```
These lines are included within MetroUI's Javascript component, so you don't have to include them yourself anywhere else. They can also be used for anything you would like to add touch support to.

##The 'create' function

Every MetroUI element is initialized with the 'create' function. It is making any raw element shown on this page (except for lists right now) a working MetroUI element. Using it is extremely simple! Here is an example:
```javascript
MetroUI.create({
	type: "switch",
	id: "switch1",
	active: true,
	startSwitched: false
});
```
This example makes a switch out of the DOM element "#switch1" and assigns it the attribute "data-id=switch1". It is also set to be unswitched at start. Let's have a look on the options you have when creating a MetroUI element:

| argument | type | options | default value | notes |
|----------|------|---------|---------------|-------|
| type | String | "button", "switch", "list", "accentList" | undefined | "list" not supported yet |
| id | String | none | undefined | Specifies jQuery DOM element. Must be unique! |
| active | boolean | true, false | false | Is the element activated on start or not? |
| startSwitched | true, false | false | Only applicable to switches |
| label | String | none | "" | pecify an optional label for a switch |
| callback | function | none | none | What an element has to do after being used |

Every argument that defaults to "undefined" is required, others are optional. The argument 'active' is required if you want your MetroUI element to be usable. Please note that "list" isn't implemented yet, so trying to create elements of this type will be unsuccessful.

##Buttons

Coming now to the real UI elements, starting with Buttons. Buttons are used for temporary interaction, whether in forms or just to run a JavaScript function.
They can easily be inserted using code as shown below.

Example:
```html
<button id="button1" type="button">Button</button><br>
<button id="button2" type="button">Disabled</button>
```
```javascript
MetroUI.create({
	type: 'button',
	id: 'button1',
	active: true,
	callback: function() { $('body').toggleClass("darkBG lightBG") }
});
MetroUI.create({
	type: 'button',
	id: 'button2'
});
```

##Switches

Switches are used, unlike buttons, for long-term interaction, meaning they can change settings for a longer period than buttons.
By default, labeled switches receive a "margin-left" of 160 pixels and the labels themselves a "left" of -160 pixels. If this is not suitable to your page, this can be changed in MetroUI.css.

Example:
```html
<div class="metro checkbox" id="switch1">
	<div class="innerCheckbox"></div>
</div>
<div class="metro checkbox" id="switch2">
	<div class="innerCheckbox"></div>
</div>
<div class="metro checkbox disabled" id="switch3">
	<div class="innerCheckbox"></div>
</div>
```
```javascript
MetroUI.create({
	type: "switch",
	id: "switch1",
	label: "Switch 1"
});
MetroUI.create({
	type: "switch",
	id: "switch2",
	startSwitched: true,
	label: "Switch 2"
});
MetroUI.create({
	type: "switch",
	id: "switch3",
	label: "Disabled"
});
```

##Notifications & alerts
####Notifications
Notifications (so-called "Toasts") provide useful information for a short period of time. They disappear automatically or when a user interacts with them.
There can only be one notification, alert or confirm dialog at once. To create a new one, the old one has to be dismissed first. Only notifications can overlay alerts and confirm dialogs.
Notification triggers can be assigned to buttons, switches or even other JavaScript functions. In the following examples notifications, alerts and confirm dialogs are triggered through buttons. Let's have a look at the code first:

```javascript
MetroUI.notify(sender, message, iconPath);
```
| argument | type | options | default value | notes |
|----------|------|---------|---------------|-------|
| sender | String | none | "" | Sets the notification source to the specified string |
| message | String | none | "" | The message that should be displayed on screen |
| iconPath | String | none | "" | Specifies an notification icon |

####Alerts
Alerts require user interaction. Unlike notifications, alerts are static and will not dismiss until the user decides to do so. They can display warnings or obstacles while trying to change a setting.

```javascript
MetroUI.showAlert(title, message, dismissButton);
```
| argument | type | options | default value | notes |
|----------|------|---------|---------------|-------|
| title | String | none | "" | Sets the alert title to the specified string |
| message | String | none | "" | The message that should be displayed on screen |
| iconPath | String | none | "" | The string that should be displayed on the dismiss button |

####Confirm dialogs
Confirm dialogs are a lot like alerts. They are both static and require user interaction. But confirm dialogs give a user the choice to accept or decline an upcoming change.

```javascript
MetroUI.showConfirm({
	title: "",
	message: "",
	confirmButtonTitle: "",
	confirmButtonAction: function() { },
	abortButtonTitle: ""
});
```
| argument | type | options | default value | notes |
|----------|------|---------|---------------|-------|
| title | String | none | "" | Sets the alert title to the specified string |
| message | String | none | "" | The message that should be displayed on screen |
| confirmButtonTitle | String | none | "" | The string that should be displayed on the confirm button |
| confirmButtonAction | function | none | function() { } | The action that should be performed on confirmation |
| abortButtonTitle | String | none | "" | The string that should be displayed on the abort button |

##Lists & accent color lists
####Lists (not fully done yet)
Lists are an important UI element. They can store multiple items the user can select. When he selects one item, the others are hidden, so that UX (user experience) is not disturbed. In MetroUI, lists are created with the 'create' function.

```javascript
MetroUI.create({
	type: "list",
	id: "list1"
});
```
Lists are one of the few UI elements where the 'active' flag is not required to be set.

####Accent color lists
Accent color lists are just advanced lists, except they do not open themselves and they trigger the accent color panel. From there, you can change the accent color used by MetroUI and other elements.
For more information on theming, see 'theming support'.

```html
<div id="list2"></div>
```
```javascript
MetroUI.create({
	type: "accentList",
	id: "list2"
});
```

##Theming support
Theming is mostly done via accent color lists. You just open them and select a color, and MetroUI takes care of coloring everything. You can also change the current accent color manually, by calling the function "MetroUI.changeAccentColor(newAccentColor)", where newAccentColor is any color included in Windows Phone 8.1. The colors are included in a slightly change version of Metro JS's CSS file, which also supports live tiles (will be included later).

Any element can be set up to have an accent color. Buttons and switches are set up automatically if you have specified a default color in MetroUI's JavaScript component. You can also set up cookies, so users visiting your site don't always have to change the color. There are several CSS classes for you needs: for background colors, text colors and border colors. MetroUI will take care of adding the specified accent colors to those elements.

| CSS class | example | description |
|-----------|---------|-------------|
| .accent | <div class="accent">This container will have a colored background.</div> |  Changes the background color of any element to the specified accent color. |
| .accentColor | <p class="accentColor">This paragraph will be in the specified accent color.</p> | Changes the text color of paragraphs and spans. |
| .accentBorder | <div class="accentBorder">This container will have accented borders.</div> |
| .noColor | <div class="accentBorder teal noColor">This container will have teal borders.</div> | Prevents MetroUI of adding any accent to an element. |

The .noColor class is important if you want your element not to be themed by MetroUI.

Example:
```html
<p class="accentColor">This paragraph is themed by MetroUI.</p>
<p class="accentColor crimson noColor">This paragraph will be crimson.</p>
```

##Where is the rest?
As this is in an early development, things will be added over time. There are some currently planned features:

+ MetroJS integration (partially done)
+ Lists

######(C) 2014 Sniper_GER | For the good of all of us