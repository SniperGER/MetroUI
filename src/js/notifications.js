		/*
app.notify = function(title,message,callback) {
			new MetroUI.Notification(app,title,message,callback);
		};
*/

		app.notifyTimeoutsDone = function() {
			for (var i=0; i<app.notificationTimeouts.length; i++) {
				if (app.notificationTimeouts[i] !== undefined) {
					return false;
				}
			}
			return true;
		};