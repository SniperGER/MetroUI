(function() {
	"use strict";
	MetroUI.Pivot = function(page, params) {
		var pivotParams = {
			slideClass: "pivot-slide",
			wrapperClass: "pivot-wrapper",
			slidesPerView: 1,
			loop: true,
			loopAdditionalSlides: 0,
			spaceBetween: 15,
			watchSlidesProgress: true,
			runCallbacksOnInit: false,
			mousewheelControl: !window.isPhone,
			simulateTouch: window.isPhone,
			
			pivotEnableParallax: true,

			onInit: function(swiper, event) {
				new Dom7("div.page[data-page=\""+page+"\"] div.pivot").removeClass("transitioning");
				
				var tabs = $$("div.navbar header[data-page=\""+page+"\"] h1");
				
				if (pivotParams.loop) {
					for (var i=0; i<2;i++) {
						var newTab = tabs[i].cloneNode(true)
						newTab.classList.add("pivot-duplicate");
						$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").appendChild(newTab);
					}
					for (var i=1;i>=0;i--) {
						var newTab = tabs[i].cloneNode(true);
						newTab.classList.add("pivot-duplicate");
						$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").insertBefore(newTab, $("div.navbar header[data-page=\""+page+"\"] div.pivot-controls h1:first-child"));
					}
					_$("div.navbar header[data-page=\""+page+"\"] h1.pivot-active").removeClass("pivot-active");
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].classList.add("pivot-active");
					_$("div.navbar header[data-page=\""+page+"\"] h1[data-tab=\""+$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].getAttribute("data-tab")+"\"]").addClass("pivot-active");
				}

				if (pivotParams.pivotEnableParallax) {
					var difference;
					if (swiper.slides[swiper.snapIndex].progress < 0) {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+1] - calcPivotSnapPoints(page)[swiper.snapIndex];
					} else {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+2] - calcPivotSnapPoints(page)[swiper.snapIndex+1];
					}
					_$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").transform("translate3d("+(-calcPivotSnapPoints("pivot")[swiper.snapIndex+1]-(difference*swiper.slides[swiper.snapIndex].progress))+"px,0,0)");
				}
			},

			onSetTranslate: function(swiper, translate) {
				if (!_$("div.pivot").hasClass("transitioning") && pivotParams.pivotEnableParallax) {
					var difference;
					if (swiper.slides[swiper.snapIndex].progress < 0) {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+1] - calcPivotSnapPoints(page)[swiper.snapIndex];
					} else {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+2] - calcPivotSnapPoints(page)[swiper.snapIndex+1];
					}
					_$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").transform("translate3d("+(-calcPivotSnapPoints("pivot")[swiper.snapIndex+1]-(difference*swiper.slides[swiper.snapIndex].progress))+"px,0,0)");
				}
			},

			onTransitionStart: function(swiper, event) {
				if (pivotParams.pivotEnableParallax) {
					new Dom7("div.page[data-page=\""+page+"\"] div.pivot").addClass("transitioning");
	
					var difference = 0;
					difference = calcPivotSnapPoints(page)[swiper.snapIndex+1] - calcPivotSnapPoints(page)[swiper.snapIndex];
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].parentNode.style.webkitTransition = "-webkit-transform 300ms ease";
						_$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").transform("translate3d("+(-calcPivotSnapPoints(page)[swiper.snapIndex+1]-(difference*swiper.slides[swiper.snapIndex].progress))+"px,0,0)");
	
					_$("div.navbar header[data-page=\""+page+"\"] h1.pivot-active").removeClass("pivot-active");
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].classList.add("pivot-active");
					_$("div.navbar header[data-page=\""+page+"\"] h1[data-tab=\""+$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].getAttribute("data-tab")+"\"]").addClass("pivot-active");
				}
			},
			onTransitionEnd: function(swiper, event) {
				if (pivotParams.pivotEnableParallax) {
					new Dom7("div.page[data-page=\""+page+"\"] div.pivot").removeClass("transitioning");
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].parentNode.style.webkitTransition = "";
				}
			}
		};
		for (var param in params) {
			pivotParams[param] = params[param];
		}

		var pivot = new Swiper(new Dom7("div.page[data-page=\""+page+"\"] div.pivot"), pivotParams);
		
		return pivot;
	}
})();

function calcPivotSnapPoints(header) {
	var snaps = [];
	_$("div.navbar header[data-page=\""+header+"\"] h1").each(function(index,el) {
		snaps.push(el.offsetLeft-15);
	});
	return snaps;
}