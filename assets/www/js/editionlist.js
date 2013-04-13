var serviceURL = "http://media.nuestrodiario.com/MovilX/mobileOps/layerx/";

var editions;
var dateNoScope;
var supNoScope;

$('#edition-list-page').bind('pageinit', function(event){
	getEditionList();
	$("#gotoGalleryBtn").click(function(){
		//var argValue = $("#argTxt").val();
		//$.mobile.changePage("page2.html",{data:{arg1:argValue}});
		//or you could pass parameters in the URL
		//$.mobile.changePage("loadeditionCarrousel.html?date=2013-02-19&suplemento=1737");
	});
});



function changePageWithArguments(supDate, supId){
  console.log("Debug Params 000, date:  "+supDate+", suplem: "+supId);
  //$.mobile.changePage("loadeditionCarrousel.html?date="+ supDate +"&suplemento="+ supId +"");
  $.mobile.changePage("loadeditionCarrousel.html",{data:{date:supDate}});

  dateNoScope = supDate; 
  supNoScope = supId;

}


function getEditionList(){
	$.getJSON(serviceURL + 'geteditions.php', function(data){
		$('#editionList li').remove();
		var editions = data.items;
		$.each(editions, function(index, edition){
			$('#editionList').append('<li class="loc-image"><div>' + 
				'<img src="http://media.nuestrodiario.com/nuestrodiario/pages/edicion/' + edition.fixed_slash_date + '/edicion_nacional/1.jpg"/>' + 
				'</div></li>' +
				'<li class="loc-credits">' + 
				'<img src="' + path("resources/images/profile-01.png") + '"/>' +
				'<h3>' + edition.edition_publication_date + '</h3>' +
				'<p>by <a href="#">sandra</a>.</p>' +
				'</li>' +
				'<li class="loc-comments">' + 
				'<a href="#" data-role="button" id="gotoGalleryBtnBoom" onclick="changePageWithArguments('+ "\'" + edition.fixed_dash_date + "\'" + ','+ edition.supplement_id +');">ABRIR AQUI</a><p>2 comments, 4 likes</p>' +
				'</li>'
			);
			console.log(path("/resources/images/profile-01.png"));
      		console.log("Debug Params 00x, date:  "+edition.fixed_dash_date+", suplem: "+edition.supplement_id);
  		});
		
	    $('#editionList').listview('refresh');
	    $("#gotoGalleryBtn").click(function(){
	    	//var argValue = $("#argTxt").val();
	        //$.mobile.changePage("page2.html",{data:{arg1:argValue}});
	        //or you could pass parameters in the URL
	        //alert("Give me your money foo!");
	        $.mobile.changePage(path("/edition/carrousel.html?date=2013-02-19&suplemento=1737"));
	    });
    });
}
