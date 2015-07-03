		app.tileSizes = {
			width: (window.innerWidth-30),
			height: 140,

			//        w     h       more-tiles
			small: 	[[65,	65],	[0,0]],
			normal: [[140,	140],	[0,0]],
			wide: 	[[290,	140],	[0,0]],
			large: 	[[290,	290],	[0,0]],

			tileSpace: 10
		};
		app.tiles = {
			sizes: {
				width: (window.innerWidth-30),
				height: 140,

				small: {w: 65, h: 65},
				normal: {w: 140, h: 140},
				wide: {w: 290, h: 140},
				large: {w: 290, h: 290},

				tileSpace: 10
			},

			init: function(menu) {
				while ($("div.menu[data-menu=\""+menu+"\"] div.tile-row")) {
					$("div.menu[data-menu=\""+menu+"\"] div.tile-row").remove();
				}
				var tileRequest = new XMLHttpRequest();
				tileRequest.open("GET", "tiles.json?"+(new Date()).getTime(), false);
				tileRequest.send(null);
				var tilesResult = JSON.parse(tileRequest.responseText);
				app.tiles.loadedTiles = tilesResult;

				var x = app.tiles.sizes.width, y = app.tiles.sizes.height;

				var smallPrevious = false;
				if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")]) {
					for (var i=0; i<tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")].length; i++) {
						var container;
						if ($$("div.menu[data-menu=\""+menu+"\"] div.tile-row").length < 1) {
							container = document.createElement("div");
							container.className = "tile-row";
						} else if (x <= 0) {
							container = document.createElement("div");
							container.className = "tile-row";
						}
						if (x <= 0) {
							x = app.tiles.sizes.width;
						}
						if (y <= 0) {
							y = app.tiles.sizes.height;
						}

						if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type == "bar") {
							for (var j=0; j<tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles.length; j++) {
								var tile = document.createElement("div");
								tile.className = "tile small";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href);
								}
	
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label;
									tile.appendChild(tileLabel);
								}
	
								container.appendChild(tile);
							}
	
							$("div.menu[data-menu=\""+menu+"\"]").appendChild(container);
						}
	
						if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type == "square") {
							if (x == app.tiles.sizes.width || x < app.tiles.sizes.normal.w) {
								x = app.tiles.sizes.width;
								container = document.createElement("div");
								container.className = "tile-row";
							}
	
							var tileContainer = document.createElement("div");
							tileContainer.className = "tile medium tile-container";
							for (var j=0; j<tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles.length; j++) {
								var tile = document.createElement("div");
								tile.className = "tile small";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label;
									tile.appendChild(tileLabel);
								}
								tileContainer.appendChild(tile);
							}
	
							x -= app.tiles.sizes.normal.w + app.tiles.sizes.tileSpace;
							container.appendChild(tileContainer);
							$("div.menu[data-menu=\""+menu+"\"]").appendChild(container);
						}
	
						if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type != "bar" && tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type != "square") {
							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "small") {
								if (x == app.tiles.sizes.width || x < app.tiles.sizes.small.w-1) {
									if (!smallPrevious) {
										x = app.tiles.sizes.width;
										container = document.createElement("div");
										container.className = "tile-row";
									}
								}
	
								var tile = document.createElement("div");
								tile.className = "tile small";
	
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);
	
								y -= app.tiles.sizes.small.h + app.tiles.sizes.tileSpace;
								if (smallPrevious) {
									x -= app.tiles.sizes.small.w + app.tiles.sizes.tileSpace;
								}
								smallPrevious = true;
							}
	
							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "normal") {
								if (x == app.tiles.sizes.width || x < app.tiles.sizes.normal.w-1) {
									x = app.tiles.sizes.width;
									container = document.createElement("div");
									container.className = "tile-row";
								}
	
								var tile = document.createElement("div");
								tile.className = "tile medium";
	
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);
	
								x -= app.tiles.sizes.normal.w + app.tiles.sizes.tileSpace;
								smallPrevious = false;
							}
	
							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "wide") {
								//if (x == app.tiles.sizes.width || x < app.tiles.sizes.wide.w) {
									x = app.tiles.sizes.width;
									container = document.createElement("div");
									container.className = "tile-row";
								//}
	
								var tile = document.createElement("div");
								tile.className = "tile wide";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);
	
								//x -= app.tiles.sizes.wide.w;
							}
	
							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "large") {
								//if (x == app.tiles.sizes.width || x < app.tiles.sizes.large.w) {
									x = app.tiles.sizes.width;
									container = document.createElement("div");
									container.className = "tile-row";
								//}
	
								var tile = document.createElement("div");
								tile.className = "tile large";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);
	
								//x -= app.tiles.sizes.large.w;
							}
	
							$("div.menu[data-menu=\""+menu+"\"]").appendChild(container);
						}
						//app.navigation.initLinks("menu");
					}
				}
			},
			initBackground: function(menu) {
				for (var i=0;i<$$("div.tile").length;i++) {
					$$("div.tile")[i].style.backgroundPositionX = -cumulativeOffset($$("div.tile")[i]).left + "px";
					$$("div.tile")[i].style.backgroundPositionY = -cumulativeOffset($$("div.tile")[i]).top + "px";
				}
			}
		};