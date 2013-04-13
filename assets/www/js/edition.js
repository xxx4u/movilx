var editionsURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/geteditions.php";
var sectionsURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/getsections.php";

function failure(e){
	console.log(e);
	
	navigator.notification.alert("Ocurrió un problema, por favor intenta más tarde.", function(){}, "Error", "Aceptar");
	enable("#submit-button");
	$.mobile.loading('hide');
}

function getEditionCover(selector, date){
	$(selector).load("");
}

function getEditionURL(date){
	var d = new Date(date);
	var baseURL = 'http://media.nuestrodiario.com/nuestrodiario/pages/edicion/';
	return baseURL + slashDate(d) + '/edicion_nacional/1.jpg'
}

function searchEditions(){
	var start = $("#start-date").val();
	var end = $("#end-date").val();
	
	if(start == "" || end == ""){
		navigator.notification.alert("Debes ingresar las fechas a buscar.", function(){}, "Error", "Aceptar");
	}else{
		var s = parseDate(start);
		var e = parseDate(end);
		
		$.mobile.loading('show', {text: "Buscando ediciones...", textVisible: true});
		disable("#submit-button");
		
		getEditions(s, e, function(){
			$.mobile.loading("hide");
			enable("#submit-button");
		}, function(e){
			failure(e);
		});
	}
}

function getEditions(start, end, success, error){
	
	if(start == undefined){
		start = lastWeek();
	}else{
		start = start;
	}
	start = formatDate(start);
	
	if(end == undefined){
		end = today();
	}else{
		end = end;
	}
	end = formatDate(end);
	
	var args = {"s_date": start, "e_date": end};
	
	$.post(editionsURL, args, function(data){
		if(success != undefined){
			success();
		}
		if(data.items == null){
			$('#editions').html("<center><h4>No se encontraron resultados.</h4></center>");
		}else{
			$('#editions').html("");
			$.each(data.items, function(index, edition){
				$('#editions').append('<dt>'+
					'<ul data-role="listview" data-inset="true" class="loc-card"><li class="loc-image">' +
					'<div><img src="' + getEditionURL(edition.fixed_slash_date) + '"/></div>' +
					'</li></ul></dt>'
				);
	  		});
			
		    $('#editions ul').listview();
		    $("#gotoGalleryBtn").click(function(){
		    	//var argValue = $("#argTxt").val();
		        //$.mobile.changePage("page2.html",{data:{arg1:argValue}});
		        $.mobile.changePage(path("/edition/carrousel.html?date=2013-02-19&suplemento=1737"));
		    });
		}
		
    }, "json").fail(error);
}