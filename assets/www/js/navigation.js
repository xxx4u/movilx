function changeToEditionViewPage(){
	console.log("Debug Params BolsaEdiciones, user:" + movilxUserId);
	$.mobile.changePage("../edition/listOfEditionView.html", {data: {userId: movilxUserId}, reloadPage: true});
	//$.mobile.changePage("list-of-cards.html",{data:{userId:movilxUserId}});
}


function changeToHomePage(){
	console.log("Debug Params a HOME:" + movilxUserId);
	$.mobile.changePage("../edition/edition-list-cards.html", {data: {userId: movilxUserId}, reloadPage: true});
}


function changeToProfilePage(){
	console.log("Debug Params a PROFILE:" + movilxUserId);
	$.mobile.changePage("../user/profile.html", {data: {userId: movilxUserId}, reloadPage: true});
}