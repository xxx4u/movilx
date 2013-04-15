function goToEditionsPage(){
	$.mobile.changePage("bag.html", {data: {userId: userID}, reloadPage: true});
}

function goToHomePage(){
	$.mobile.changePage("editions.html", {data: {userId: userID}, reloadPage: true});
}

function goToProfilePage(){
	$.mobile.changePage("profile.html", {data: {userId: userID}, reloadPage: true});
}