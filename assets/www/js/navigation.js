function goToEditionsPage(){
	$.mobile.changePage("audio.html", {data: {}, reloadPage: true});
}

function goToHomePage(){
	$.mobile.changePage("editions.html", {data: {}, reloadPage: true});
}

function goToProfilePage(){
	$.mobile.changePage("profile.html", {data: {}, reloadPage: true});
}

function loadSection(){
	getPages(function(){$.mobile.changePage("section.html", {data: {}, reloadPage: true});});
}