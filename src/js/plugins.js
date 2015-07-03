	app.pluginAPI = {
		init: function () {
			app.plugins = MetroUI.prototype.plugins;
			for (var plugin in app.plugins) {
				var p = app.plugins[plugin](app);
			}
		}
	};
	app.pluginAPI.init();