var editionsURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/geteditions.php";
var sectionsURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/getsections.php";
var pagesURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/getpages_section.php";

function failure(e){
	console.log(JSON.stringify(e));
	
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

function nextSection(){
	var index = parseInt(window.sessionStorage.currentSection);
	var sections = JSON.parse(window.sessionStorage.sections);
	
	if(index < sections.length){
		window.sessionStorage.currentSection = index + 1;
		sectionsNavigation();
	}
	//alert(window.sessionStorage.currentSection);
}

function prevSection(){
	var index = parseInt(window.sessionStorage.currentSection);
	
	if(index > 0){
		window.sessionStorage.currentSection = index - 1;
		sectionsNavigation();
	}
	//alert(window.sessionStorage.currentSection);
}

function sectionsNavigation(){
	var index = parseInt(window.sessionStorage.currentSection);
	var sections = JSON.parse(window.sessionStorage.sections);
	
	var nav = $("#sections-nav");
	var prev = $("li a:first", nav);
	var current = $("li a#current", nav);
	var next = $("li a:last", nav);
	
	if(index == 0){
		disable($(".ui-btn-text", prev)).html("&nbsp;");
		$(".ui-btn-text", current).html(sections[0].title);
		$(".ui-btn-text", next).html(sections[1].title);
	}else if(index == sections.length - 1){
		$(".ui-btn-text", prev).html(sections[index - 1].title);
		$(".ui-btn-text", current).html(sections[index].title);
		disable($(".ui-btn-text", next)).html("&nbsp;");
	}else{
		enable($(".ui-btn-text", prev)).html(sections[index - 1].title);
		$(".ui-btn-text", current).html(sections[index].title);
		enable($(".ui-btn-text", next)).html(sections[index + 1].title);
	}
	
	prev.removeClass("ui-btn-active ui-state-persist");
	current.addClass("ui-btn-active ui-state-persist");
	next.removeClass("ui-btn-active ui-state-persist");
	
}

function getPages(){
	var section = window.sessionStorage.currentSection;
	var args = {sup_i: section};
	var pages = [];
	
	$.post(pagesURL, args, function(response){
		var items = response.items;
		var page;
		
		if(items != null){
			$.each(items, function(index, item){
				page = {};
				
				page.id = item.page_id;
				page.number = item.page_number;
				
				pages.push(page);
			});
		}
	});
	window.sessionStorage.pages = JSON.stringify(pages);
}