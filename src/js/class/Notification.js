(function() {
	"use strict";
	MetroUI.Notification = function(app,title,message,callback) {
		if ($$("div.notification-center").length < 1) {
			var notificationCenter = document.createElement("div");
			notificationCenter.className = "notification-center";
			document.body.appendChild(notificationCenter);
		}

		var notificationWrapper = document.createElement("div");
		notificationWrapper.className = "notification-wrapper";

		var notification = document.createElement("div");
		notification.className = ((app.params.notificationTransitions))?"notification slide-in":"notification";
		notification.addEventListener(app.touchEventStart, function() {
			if (!window.isPhone) {
				this.style.webkitTransform = "rotateY(-7deg)";
			}
		});
		notification.addEventListener("mouseover", function() {
			clearTimeout(app.notificationTimeouts[this.id]);
			clearTimeout(app.notificationRemoveTimeouts[this.id]);
			app.notificationTimeouts[this.id] = undefined;
			app.notificationRemoveTimeouts[this.id] = undefined;
			this.classList.remove("slide-in");
			this.classList.remove("fade-out");
		});
		notification.addEventListener("mouseout", function() {
			var el = this;
			if (!el.classList.contains("slide-out")) {
				app.notificationTimeouts[el.id] = setTimeout(function() {
					el.classList.add("fade-out");
					app.notificationRemoveTimeouts[el.id] = setTimeout(function() {
						el.parentNode.parentNode.removeChild(el.parentNode);

						app.notificationTimeouts[el.id] = undefined;
						app.notificationRemoveTimeouts[el.id] = undefined;

						if (app.notifyTimeoutsDone()) {
							app.notificationTimeouts = [];
							app.notificationRemoveTimeouts = [];
						}
					}, ((!window.isPhone))?3000:300);
				}, 5000);
			}
		});
		notification.addEventListener("click", function() {
			this.removeAttribute("style");

			var elNot = this;
			var parent = this.parentNode;
			setTimeout(function() {
				elNot.className = ((app.params.notificationTransitions))?"notification slide-out":"notification";

				setTimeout(function() {
					parent.parentNode.removeChild(parent);
					for (var i=0; i<$$("div.notification-wrapper").length;i++) {
						var el = $$("div.notification-wrapper")[i];
						if (el && !window.isPhone) {
							el.style.top = 20 + (($$("div.notification-wrapper").length-(i+1))*100) + "px";
						}
					}
					if (typeof callback === 'function') {
						callback();
					}
				}, ((app.params.notificationTransitions))?300:0);
			}, 300);
		});

		var notificationClose = document.createElement("div");
		notificationClose.className = "close-box";
		notificationClose.addEventListener(app.touchEventStart, function() {
			var el = this;
			setTimeout(function() {
				var top = el.parentNode.style.top;
				el.parentNode.removeAttribute("style");
				el.parentNode.style.top = top;
			}, 0);
		});
		notificationClose.addEventListener("mouseup", function() {
			var parent = this.parentNode.parentNode;
			this.parentNode.className = ((app.params.notificationTransitions))?"notification slide-out":"notification";

			setTimeout(function() {
				for (var i=0; i<$$("div.notification-wrapper").length;i++) {
					var el = $$("div.notification-wrapper")[i];
					if (el) {
						el.style.top = 20 + (($$("div.notification-wrapper").length-(i+1))*100) + "px";
					}
				}
			}, ((app.params.notificationTransitions))?300:0);
		});
		notification.appendChild(notificationClose);

		var notificationTitle = document.createElement("div");
		notificationTitle.className = "title";
		notificationTitle.innerHTML = ((typeof(title)!=="undefined"))?title:app.params.modalDefaultTitle;
		notification.appendChild(notificationTitle);

		var notificationContent = document.createElement("div");
		notificationContent.className = "content";
		var notificationContentText = document.createElement("p");
		notificationContentText.innerHTML = ((typeof(message)!=="undefined"))?message:"No content";
		notificationContent.appendChild(notificationContentText);
		notification.appendChild(notificationContent);
		notificationWrapper.appendChild(notification);

		if ($$("div.notification-wrapper").length > 0) {
			for (var i=0; i<$$("div.notification-wrapper").length;i++) {
				var el = $$("div.notification-wrapper")[i];
				if (!window.isPhone) {
					el.style.top = 20 + (($$("div.notification-wrapper").length-i)*100) + "px";
				}
			}
		}


		document.getElementsByClassName("notification-center")[0].appendChild(notificationWrapper);
		setTimeout(function() {
			var el = $("div.notification-center div.notification-wrapper:last-child div.content");
			var elNot = $("div.notification-center div.notification-wrapper:last-child div.notification");
			var ellipsis = new Ellipsis(el);

			ellipsis.calc();
			ellipsis.set();

			elNot.id = app.notificationTimeouts.length;
			app.notificationTimeouts.push(setTimeout(function() {
				if ($("div.notification-center div.notification-wrapper:last-child div.notification")) {
					elNot.classList.add("fade-out");
				}
				app.notificationRemoveTimeouts.push(setTimeout(function() {
					if ($("div.notification-center div.notification-wrapper:last-child div.notification") && $("div.notification-center div.notification-wrapper:last-child div.notification").parentNode) {
						elNot.parentNode.parentNode.removeChild(elNot.parentNode);
					}

					app.notificationTimeouts[elNot.id] = undefined;
					app.notificationRemoveTimeouts[elNot.id] = undefined;

					if (app.notifyTimeoutsDone()) {
						app.notificationTimeouts = [];
						app.notificationRemoveTimeouts = [];
					}
				}, ((!window.isPhone))?3000:300));
			}, 5000));
		}, 10);
		return notificationWrapper;
	};
	MetroUI.notifyTimeoutsDone = function() {
		for (var i=0; i<app.notificationTimeouts.length; i++) {
			if (app.notificationTimeouts[i] !== undefined) {
				return false;
			}
		}
		return true;
	};
	MetroUI.prototype.notify = function(title,message,callback) {
		new MetroUI.Notification(this,title,message,callback);
	};
})();
