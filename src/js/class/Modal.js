(function() {
	"use strict";
	MetroUI.Alert = function(app,title,message,callback) {
		if ($$("div.notification-center").length < 1) {
			var notificationCenter = document.createElement("div");
			notificationCenter.className = "notification-center";
			document.body.appendChild(notificationCenter);
		}

		var alertBG = document.createElement("div");
		alertBG.className = "notification-background fade-in";
		alertBG.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBG.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertWrapper = document.createElement("div");
		alertWrapper.classList.add("alert-wrapper");

		var alertBox = document.createElement("div");
		alertBox.className = "alert colored fade-in";
		alertBox.id = "alert";
		alertBox.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBox.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertTitle = document.createElement("div");
		alertTitle.className = "title";
		alertTitle.innerHTML = ((typeof(title)!=="undefined"))?title:"Untitled";
		alertBox.appendChild(alertTitle);

		var alertContent = document.createElement("div");
		alertContent.className = "content";
		alertContent.innerHTML = ((typeof(message)!=="undefined"))?message:"No content.";
		alertBox.appendChild(alertContent);

		var alertButtonContainer = document.createElement("div");
		alertButtonContainer.className = "button-container";
		var okButton = document.createElement("button");
		okButton.className = "colored";
		okButton.innerHTML = app.params.alertConfirmButton;
		okButton.addEventListener("click", function() {
			$("div.notification-background.fade-in").className = "notification-background fade-out";
			$("div.alert.fade-in").className = "alert colored fade-out";

			setTimeout(function() {
				var alertBGChild = $("div.notification-background");
				var alertChild = $("div.alert-wrapper");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);

				if (typeof callback === 'function') {
					callback();
				}
			}, 300);
		});
		alertButtonContainer.appendChild(okButton);
		alertBox.appendChild(alertButtonContainer);
		alertWrapper.appendChild(alertBox);

		document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
		document.getElementsByClassName("notification-center")[0].appendChild(alertWrapper);

		if (window.innerWidth > app.params.mobileWidthLimit) {
			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		} else {
			document.getElementById("alert").parentNode.style.height = document.getElementById("alert").offsetHeight;
		}
	};
	MetroUI.Confirm = function(app,title,message,callback) {
		if ($$("div.notification-center").length < 1) {
			var notificationCenter = document.createElement("div");
			notificationCenter.className = "notification-center";
			document.body.appendChild(notificationCenter);
		}

		var alertBG = document.createElement("div");
		alertBG.className = "notification-background fade-in";
		alertBG.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBG.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertWrapper = document.createElement("div");
		alertWrapper.classList.add("alert-wrapper");


		var alertBox = document.createElement("div");
		alertBox.className = "alert colored fade-in";
		alertBox.id = "alert";
		alertBox.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBox.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertTitle = document.createElement("div");
		alertTitle.className = "title";
		alertTitle.innerHTML = ((typeof(title)!=="undefined"))?title:"Untitled";
		alertBox.appendChild(alertTitle);

		var alertContent = document.createElement("div");
		alertContent.className = "content";
		alertContent.innerHTML = ((typeof(message)!=="undefined"))?message:"No content.";
		alertBox.appendChild(alertContent);

		var alertButtonContainer = document.createElement("div");
		alertButtonContainer.className = "button-container";
		var cancelButton = document.createElement("button");
		cancelButton.className = "";
		cancelButton.innerHTML = app.params.alertCancelButton;
		cancelButton.addEventListener("click", function() {
			$("div.notification-background.fade-in").className = "notification-background fade-out";
			$("div.alert.fade-in").className = "alert colored fade-out";

			setTimeout(function() {
				var alertBGChild = $("div.notification-background");
				var alertChild = $("div.alert-wrapper");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);
			}, 300);
		});
		alertButtonContainer.appendChild(cancelButton);
		var okButton = document.createElement("button");
		okButton.className = "colored inline";
		okButton.innerHTML = app.params.alertConfirmButton;
		okButton.addEventListener("click", function() {
			$("div.notification-background.fade-in").className = "notification-background fade-out";
			$("div.alert.fade-in").className = "alert colored fade-out";

			setTimeout(function() {
				var alertBGChild = $("div.notification-background");
				var alertChild = $("div.alert-wrapper");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);

				if (typeof callback === 'function') {
					callback();
				}
			}, 300);
		});

		alertButtonContainer.appendChild(okButton);
		alertBox.appendChild(alertButtonContainer);
		alertWrapper.appendChild(alertBox);

		document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
		document.getElementsByClassName("notification-center")[0].appendChild(alertWrapper);

		if (window.innerWidth > app.params.mobileWidthLimit) {
			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		} else {
			document.getElementById("alert").parentNode.style.height = document.getElementById("alert").offsetHeight;
		}
	};

	MetroUI.prototype.alert = function(title,message,callback) {
		new MetroUI.Alert(this,title,message,callback);
	};
	MetroUI.prototype.confirm = function(title,message,callback) {
		new MetroUI.Confirm(this,title,message,callback);
	};
})();