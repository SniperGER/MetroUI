		//app.init();
		/*setTimeout(function() {
			app.triggerPageCallbacks("init",_$("div.page:first-child").attr("data-page"),{});
		}, 50);*/

		if (app.params.useLegacyInit) {
			app.tiles.init("index");
			app.init();
		} else {
			app.init2();
		}
	};
	MetroUI.prototype.plugins = {};
})();
