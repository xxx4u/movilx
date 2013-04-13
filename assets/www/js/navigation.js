function goToEditionsPage(){
	$.mobile.changePage(path("/edition/bag.html"), {data: {userId: userID}, reloadPage: true});
}

function goToHomePage(){
	$.mobile.changePage(path("/edition/index.html"), {data: {userId: userID}, reloadPage: true});
}

function goToProfilePage(){
	$.mobile.changePage(path("/user/profile.html"), {data: {userId: userID}, reloadPage: true});
}