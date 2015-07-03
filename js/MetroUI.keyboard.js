MetroUI.prototype.plugins.keyboard = function(app) {

	
	var Keyboard = function(params) {
		var p = this;
		
		p.params = {
			kbMain: "",
			shiftActivated: false,
			capsActivated: false,
			capsTimer: false,
			backspaceTimer: undefined,
			backspaceInterval: undefined,
			backspaceDuration: 500,
		};
		
		p.initKeyboard = function() {
			if (app.params.customKeyboard) {
				app.keyboard.init();
				document.body.appendChild(p.params.kbMain);
				if ($("footer div.right.kb")) {
					$("footer div.right.kb").onclick = function() {
						app.keyboard.hide();
					};
				}
				for (var m=0; m<$$("input:not([type=\"radio\"]):not([type=\"checkbox\"]):not([type=\"range\"]):not(:disabled), textarea:not(:disabled)").length;m++) {
					$$("input:not([type=\"radio\"]):not([type=\"checkbox\"]):not([type=\"range\"]), textarea")[m].readOnly = true;
					$$("input:not([type=\"radio\"]):not([type=\"checkbox\"]):not([type=\"range\"]):not(:disabled), textarea:not(:disabled)")[m].addEventListener("mousedown", function(e) {
						app.keyboard.call(this);

						return false;
					});
				}
			}
		};
		
		p.init = function() {
			if (app.params.customKeyboard) {
				var kb = document.createElement("div");
				kb.className = "keyboard";

				var KBrequest = new XMLHttpRequest();
				KBrequest.open("GET", "keyboards.json", false);
				KBrequest.send(null);
				var KBresult = JSON.parse(KBrequest.responseText);
				var keyRequest = ((window.innerWidth<app.params.mobileWidthLimit))?KBresult.keyboards.wp8[KBresult.keyboards.wp8.getIndexBy("lang",app.params.kbLanguage)]:KBresult.keyboards.win8[KBresult.keyboards.win8.getIndexBy("lang",app.params.kbLanguage)];

				for (var p=0;p<4;p++) {
					var kbPage = document.createElement("div");
					kbPage.className = "kb-page";
					kb.appendChild(kbPage);
				}
				
				setTimeout(function() {
					// Add default keys
					for (var i=0;i<keyRequest.keys.length;i++) {
						var kbRow = document.createElement("div");
						kbRow.className = "row";
						kbRow.id = i+1;
						for (var j=0; j<keyRequest.keys[i].length; j++) {
							var keyWrapper = document.createElement("div");
							keyWrapper.className = "key";
							var key = document.createElement("div");
							key.className = "key-inner";
							key.addEventListener(app.touchEventStart, function() {
								var el = this.parentNode;
								if (!el.classList.contains("return") && !el.classList.contains("symbol") && !el.classList.contains("shift") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if ($("div.key-highlight")) {
										$("div.key-highlight").parentNode.removeChild($("div.key-highlight"));
									}
	
									var keyHighlight = document.createElement("div");
									keyHighlight.className = "key-highlight";
									var keyHighlightInner = document.createElement("div");
									keyHighlightInner.className = "key-highlight-inner";
									keyHighlightInner.innerHTML = el.innerHTML;
									
									keyHighlight.appendChild(keyHighlightInner);
									el.parentNode.parentNode.appendChild(keyHighlight);

									var top = -Math.abs(el.parentNode.parentNode.lastChild.offsetHeight) + el.offsetTop;
									if (el.offsetTop > 0) { top = top-2; }
									el.parentNode.parentNode.lastChild.style.top = top;

									var left = (el.offsetLeft + (el.offsetWidth/2) - (el.parentNode.parentNode.lastChild.offsetWidth/2));
									el.parentNode.parentNode.lastChild.style.left = left;
								} else if (el.classList.contains("shift")) {
									if (app.keyboard.params.capsTimer) {
										app.keyboard.params.capsTimer = false;
										app.keyboard.params.capsActivated = true;
										el.parentNode.parentNode.parentNode.classList.add("caps");
										el.parentNode.parentNode.parentNode.classList.add("shift");
									} else {
										el.parentNode.parentNode.parentNode.classList.add("shift");
										app.keyboard.params.shiftActivated = true;
										app.keyboard.params.capsActivated = false;
										
										app.keyboard.params.capsTimer = true;
										setTimeout(function() {
											app.keyboard.params.capsTimer = false;
										}, 500);
									}
								} else if (el.classList.contains("back")) {
									if (app.activeInput) {
										var val = app.activeInput.value;
										app.activeInput.value = val.substring(0, val.length - 1);

										
										app.keyboard.params.backspaceTimer = setTimeout(function() {
											app.keyboard.params.backspaceInterval = setInterval(function() {
												val = app.activeInput.value;
												app.activeInput.value = val.substring(0, val.length - 1);
											}, 50);
										}, app.keyboard.params.backspaceDuration);
									}
								}
							});
							key.addEventListener(app.touchEventEnd, function() {
								var el = this.parentNode;
								if ($("div.key-highlight")) {
									el.parentNode.parentNode.removeChild($("div.key-highlight"));
								}
								if (!el.classList.contains("return") && !el.classList.contains("symbol") && !el.classList.contains("shift") && !el.classList.contains("back") && !el.classList.contains("space") && !el.classList.contains("kbdown") && !el.classList.contains("emoji")) {
									if (app.activeInput) {
										var val = app.activeInput.value + el.children[0].innerHTML;
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("space")) {
									el.parentNode.parentNode.parentNode.classList.remove("shift");
									el.parentNode.parentNode.parentNode.classList.remove("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("symbol2");

									if (app.activeInput) {
										var val = app.activeInput.value + " ";
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("symbol")) {
									el.parentNode.parentNode.parentNode.classList.add("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("shift");
								} else if (el.classList.contains("back")) {
									clearTimeout(app.keyboard.params.backspaceTimer);
									clearInterval(app.keyboard.params.backspaceInterval);
								} else if (el.classList.contains("kbdown")) {
									app.keyboard.hide();
								}
							});
							var keyLabel = keyRequest.keys[i][j];
							switch (keyLabel) {
								case "shift": keyWrapper.classList.add("shift"); key.innerHTML = String.fromCharCode(160); break;
								case "back": keyWrapper.classList.add("back"); key.innerHTML = String.fromCharCode(160); break;
								case "&123": keyWrapper.classList.add("symbol"); key.innerHTML = keyLabel; break;
								case "kb_down": keyWrapper.classList.add("kbdown"); key.innerHTML = String.fromCharCode(160); break;
								case "emoji": keyWrapper.classList.add("emoji"); key.innerHTML = String.fromCharCode(160); break;
								case " ": keyWrapper.classList.add("space"); key.innerHTML = keyRequest.spaceLabel; break;
								case "return": keyWrapper.classList.add("return"); key.innerHTML = String.fromCharCode(160); break;
								default: key.innerHTML = keyLabel; break;
							}
							
							if (window.innerWidth < app.params.mobileWidthLimit) {
								keyWrapper.style.width = ((keyRequest.keys[i].length>10))?((320/keyRequest.keys[i].length)/320)*100+"%":(32/320)*100+"%";
							}
							keyWrapper.appendChild(key);
							kbRow.appendChild(keyWrapper);
						}
						$("div.kb-page:nth-child(1)").appendChild(kbRow);
					}
					
					// Add default keys (+shift)
					for (var i=0;i<keyRequest.keys.length;i++) {
						var kbRow = document.createElement("div");
						kbRow.className = "row";
						kbRow.id = i+1;
						for (var j=0; j<keyRequest.keys[i].length; j++) {
							var keyWrapper = document.createElement("div");
							keyWrapper.className = "key";
							var key = document.createElement("div");
							key.className = "key-inner";
							key.addEventListener(app.touchEventStart, function() {
								var el = this.parentNode;
								if (!el.classList.contains("return") && !el.classList.contains("symbol") && !el.classList.contains("shift") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if ($("div.key-highlight")) {
										el.parentNode.parentNode.removeChild($("div.key-highlight"));
									}
	
									var keyHighlight = document.createElement("div");
									keyHighlight.className = "key-highlight";
									var keyHighlightInner = document.createElement("div");
									keyHighlightInner.className = "key-highlight-inner";
									keyHighlightInner.innerHTML = el.innerHTML;
									
									keyHighlight.appendChild(keyHighlightInner);
									el.parentNode.parentNode.appendChild(keyHighlight);
									
									var top = -Math.abs(el.parentNode.parentNode.lastChild.offsetHeight) + el.offsetTop;
									if (el.offsetTop > 0) { top = top-2; }
									el.parentNode.parentNode.lastChild.style.top = top;

									var left = (el.offsetLeft + (el.offsetWidth/2) - (el.parentNode.parentNode.lastChild.offsetWidth/2));
									el.parentNode.parentNode.lastChild.style.left = left;
								} else if (el.classList.contains("shift")) {
									if (app.keyboard.params.capsTimer) {
										app.keyboard.params.capsTimer = false;
										app.keyboard.params.capsActivated = true;
										el.parentNode.parentNode.parentNode.classList.add("caps");
									} else {
										el.parentNode.parentNode.parentNode.classList.remove("shift");
										el.parentNode.parentNode.parentNode.classList.remove("caps");
										app.keyboard.params.shiftActivated = false;
										app.keyboard.params.capsActivated = false;
										
										app.keyboard.params.capsTimer = true;
										setTimeout(function() {
											app.keyboard.params.capsTimer = false;
										}, 500);
									}
								} else if (el.classList.contains("back")) {
									if (app.activeInput) {
										var val = app.activeInput.value;
										app.activeInput.value = val.substring(0, val.length - 1);

										
										app.keyboard.params.backspaceTimer = setTimeout(function() {
											app.keyboard.params.backspaceInterval = setInterval(function() {
												val = app.activeInput.value;
												app.activeInput.value = val.substring(0, val.length - 1);
											}, 50);
										}, app.keyboard.params.backspaceDuration);
									}
								}
							});
							key.addEventListener(app.touchEventEnd, function() {
								var el = this.parentNode;
								if ($("div.key-highlight")) {
									el.parentNode.parentNode.removeChild($("div.key-highlight"));
								}
								if (!el.classList.contains("return") && !el.classList.contains("symbol") && !el.classList.contains("shift") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if (app.activeInput) {
										var val = app.activeInput.value + el.children[0].innerHTML;
										app.activeInput.value = val;
										
										if (app.keyboard.params.shiftActivated && !app.keyboard.params.capsActivated) {
											el.parentNode.parentNode.parentNode.classList.remove("shift");
											el.parentNode.parentNode.parentNode.classList.remove("symbol1");
											el.parentNode.parentNode.parentNode.classList.remove("symbol2");
										}
									}
								} else if (el.classList.contains("space")) {
									el.parentNode.parentNode.parentNode.classList.remove("shift");
									el.parentNode.parentNode.parentNode.classList.remove("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("symbol2");

									if (app.activeInput) {
										var val = app.activeInput.value + " ";
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("symbol")) {
									el.parentNode.parentNode.parentNode.classList.add("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("shift");
								} else if (el.classList.contains("back")) {
									clearTimeout(app.keyboard.params.backspaceTimer);
									clearInterval(app.keyboard.params.backspaceInterval);
								}
							});
							var keyLabel = keyRequest.keys[i][j];
							switch (keyLabel) {
								case "shift": keyWrapper.classList.add("shift"); key.innerHTML = String.fromCharCode(160); break;
								case "back": keyWrapper.classList.add("back"); key.innerHTML = String.fromCharCode(160); break;
								case "&123": keyWrapper.classList.add("symbol"); key.innerHTML = keyLabel.toUpperCase(); break;
								case "kb_down": keyWrapper.classList.add("kbdown"); key.innerHTML = String.fromCharCode(160); break;
								case "emoji": keyWrapper.classList.add("emoji"); key.innerHTML = String.fromCharCode(160); break;
								case " ": keyWrapper.classList.add("space"); key.innerHTML = keyRequest.spaceLabel; break;
								case "return": keyWrapper.classList.add("return"); key.innerHTML = String.fromCharCode(160); break;
								default: key.innerHTML = keyLabel.toUpperCase(); break;
							}

							if (window.innerWidth < app.params.mobileWidthLimit) {
								keyWrapper.style.width = ((keyRequest.keys[i].length>10))?((320/keyRequest.keys[i].length)/320)*100+"%":(32/320)*100+"%";
							}
							keyWrapper.appendChild(key);
							kbRow.appendChild(keyWrapper);
						}
						$("div.kb-page:nth-child(2)").appendChild(kbRow);
					}

					// Add symbol keys (page 1)
					for (var i=0;i<keyRequest.symbols1.length;i++) {
						var kbRow = document.createElement("div");
						kbRow.className = "row";
						kbRow.id = i+1;
						for (var j=0; j<keyRequest.symbols1[i].length; j++) {
							var keyWrapper = document.createElement("div");
							keyWrapper.className = "key";
							var key = document.createElement("div");
							key.className = "key-inner";
							key.addEventListener(app.touchEventStart, function() {
								var el = this.parentNode;
								if (!el.classList.contains("return") && !el.classList.contains("abcd") && !el.classList.contains("next") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if ($("div.key-highlight")) {
										el.parentNode.parentNode.removeChild($("div.key-highlight"));
									}
	
									var keyHighlight = document.createElement("div");
									keyHighlight.className = "key-highlight";
									var keyHighlightInner = document.createElement("div");
									keyHighlightInner.className = "key-highlight-inner";
									keyHighlightInner.innerHTML = el.innerHTML;
									
									keyHighlight.appendChild(keyHighlightInner);
									el.parentNode.parentNode.appendChild(keyHighlight);

									var top = -Math.abs(el.parentNode.parentNode.lastChild.offsetHeight) + el.offsetTop;
									if (el.offsetTop > 0) { top = top-2; }
									el.parentNode.parentNode.lastChild.style.top = top;

									var left = (el.offsetLeft + (el.offsetWidth/2) - (el.parentNode.parentNode.lastChild.offsetWidth/2));
									el.parentNode.parentNode.lastChild.style.left = left;
								} else if (el.classList.contains("next")) {
									el.parentNode.parentNode.parentNode.classList.add("symbol2");
									el.parentNode.parentNode.parentNode.classList.remove("symbol1");
								} else if (el.classList.contains("back")) {
									if (app.activeInput) {
										var val = app.activeInput.value;
										app.activeInput.value = val.substring(0, val.length - 1);

										
										app.keyboard.params.backspaceTimer = setTimeout(function() {
											app.keyboard.params.backspaceInterval = setInterval(function() {
												val = app.activeInput.value;
												app.activeInput.value = val.substring(0, val.length - 1);
											}, 50);
										}, app.keyboard.params.backspaceDuration);
									}
								}
							});
							key.addEventListener(app.touchEventEnd, function() {
								var el = this.parentNode;
								if ($("div.key-highlight")) {
									el.parentNode.parentNode.removeChild($("div.key-highlight"));
								}
								if (!el.classList.contains("return") && !el.classList.contains("abcd") && !el.classList.contains("next") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if (app.activeInput) {
										var val = app.activeInput.value + el.children[0].textContent;
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("space")) {
									el.parentNode.parentNode.parentNode.classList.remove("shift");
									el.parentNode.parentNode.parentNode.classList.remove("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("symbol2");

									if (app.activeInput) {
										var val = app.activeInput.value + " ";
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("abcd")) {
									el.parentNode.parentNode.parentNode.classList.remove("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("symbol2");
								} else if (el.classList.contains("back")) {
									clearTimeout(app.keyboard.params.backspaceTimer);
									clearInterval(app.keyboard.params.backspaceInterval);
								}
							});

							var keyLabel = keyRequest.symbols1[i][j];
							switch (keyLabel) {
								case "next": keyWrapper.classList.add("next"); key.innerHTML = String.fromCharCode(160); break;
								case "back": keyWrapper.classList.add("back"); key.innerHTML = String.fromCharCode(160); break;
								case "abcd": keyWrapper.classList.add("abcd"); key.innerHTML = keyLabel; break;
								case " ": keyWrapper.classList.add("space"); key.innerHTML = keyRequest.spaceLabel; break;
								case "return": keyWrapper.classList.add("return"); key.innerHTML = String.fromCharCode(160); break;
								default: key.innerHTML = keyLabel; break;
							}

							keyWrapper.style.width = ((keyRequest.symbols1[i].length>10))?((320/keyRequest.symbols1[i].length)/320)*100+"%":(32/320)*100+"%";
							keyWrapper.appendChild(key);
							kbRow.appendChild(keyWrapper);
						}
						$("div.kb-page:nth-child(3)").appendChild(kbRow);
					}
					
					// Add symbol keys (page 2)
					for (var i=0;i<keyRequest.symbols2.length;i++) {
						var kbRow = document.createElement("div");
						kbRow.className = "row";
						kbRow.id = i+1;
						for (var j=0; j<keyRequest.symbols2[i].length; j++) {
							var keyWrapper = document.createElement("div");
							keyWrapper.className = "key";
							var key = document.createElement("div");
							key.className = "key-inner";
							key.addEventListener(app.touchEventStart, function() {
								var el = this.parentNode;
								if (!el.classList.contains("return") && !el.classList.contains("abcd") && !el.classList.contains("prev") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if ($("div.key-highlight")) {
										el.parentNode.parentNode.removeChild($("div.key-highlight"));
									}
	
									var keyHighlight = document.createElement("div");
									keyHighlight.className = "key-highlight";
									var keyHighlightInner = document.createElement("div");
									keyHighlightInner.className = "key-highlight-inner";
									keyHighlightInner.innerHTML = el.innerHTML;
									
									keyHighlight.appendChild(keyHighlightInner);
									el.parentNode.parentNode.appendChild(keyHighlight);

									var top = -Math.abs(el.parentNode.parentNode.lastChild.offsetHeight) + el.offsetTop;
									if (el.offsetTop > 0) { top = top-2; }
									el.parentNode.parentNode.lastChild.style.top = top;

									var left = (el.offsetLeft + (el.offsetWidth/2) - (el.parentNode.parentNode.lastChild.offsetWidth/2));
									el.parentNode.parentNode.lastChild.style.left = left;
								} else if (el.classList.contains("prev")) {
									el.parentNode.parentNode.parentNode.classList.remove("symbol2");
									el.parentNode.parentNode.parentNode.classList.add("symbol1");
								} else if (el.classList.contains("back")) {
									if (app.activeInput) {
										var val = app.activeInput.value;
										app.activeInput.value = val.substring(0, val.length - 1);

										
										app.keyboard.params.backspaceTimer = setTimeout(function() {
											app.keyboard.params.backspaceInterval = setInterval(function() {
												val = app.activeInput.value;
												app.activeInput.value = val.substring(0, val.length - 1);
											}, 50);
										}, app.keyboard.params.backspaceDuration);
									}
								}
							});
							key.addEventListener(app.touchEventEnd, function() {
								var el = this.parentNode;
								if ($("div.key-highlight")) {
									el.parentNode.parentNode.removeChild($("div.key-highlight"));
								}
								if (!el.classList.contains("return") && !el.classList.contains("abcd") && !el.classList.contains("prev") && !el.classList.contains("back") && !el.classList.contains("space")) {
									if (app.activeInput) {
										var val = app.activeInput.value + el.children[0].innerHTML;
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("space")) {
										el.parentNode.parentNode.parentNode.classList.remove("shift");
										el.parentNode.parentNode.parentNode.classList.remove("symbol1");
										el.parentNode.parentNode.parentNode.classList.remove("symbol2");
									if (app.activeInput) {
										var val = app.activeInput.value + " ";
										app.activeInput.value = val;
									}
								} else if (el.classList.contains("abcd")) {
									el.parentNode.parentNode.parentNode.classList.remove("symbol1");
									el.parentNode.parentNode.parentNode.classList.remove("symbol2");
								} else if (el.classList.contains("back")) {
									clearTimeout(app.keyboard.params.backspaceTimer);
									clearInterval(app.keyboard.params.backspaceInterval);
								}
							});

							var keyLabel = keyRequest.symbols2[i][j];
							switch (keyLabel) {
								case "prev": keyWrapper.classList.add("prev"); key.innerHTML = String.fromCharCode(160); break;
								case "back": keyWrapper.classList.add("back"); key.innerHTML = String.fromCharCode(160); break;
								case "abcd": keyWrapper.classList.add("abcd"); key.innerHTML = keyLabel; break;
								case " ": keyWrapper.classList.add("space"); key.innerHTML = keyRequest.spaceLabel; break;
								case "return": keyWrapper.classList.add("return"); key.innerHTML = String.fromCharCode(160); break;
								default: key.innerHTML = keyLabel; break;
							}

							keyWrapper.style.width = ((keyRequest.symbols2[i].length>10))?((320/keyRequest.symbols2[i].length)/320)*100+"%":(32/320)*100+"%";
							keyWrapper.appendChild(key);
							kbRow.appendChild(keyWrapper);
						}
						$("div.kb-page:nth-child(4)").appendChild(kbRow);
					}

				}, 20);
				app.keyboard.params.kbMain = kb;
				document.body.appendChild(kb);
			}
		};
		p.call = function(el) {
			setTimeout(function() {
				$("div.keyboard").classList.add("extended");
				document.body.classList.add("keyboard");
				$("div.keyboard").classList.remove("shift");
				$("div.keyboard").classList.remove("caps");
				$("div.keyboard").classList.remove("symbol1");
				$("div.keyboard").classList.remove("symbol2");
				app.keyboard.params.shiftActivated = false;
				if ($("input.active")) {
					$("input.active").classList.remove("active");
				}
				if ($("textarea.active")) {
					$("textarea.active").classList.remove("active");
				}
				el.classList.add("active");
				app.activeInput = el;
				setTimeout(function() {
					if ((el.offsetTop - window.scrollY) > (window.innerHeight - $("div.keyboard").offsetHeight)-36-50) {
						var kbHeight = $("div.keyboard").offsetHeight,
							boxShadow = 4,
							margin = 20,
							boxHeight = 32,
							offset = ((document.body.classList.contains("app-bar"))) ? 48 : 0;
						
						scrollTo(document.body, (el.offsetTop - (window.innerHeight - kbHeight - boxHeight - (boxShadow+margin+boxHeight+offset))), 200);
						// 4 Box Shadow, 20 Margin, 32 self height = 56
					}
				}, 200);
			}, 100);
		};
		p.hide = function() {
			app.activeInput = undefined;
			if ($("input.active")) {
				$("input.active").classList.remove("active");
			}
			if ($("textarea.active")) {
				$("textarea.active").classList.remove("active");
			}
			$("div.keyboard").classList.remove("extended");
			document.body.classList.remove("keyboard");
			setTimeout(function() {
				//$("div.keyboard").style.display = "none";
				$("div.keyboard").classList.remove("shift");
				$("div.keyboard").classList.remove("caps");
				setTimeout(function() {
					//$("div.keyboard").style.display = "block";
				}, 10);
			}, 300);
		};
		
		return p;
	}
	app.keyboard = new Keyboard();
}