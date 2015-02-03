		app.preloader = function(title, duration) {
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
			alertBox.className = "alert preloader colored fade-in";
			alertBox.id = "alert";
			alertBox.addEventListener("mousewheel", function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			var alertTitle = document.createElement("div");
			alertTitle.className = "title";
			alertTitle.innerHTML = ((typeof(title)!=="undefined"))?title:"Untitled";
			alertBox.appendChild(alertTitle);
			
			var ring = document.createElement("img");
			ring.src = "img/preloader/dark/win-ring-40.gif?"+(new Date()).getMilliseconds();
			
			setTimeout(function() {
				alertBox.appendChild(ring);
				document.querySelector("#alert img").style.marginLeft = "-"+(document.querySelector("#alert div.title").offsetWidth/2 + document.querySelector("#alert img").offsetWidth + 10);
			}, 500);
			
			document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
			document.getElementsByClassName("notification-center")[0].appendChild(alertBox);
			
			setTimeout(function() {
				document.querySelector("#alert div.title").style.marginLeft = "-"+document.querySelector("#alert div.title").offsetWidth/2;
			}, 10);

			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
			
			if (typeof(duration) !== "undefined") {
				setTimeout(app.hidePreloader, duration*1000+500);
			}
		};
		app.hidePreloader = function() {
			var el = document.querySelector("div.alert img");
			el.parentNode.removeChild(el);
			
			document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
			document.querySelector("div.alert.fade-in").className = "alert preloader colored fade-out";

			setTimeout(function() {
				var alertBGChild = document.querySelector("div.notification-background");
				var alertChild = document.querySelector("div.alert");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);
			}, 200);
		};