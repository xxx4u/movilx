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
	var baseURL = 'http://media.nuestrodiario.com/nuestrodiario/pages/edicion/';
	return baseURL + slashDate(new Date(date)) + '/edicion_nacional/1.jpg'
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
				var date = edition.fixed_slash_date;
				$('#editions').append('<dt>'+
					'<ul data-role="listview" data-inset="true" class="loc-card"><li class="loc-image">' +
					'<div><a onclick="getSections(' + formatDate(new Date(date)) + ');"><img src="' + getEditionURL(date) + '"/></div>' +
					'</li></ul></dt>'
				);
	  		});
			
		    $('#editions ul').listview();
		    $("#gotoGalleryBtn").click(function(){
		        $.mobile.changePage(path("edition/carrousel.html?date=2013-02-19&suplemento=1737"));
		    });
		}
		
    }, "json").fail(error);
}

function getSections(date){
	$.mobile.loading('show', {text: "Cargando edicion...", textVisible: true});
	
	var args = {e_date: date};
	var sections = [];
	
	$.post(sectionsURL, args, function(response){
		var items = response.items;
		var section;
		
		if(items != null){
			$.each(items, function(index, item){
				section = {};
				
				section.title = item.cat_supplement_type_name;
				section.date = prettyDate(new Date(item.edition_publication_date));
				section.pages = item.pages_amount;
				
				sections.push(section);
			});
		}
		
		window.sessionStorage.sections = JSON.stringify(sections);
		window.sessionStorage.currentSection = 0;
		
		$.mobile.loading('hide');
		$.mobile.changePage("edition.html");
		
	}, "json").fail(function(e){failure(e)});
}

function sectionsNavigation(index, sections){
	var nav = $("#sections-nav");
	var section;
	$.each($("li a .ui-btn-text", nav), function(i, n){
		section = sections[i];
		if(section != undefined){
			$(n).html(section.title).navbar();
		}else{
			disable($(n).html("&nbsp;").parent().parent()).navbar();
		}
	});
}

