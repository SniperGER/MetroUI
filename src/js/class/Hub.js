(function() {
	"use strict";
	MetroUI.Hub = function(page) {
		var hub = this;

		hub.init = function() {
			var hubRequest = new XMLHttpRequest();
			hubRequest.open("GET", "hubs.json?"+(new Date()).getTime(), false);
			hubRequest.send(null);
			var hubResult = JSON.parse(hubRequest.responseText).hubs;

			if (hubResult.title) {
				_$("div.page[data-page=\""+page+"\"] header h1").text(_$("div.page[data-page=\""+page+"\"] header h1").text().replace(/{{HubTitle}}/g, hubResult.title));
			}
			if (hubResult.sections) {
				for (var i=0; i<hubResult.sections.length; i++) {
					var slide = document.createElement("div");
					slide.className = "hub-slide";
					slide.setAttribute("data-tab", hubResult.sections[i].id);

					var slideContent = document.createElement("div");
					slideContent.className = "content";

					var slideHeader = document.createElement("h2");
					slideHeader.innerHTML = hubResult.sections[i].title;
					slideContent.appendChild(slideHeader);

					var tileCount = 0, tileDetailCount = 0, tileWideCount = 0, tilePromoCount = 0;
					for (var j=0; j<hubResult.sections[i].items.length; j++) {
						var tile = document.createElement("div");
						tile.className = hubResult.sections[i].items[j].type;

						if (hubResult.sections[i].items[j].type == "tile") {
							tileCount++;
						} else if (hubResult.sections[i].items[j].type == "tile detail") {
							slide.classList.add("detail");
							tileDetailCount++;
							
							var tileTitle = document.createElement("p");
							tileTitle.className = "title";
							var tileDesc = document.createElement("p");
							tileDesc.className = "description";
							tile.appendChild(tileTitle);
							tile.appendChild(tileDesc);
						} else if (hubResult.sections[i].items[j].type == "tile wide") {
							tileWideCount++;
						} else if (hubResult.sections[i].items[j].type == "tile promo") {
							tilePromoCount++;
						}

						slideContent.appendChild(tile);
					}
					if (tilePromoCount == 1) {
						//slide.style.width = "495px";
						slide.classList.add("promo");
						if (tileCount > 3 || (tileWideCount == 1 && tileCount > 2)) {
							//slide.style.width = "825px";
							slide.classList.add("wide");
						}
					} else if (tileDetailCount >= 4) {
						//slide.style.width = "905px";
						slide.classList.add("wide");
					}

					slide.appendChild(slideContent);
					$("div.page[data-page=\""+page+"\"] div.pivot-wrapper").appendChild(slide);
				}
				//$("div.page[data-page=\""+page+"\"] div.hub-slide:last-child").style.width = ($("div.page[data-page=\""+page+"\"] div.hub-slide:last-child").offsetWidth+135)+"px";
			}

			return new MetroUI.Pivot(page, {
				freeMode: true,
				loop: false,
				spaceBetween: (window.isPhone)?35:65,
				mousewheelForceToAxis: false,
				slidesPerView: "auto",
				slideClass: "hub-slide",
				pivotEnableParallax: false
			});
		}
		hub.init();
	};
})();