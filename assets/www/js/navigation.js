function changeToEditionViewPage(){
	console.log("Debug Params BolsaEdiciones, user:" + movilxUserId);
	$.mobile.changePage(path("/edition/edition-view.html"), {data: {userId: movilxUserId}, reloadPage: true});
	//$.mobile.changePage("list-of-cards.html",{data:{userId:movilxUserId}});
}


function changeToHomePage(){
	console.log("Debug Params a HOME:" + movilxUserId);
	$.mobile.changePage(path("/edition/edition-list-cards.html"), {data: {userId: movilxUserId}, reloadPage: true});
}


function changeToProfilePage(){
	console.log("Debug Params a PROFILE:" + movilxUserId);
	$.mobile.changePage(path("/user/profile.html"), {data: {userId: movilxUserId}, reloadPage: true});
}