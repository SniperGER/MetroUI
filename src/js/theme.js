		app.changeTheme = function(themeColor) {
			$('body').attr('data-theme', themeColor);
			localStorage.themeColor = themeColor;
		};
		app.changeAccent = function(accentColor) {
			$('body').attr('data-color', accentColor);
			localStorage.accentColor = accentColor;
		};