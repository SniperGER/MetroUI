function indexInParent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;
	for (var i=0; i<children.length; i++) {
		 if (children[i]==node) return num;
		 if (children[i].nodeType==1) num++;
	}
	return -1;
}

var cumulativeOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while(element);

	return {
		top: top,
		left: left
	};
};
function getContrastYIQ(hexcolor){
			hexcolor = hexcolor.replace(/#/g, "");
			var r = parseInt(hexcolor.substr(0,2),16);
			var g = parseInt(hexcolor.substr(2,2),16);
			var b = parseInt(hexcolor.substr(4,2),16);
			var yiq = ((r*299)+(g*587)+(b*114))/1000;
			return (yiq >= 128) ? 'black' : 'white';
		}
function getContrast50(hexcolor){
	return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
}
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

(function(DOMParser) {
	"use strict";
	var DOMParser_proto = DOMParser.prototype
	  , real_parseFromString = DOMParser_proto.parseFromString;

	// Firefox/Opera/IE throw errors on unsupported types
	try {
		// WebKit returns null on unsupported types
		if ((new DOMParser()).parseFromString("", "text/html")) {
			// text/html parsing is natively supported
			return;
		}
	} catch (ex) {}

	DOMParser_proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var doc = document.implementation.createHTMLDocument("")
			  , doc_elt = doc.documentElement
			  , first_elt;

			doc_elt.innerHTML = markup;
			first_elt = doc_elt.firstElementChild;

			if (doc_elt.childElementCount === 1 && first_elt.localName.toLowerCase() === "html") {
				doc.replaceChild(first_elt, doc_elt);
			}

			return doc;
		} else {
			return real_parseFromString.apply(this, arguments);
		}
	};
}(DOMParser));

DOMTokenList.prototype.removemany = function(input) {
	var classValues = input.split(' ');
	var classValuesCount = classValues.length;

	for (var i = 0; i < classValuesCount; i++) {
		if (this.contains(classValues[i])) {
			this.remove(classValues[i]);
		}
	}
};
function scrollTo(element, to, duration) {
	var start = element.scrollTop,
		change = to - start,
		currentTime = 0,
		increment = 20;

	var animateScroll = function(){
		currentTime += increment;
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		element.scrollTop = val;
		if(currentTime < duration) {
			setTimeout(animateScroll, increment);
		}
	};
	animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
Array.prototype.getIndexBy = function (name, value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][name] == value) {
			return i;
		}
	}
};