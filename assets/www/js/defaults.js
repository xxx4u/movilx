$(document).bind('mobileinit', function(){
	// Default pages' transition effect
	$.mobile.defaultPageTransition = 'slide';
	
	// Page Loader Widget
	$.mobile.loader.prototype.options.text = "Loading...";
	$.mobile.loader.prototype.options.textVisible = false;
	$.mobile.loader.prototype.options.theme = "a";
	$.mobile.loader.prototype.options.html = "";
	
	// Theme
	$.mobile.page.prototype.options.theme  = 'b';
	//$.mobile.page.prototype.options.headerTheme = 'b';
	//$.mobile.page.prototype.options.footerTheme = 'b';
	$.mobile.page.prototype.options.contentTheme = 'b';
	$.mobile.page.prototype.options.backBtnTheme = 'b';
});