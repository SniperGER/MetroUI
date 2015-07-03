		app.pageCallbacks = {};
		Dom7.app = app;

		app.onPage = function (callbackName, pageName, callback) {
			if (pageName && pageName.split(' ').length > 1) {
				var pageNames = pageName.split(' ');
				var returnCallbacks = [];
				for (var i = 0; i < pageNames.length; i++) {
					returnCallbacks.push(app.onPage(callbackName, pageNames[i], callback));
				}
				returnCallbacks.remove = function () {
					for (var i = 0; i < returnCallbacks.length; i++) {
						returnCallbacks[i].remove();
					}
				};
				returnCallbacks.trigger = function () {
					for (var i = 0; i < returnCallbacks.length; i++) {
						returnCallbacks[i].trigger();
					}
				};
				return returnCallbacks;
			}
			var callbacks = app.pageCallbacks[callbackName][pageName];
			if (!callbacks) {
				callbacks = app.pageCallbacks[callbackName][pageName] = [];
			}
			app.pageCallbacks[callbackName][pageName].push(callback);
			return {
				remove: function () {
					var removeIndex;
					for (var i = 0; i < callbacks.length; i++) {
						if (callbacks[i].toString() === callback.toString()) {
							removeIndex = i;
						}
					}
					if (typeof removeIndex !== 'undefined') callbacks.splice(removeIndex, 1);
				},
				trigger: callback
			};
		};

		function createPageCallback(callbackName) {
		    var capitalized = callbackName.replace(/^./, function (match) {
		        return match.toUpperCase();
		    });
		    app['onPage' + capitalized] = function (pageName, callback) {
		        return app.onPage(callbackName, pageName, callback);
		    };
		}

		var pageCallbacksNames = ('beforeInit init reinit beforeAnimation afterAnimation back afterBack beforeRemove').split(' ');
		for (var i = 0; i < pageCallbacksNames.length; i++) {
			  app.pageCallbacks[pageCallbacksNames[i]] = {};
			  createPageCallback(pageCallbacksNames[i]);
		}

		app.triggerPageCallbacks = function (callbackName, pageName, pageData) {
		    var allPagesCallbacks = app.pageCallbacks[callbackName]['*'];
		    if (allPagesCallbacks) {
		        for (var j = 0; j < allPagesCallbacks.length; j++) {
		            allPagesCallbacks[j](pageData);
		        }
		    }
		    var callbacks = app.pageCallbacks[callbackName][pageName];
		    if (!callbacks || callbacks.length === 0) return;
		    for (var i = 0; i < callbacks.length; i++) {
		        callbacks[i](pageData);
		    }
		};