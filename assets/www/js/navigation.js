function goToEditionsPage(){
	$.mobile.changePage("editions.html", {reloadPage: true});
}

function goToHomePage(){
	$.mobile.changePage("editions.html", {reloadPage: true});
}

function goToProfilePage(){
	$.mobile.changePage("profile.html", {reloadPage: true});
}

function goToSection(){
	getPages(function(){$.mobile.changePage("section.html", {reloadPage: true});});
	//$.mobile.changePage("pages.html", {reloadPage: true});
}