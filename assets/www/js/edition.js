var editionsURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/geteditions.php";
var sectionsURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/getsections.php";
var pagesURL    = "http://media.nuestrodiario.com/MovilX/mobileOps2/getpages_section.php";
var mediaURL    = "http://media.nuestrodiario.com/MovilX/mobileOps2/getmedia_page.php";
var tabsURL		= "http://media.nuestrodiario.com/MovilX/mobileOps2/gettabs.php";

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

function getSectionURL(section){
	var baseURL = 'http://media.nuestrodiario.com/nuestrodiario/pages/edicion/';
	return baseURL + section.slashDate + '/' + section.title.toSnake() + '/1.jpg'
}

function getCurrentSectionURL(){
	var index = parseInt(window.sessionStorage.currentSection);
	var sections = JSON.parse(window.sessionStorage.sections);
	
	return getSectionURL(sections[index]);
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
			$('#editions-page #editions').html("<center><h4>No se encontraron resultados.</h4></center>");
		}else{
			$('#editions-page #editions').html("");
			$.each(data.items, function(index, edition){
				var date = edition.fixed_slash_date;
				
				$('#editions-page #editions').append('<dt>'+
					'<ul data-role="listview" data-inset="true" class="loc-card"><li class="loc-image">' +
					'<div><a onclick="getSections(' + formatDate(new Date(date)) + ');"><img src="' + getEditionURL(date) + '"/></div>' +
					'</li></ul></dt>'
				);
	  		});
			
		    $('#editions-page #editions ul').listview();
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
				
				section.id = item.supplement_id;
				section.title = item.cat_supplement_type_name;
				section.date = parseDashedDate(item.edition_publication_date);
				section.slashDate = slashDate(section.date);
				section.prettyDate = prettyDate(section.date);
				section.pages = item.pages_amount;
				
				sections.push(section);
			});
		}
		
		window.sessionStorage.sections = JSON.stringify(sections);
		window.sessionStorage.currentSection = 0;
		
		$.mobile.loading('hide');
		$.mobile.changePage("edition_even.html");
		
	}, "json").fail(function(e){failure(e)});
}

function loadSections(sections){
	if(sections == undefined){
		sections = JSON.parse(window.sessionStorage.sections);
	}
	
	$.each(sections, function(index, section){
		$('#sections').append('<dt>'+
			'<ul id="' + section.id + '" data-role="listview" data-inset="true" class="loc-card"><li class="loc-image">' +
			'<div><a onclick="loadSection(' + index + ');"><img src="' + getSectionURL(section) + '"/></div>' +
			'</li></ul></dt>'
		);
	});
	$('#sections ul').listview();
}

function loadSection(dest, section){
	$(dest + " #section").attr("src", getSectionURL(section));
	$(dest).one("swipeleft", nextSection);
	$(dest).one("swiperight", prevSection);
}

function nextSection(){
	var index = parseInt(window.sessionStorage.currentSection) + 1;
	var sections = JSON.parse(window.sessionStorage.sections);
	
	if(index < sections.length){
		window.sessionStorage.currentSection = index;
		//sectionsNavigation();
		var even = index % 2 == 0 ? "even" : "odd";
		$.mobile.changePage("edition_" + even + ".html");
	}
}

function prevSection(){
	var index = parseInt(window.sessionStorage.currentSection);
	
	if(index > 0){
		index--;
		window.sessionStorage.currentSection = index;
		//sectionsNavigation();
		var even = index % 2 == 0 ? "even" : "odd";
		$.mobile.changePage("edition_" + even + ".html", {reverse: true});
	}else{
		$("#sections-panel").panel("open");
	}
}

function showSection(index){
	var i = window.sessionStorage.currentSection;
	
	var last = i % 2 == 0 ? "even" : "odd";
	var next = index % 2 == 0 ? "even" : "odd";
	window.sessionStorage.currentSection = index;
	
	if(last != next){
		$.mobile.changePage("edition_" + next + ".html");
	}else{
		var sections = JSON.parse(window.sessionStorage.sections);
		var section = sections[index];
		
		$("#edition-" + next + "-page #edition-title").html(section.title);
		loadSection("#edition-" + next + "-page", section);
		sectionsPanel(sections);
		$("#sections-panel").panel("close");
	}
}

function sectionsNavigation(){
	var index = parseInt(window.sessionStorage.currentSection);
	var sections = JSON.parse(window.sessionStorage.sections);
	
	var nav = $("#sections-nav");
	var prev = $("li a:first", nav);
	var current = $("li a#current", nav);
	var next = $("li a:last", nav);
	
	$("#section-cover").attr("src", getSectionURL(sections[index]));
	
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

function sectionsPanel(sections){
	var index = parseInt(window.sessionStorage.currentSection);
	if(sections == undefined){
		sections = JSON.parse(window.sessionStorage.sections);
	}
	var section = sections[index];
	
	var panel = $("#sections-panel ul").html("");
	var klass = "";
	$.each(sections, function(i, section){
		if(i == index){
			klass = 'class="ui-btn-active"';
		}else{
			klass = '';
		}
		panel.append('<li ' + klass + '><a onclick="showSection(' + i + ');" data-role="button" data-iconpos="right">' + section.title + '<span class="ui-li-count">' + section.pages + '</span></a></li>');
	});
	
	panel.listview("refresh");
}


function getTabs(section){
	if(typeof section == "undefined"){
		var index = window.sessionStorage.currentSection;
		var sections = JSON.parse(window.sessionStorage.sections);
		section = sections[index];
	}
	var args = {sup_id: section.id};
	var tabs = [];
	
	$.post(tabsURL, args, function(response){
		var items = response.items;
		var tab;
		
		if(items != null){
			$.each(items, function(index, item){
				tab = {};
				
				tab.id = item.cat_tab_detail_id;
				tab.title = item.cat_tab_detail_name;
				tab.page_number = item.page_number;
				tab.page_id = item.page_id;
				//page.base_url = item.base_url + item.year + "/" + item.month + "/" + item.day + "/" + item.folder + "/"
				
				//page.small = page.base_url + item.small;
				//page.medium = page.base_url + item.medium;
				//page.large = page.base_url + item.large;
				
				tabs.push(tab);
			});
			window.sessionStorage.tabs = JSON.stringify(tabs);
		}else{
			console.log(JSON.stringify(response));
		}
		
	}, "json").fail(function(e){failure(e)});
}

function tabsPanel(pages, tabs){
	var index = parseInt(window.sessionStorage.currentPage);
	if(typeof tabs == "undefined"){
		//tabs = JSON.parse(window.sessionStorage.tabs);
	}
	
	var panel = $("#tabs-panel ul").html("");
	var klass = "";
	$.each(pages, function(i, page){
		if(i == index){
			klass = 'class="ui-btn-active"';
		}else{
			klass = '';
		}
		panel.append('<li id="tab-' + i + '"' + klass + '><a onclick="showPage(' + i + ');" data-role="button" data-iconpos="right"> Página #' + page.number + '</a></li>');
	});
	
	panel.listview("refresh");
}



function getPages(success){
	$.mobile.loading('show', {text: "Cargando sección...", textVisible: true});
	
	var index = window.sessionStorage.currentSection;
	var sections = JSON.parse(window.sessionStorage.sections);
	var section = sections[index];
	
	var args = {sup_id: section.id};
	var pages = [];
	
	$.post(pagesURL, args, function(response){
		
		var items = response.items;
		var page;
		
		if(items != null){
			$.each(items, function(index, item){
				page = {};
				
				page.id = item.page_id;
				page.number = item.page_number;
				page.base_url = item.base_url + item.year + "/" + item.month + "/" + item.day + "/" + item.folder + "/"
				
				page.small = page.base_url + item.small;
				page.medium = page.base_url + item.medium;
				page.large = page.base_url + item.large;
				
				pages.push(page);
			});
			
			$.mobile.loading('hide');
			window.sessionStorage.pages = JSON.stringify(pages);
			window.sessionStorage.currentPage = 0;
			if(success){
				success();
			}
		}else{
			console.log(response.error.text);
		}
		
	}, "json").fail(function(e){failure(e)});
}

function loadPages(){
	getPages(function(){
		var pages = JSON.parse(window.sessionStorage.pages);
		$.each(pages, function(index, page){
			$("#pages").append('<li><a href="' + page.large + '" rel="external"><img src="' + page.medium + '" alt="Page #' + page.number + '" /></a></li>');
		});
		//$("#pages a").photoSwipe({allowUserZoom: true, enableMouseWheel: false, enableKeyboard: false});
	});
}

function loadPage(page, section){
	
	$("#section-page #page").attr("src", page.medium);
	$("#section-page #zoom").attr("href", "zoom.html?index=" + page.number);
	//$("#section-page #zoom").attr("data-prefetch", "true");
	
	$(document).off("swipeleft").on("swipeleft", "#section-page", nextPage);
	$(document).off("swiperight").on("swiperight", "#section-page", prevPage);
}

function nextPage(){
	var index = parseInt(window.sessionStorage.currentPage);
	var pages = JSON.parse(window.sessionStorage.pages);
	
	if(index < pages.length){
		//window.sessionStorage.currentPage = index + 1;
		//$.mobile.changePage("section.html?current=" + (index + 1));
		showPage(index + 1);
	}
}

function prevPage(){
	var index = parseInt(window.sessionStorage.currentPage);
	//var pages = JSON.parse(window.sessionStorage.pages);
	
	if(index > 0){
		//window.sessionStorage.currentPage = index - 1;
		//$.mobile.changePage("section.html?current=" + (index - 1), {reverse: true});
		showPage(index - 1);
	}
}

function showPage(number){
	var pages = JSON.parse(window.sessionStorage.pages);
	var page = pages[number];
	
	var index = JSON.parse(window.sessionStorage.currentSection);
	var sections = JSON.parse(window.sessionStorage.sections);
	var section = sections[index];
	
	window.sessionStorage.currentPage = number;
	
	$("#section-page #title").html(section.title);
	$("#section-page #subtitle").html("P&aacute;gina #" + page.number);
	$("#section-page #back").attr("href", "edition_" + ((number % 2 == 0) ? "even" : "odd") + ".html");
	loadPage(page);
	$("#tabs-panel").panel("close");
	$("#tabs-panel ul .ui-btn-active").removeClass("ui-btn-active")
	$("#tabs-panel ul #tab-" + number).addClass("ui-btn-active");
	
	//$.mobile.changePage("section.html?current=" + (number), {reverse: true});
}


function zoomPage(page){
	$("#zoom-page #page").attr("src", page.large);
	$("#zoom-page #subtitle").html("P&aacute;gina #" + page.number);
	
	var index = parseInt(window.sessionStorage.currentSection);
	var sections = JSON.parse(window.sessionStorage.sections);
	var section = sections[index];
	$("#zoom-page #title").html(section.title);
}

function zoomNext(){
	var index = parseInt(window.sessionStorage.currentSection) + 1;
	var pages = JSON.parse(window.sessionStorage.pages);
	window.sessionStorage.currentSection = index;
	
	if(index + 1 < pages.length){
		index++;
		zoomPage(pages[index]);
	}
}

function zoomLast(){
	var index = parseInt(window.sessionStorage.currentSection);
	var pages = JSON.parse(window.sessionStorage.pages);
	window.sessionStorage.currentSection = index;
	
	if(index > 0){
		index--;
		zoomPage(pages[index]);
	}
}


function getMedia(page){
	if(page == undefined){
		var index = parseInt(window.sessionStorage.currentPage);
		var pages = JSON.parse(window.sessionStorage.pages);
		page = pages[index];
	}
	
	var args = {page_id: page.id};
	//var args = {page_id: 15228};
	var list = [];
	
	$.post(mediaURL, args, function(response){
		var items = response.items;
		if(items != null){
			$.each(items, function(index, item){
				media = {};
				
				media.id = item.tag_id;
				media.url = item.tag_url;
				media.title = item.tag_title;
				media.description = item.tag_text;
				media.type = item.tipo;
				
				list.push(media);
			});
			
			$("#section-page #media-btn").show();
			mediaPanel(list);
			
			window.sessionStorage.media = JSON.stringify(list);
			window.sessionStorage.currentMedia = 0;
		}else{
			$("#section-page #media-btn").hide();
			console.log(JSON.stringify(response));
		}
		
	}, "json").fail(function(e){failure(e)});
	
}

function mediaPanel(media){
	if(media == undefined){
		media = JSON.parse(window.sessionStorage.media);
	}
	
	var title;
	var panel = $("#media-panel ul").html("");
	$.each(media, function(i, item){
		title = item.title || item.type;
		panel.append('<li><a onclick="showMedia(' + i + ');" data-role="button" data-iconpos="right">' + title + '</a></li>');
	});
	
	panel.listview("refresh");
}

function showMedia(index){
	var list = JSON.parse(window.sessionStorage.media);
	var media = list[index];
	window.sessionStorage.currentMedia = index;
	
	if(media.type = "video"){
		$.mobile.changePage("video.html");
	}else{
		$.mobile.changePage("audio.html");
	}
}


