		app.notify = function(title,message,callback) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
				var notificationCenter = document.createElement("div");
				notificationCenter.className = "notification-center";
				document.body.appendChild(notificationCenter);
			}
			for (var i=0; i<document.querySelectorAll("div.notification-wrapper").length;i++) {
				var el = document.querySelectorAll("div.notification-wrapper")[i];
				if (el) {
					el.style.top = 20 + ((document.querySelectorAll("div.notification-wrapper").length-i)*100) + "px";
				}
			}

			var notificationWrapper = document.createElement("div");
			notificationWrapper.className = "notification-wrapper";

			var notification = document.createElement("div");
			notification.className = ((app.params.notificationTransitions))?"notification slide-in":"notification";
			notification.addEventListener(app.touchEventStart, function() {
				this.style.webkitTransform = "rotateY(-7deg)";
			});
			notification.addEventListener("mouseover", function() {
				clearTimeout(app.notificationTimeouts[this.id]);
				app.notificationTimeouts[this.id] = undefined;
				this.classList.remove("slide-in");
				this.classList.remove("fade-out");
			});
			notification.addEventListener("mouseup", function() {
				this.removeAttribute("style");
				var parent = this.parentNode;
				this.className = ((app.params.notificationTransitions))?"notification slide-out":"notification";

				setTimeout(function() {
					parent.parentNode.removeChild(parent);
					for (var i=0; i<document.querySelectorAll("div.notification-wrapper").length;i++) {
						var el = document.querySelectorAll("div.notification-wrapper")[i];
						if (el) {
							el.style.top = 20 + ((document.querySelectorAll("div.notification-wrapper").length-(i+1))*100) + "px";
						}
					}
					if (typeof callback === 'function') {
						callback();
					}
				}, ((app.params.notificationTransitions))?300:0);
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
					for (var i=0; i<document.querySelectorAll("div.notification-wrapper").length;i++) {
						var el = document.querySelectorAll("div.notification-wrapper")[i];
						if (el) {
							el.style.top = 20 + ((document.querySelectorAll("div.notification-wrapper").length-(i+1))*100) + "px";
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

			document.getElementsByClassName("notification-center")[0].appendChild(notificationWrapper);
			
			setTimeout(function() {
				var el = document.querySelector("div.notification-center div.notification-wrapper:last-child div.content");
				var elNot = document.querySelector("div.notification-center div.notification-wrapper:last-child div.notification");
				var ellipsis = new Ellipsis(el);
				
				ellipsis.calc();
				ellipsis.set();
				
				elNot.id = app.notificationTimeouts.length;
				app.notificationTimeouts.push(setTimeout(function() {
					elNot.classList.add("fade-out");
					setTimeout(function() {
						elNot.parentNode.parentNode.removeChild(elNot.parentNode);
					}, 3000);
				}, 5000));
			}, 10);
		};
		app.alert = function(title,message,callback) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
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

			var alertBox = document.createElement("div");
			alertBox.className = "alert fade-in";
			alertBox.id = "alert";
			alertBox.addEventListener("mousewheel", function(e) {
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
			okButton.innerHTML = "ok";
			okButton.addEventListener("click", function() {
				document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
				document.querySelector("div.alert.fade-in").className = "alert fade-out";

				setTimeout(function() {
					var alertBGChild = document.querySelector("div.notification-background");
					var alertChild = document.querySelector("div.alert");

					alertBGChild.parentNode.removeChild(alertBGChild);
					alertChild.parentNode.removeChild(alertChild);

					if (typeof callback === 'function') {
						callback();
					}
				}, 200);
			});
			alertButtonContainer.appendChild(okButton);
			alertBox.appendChild(alertButtonContainer);

			document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
			document.getElementsByClassName("notification-center")[0].appendChild(alertBox);

			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		};
		app.confirm = function(title,message,callback) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
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

			var alertBox = document.createElement("div");
			alertBox.className = "alert fade-in";
			alertBox.id = "alert";
			alertBox.addEventListener("mousewheel", function(e) {
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
			cancelButton.innerHTML = "cancel";
			cancelButton.addEventListener("click", function() {
				document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
				document.querySelector("div.alert.fade-in").className = "alert fade-out";

				setTimeout(function() {
					var alertBGChild = document.querySelector("div.notification-background");
					var alertChild = document.querySelector("div.alert");

					alertBGChild.parentNode.removeChild(alertBGChild);
					alertChild.parentNode.removeChild(alertChild);
				}, 200);
			});
			alertButtonContainer.appendChild(cancelButton);
			var okButton = document.createElement("button");
			okButton.className = "colored inline";
			okButton.innerHTML = "ok";
			okButton.addEventListener("click", function() {
				document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
				document.querySelector("div.alert.fade-in").className = "alert fade-out";

				setTimeout(function() {
					var alertBGChild = document.querySelector("div.notification-background");
					var alertChild = document.querySelector("div.alert");

					alertBGChild.parentNode.removeChild(alertBGChild);
					alertChild.parentNode.removeChild(alertChild);

					if (typeof callback === 'function') {
						callback();
					}
				}, 200);
			});
			alertButtonContainer.appendChild(okButton);

			alertBox.appendChild(alertButtonContainer);

			document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
			document.getElementsByClassName("notification-center")[0].appendChild(alertBox);

			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		};
