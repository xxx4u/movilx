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
	$(selector).load('');
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
	
	if(typeof start == 'undefined'){
		start = lastWeek();
	}else{
		start = start;
	}
	start = formatDate(start);
	
	if(typeof end == 'undefined'){
		end = today();
	}else{
		end = end;
	}
	end = formatDate(end);
	
	var args = {"s_date": start, "e_date": end};
	
	$.post(editionsURL, args, function(data){
		if(typeof success != 'undefined'){
			success();
		}
		if(data.items == null){
			$('#editions-page #editions').html("<center><h4>No se encontraron resultados.</h4></center>");
		}else{
			$('#editions-page #editions').html("");
			$.each(data.items, function(index, edition){
				var date = edition.fixed_slash_date;
				console.log(getEditionURL(date));
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
	if(typeof sections == 'undefined'){
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
	var url = getSectionURL(section);
	$(dest + " #loader").show();
	//$(dest + " #section").attr('src', getSectionURL(section));
	window.loadImage(url, function(img){
        if(img.type === 'error'){
            console.log('Error loading section image.' + url);
        }else{
        	$(dest + " #section").attr('src', url);
        	$(dest + " #loader").hide();
        }
    },{});
	$(dest).one("swipeleft", nextSection);
	$(dest).one("swiperight", prevSection);
}

function nextSection(){
	var index = parseInt(window.sessionStorage.currentSection) + 1;
	var sections = JSON.parse(window.sessionStorage.sections);
	
	if(index < sections.length){
		window.sessionStorage.currentSection = index;
		var even = index % 2 == 0 ? "even" : "odd";
		$.mobile.changePage("edition_" + even + ".html");
	}
}

function prevSection(){
	var index = parseInt(window.sessionStorage.currentSection);
	
	if(index > 0){
		index--;
		window.sessionStorage.currentSection = index;
		var even = index % 2 == 0 ? "even" : "odd";
		$.mobile.changePage("edition_" + even + ".html", {reverse: true});
	}else{
		$("#sections-panel").panel("open");
	}
}

// deprecated
function showSectionOld(index){
    console.log(index);
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

function showSection(index){
    console.log(index);
	var i = window.sessionStorage.currentSection;
	window.sessionStorage.currentSection = index;
    $.mobile.changePage("edition_even.html");
}

function sectionsPanel(sections){
	var index = parseInt(window.sessionStorage.currentSection);
	if(typeof sections == 'undefined'){
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

function sectionsPage(sections){
	var index = parseInt(window.sessionStorage.currentSection);
	if(typeof sections == 'undefined'){
		sections = JSON.parse(window.sessionStorage.sections);
	}
	var section = sections[index];
	var images = {};

	images['Metro'] = 'metro';
	images['Regional Sur'] = 'sur';
	images['Regional Norte'] = 'norte';
	images['Regional Oriente'] = 'oriente';

	images['Regional Centro'] = 'centro_occidente';
	images['Regional SurOccidente'] = 'sur_occidente';
    images['Regional SurOriente'] = 'sur_oriente';
    images['Regional Xela'] = 'xela';

	images['Regional Occidente'] = 'occidente';
    images['Regional Frontera'] = 'frontera';

	images['Regional Verapaz'] = 'verapaz';

	var image;
	var list = $('#editions-grid');
	list.html('');
	$.each(sections, function(i, section){
		image = images[section.title];

		if(typeof image != 'undefined'){
		    if(i == index){
                image += '_alt';
            }
		    list.append('<a href="#" onclick="showSection(' + i + ');"><img src="images/editions/' + image + '.png" alt="' + section.title + '" width="24%"></a>');
		}

		if(i == 7){
		    //list.append('<img src="images/editions/blue1.png" width="24%">');
		}else if(i == 10){
            list.append('<img src="images/editions/blue1.png" width="24%">');
            list.append('<img src="images/editions/white1.png" width="24%">');
        }else if(i == 11){
            list.append('<img src="images/editions/blue1.png" width="24%">');
            list.append('<img src="images/editions/white1.png" width="24%">');
            //list.append('<img src="images/editions/white1.png" width="24%">');
        }
	});
	list.append('<a href="sections_menu.html"><img src="images/editions/secciones.png" width="23%"></a>');
}


function getTabs(section){
	if(typeof section == 'undefined'){
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
			window.sessionStorage.tabs = JSON.stringify([]);
			console.log(JSON.stringify(response));
		}
		
	}, "json").fail(function(e){failure(e)});
}

function tabsPanel(pages, tabs){
	var index = parseInt(window.sessionStorage.currentPage);
	if(typeof tabs == 'undefined'){
		tabs = JSON.parse(window.sessionStorage.tabs);
	}
	
	var panel = $("#tabs-panel ul").html("");
	var klass = "";
	
	if(tabs.length == 0){
		$.each(pages, function(i, page){
			if(i == index){
				klass = 'class="ui-btn-active"';
			}else{
				klass = '';
			}
			panel.append('<li id="tab-' + i + '"' + klass + '><a onclick="showPage(' + i + ');" data-role="button" data-iconpos="right"> Página #' + page.number + '</a></li>');
		});
	}else{
		$.each(tabs, function(i, tab){
			if(i == index){
				klass = 'class="ui-btn-active"';
			}else{
				klass = '';
			}
			panel.append('<li id="tab-' + i + '"' + klass + '><a onclick="showPage(' + (tab.page_number - 1) + ');" data-role="button" data-iconpos="right">' + tab.title + '</a></li>');
		});
	}
	
	
	panel.listview("refresh");
}

function tabsPage(pages, tabs){
	var index = parseInt(window.sessionStorage.currentPage);
	if(typeof tabs == 'undefined'){
		tabs = JSON.parse(window.sessionStorage.tabs);
	}

	var images = {};

    images['Nacionales'] = 'pais';
    images['Opinion'] = 'opinion';
    images['Mundo'] = 'mundo';
    images['Deporte'] = 'deportes';

    images['Estrellas y Familia'] = 'estrellas';

    var image;
    var list = $('#sections-grid');
    list.html('');

	if(tabs.length > 0){
		$.each(tabs, function(i, tab){
			image = images[tab.title];

            if(typeof image != 'undefined'){
                if(i == index){
                    image += '_alt';
                }
                list.append('<a href="#" onclick="showTab(' + (tab.page_number - 1) + ');"><img src="images/sections/' + image + '.png" alt="' + tab.title + '" width="23%"></a>');
            }

            if(i == 5){
                list.append('<img src="images/sections/white1.png" width="23%">');
                list.append('<img src="images/sections/blue1.png" width="23%">');
            }else if(i == 6){
                list.append('<img src="images/sections/white1.png" width="23%">');
                list.append('<img src="images/sections/blue1.png" width="23%">');
                list.append('<img src="images/sections/white1.png" width="23%">');

                list.append('<img src="images/sections/blue1.png" width="23%">');
                list.append('<img src="images/sections/white1.png" width="23%">');
                list.append('<img src="images/sections/blue1.png" width="23%">');
                //list.append('<img src="images/sections/white1.png" width="23%">');
            }
		});
	}
	list.append('<a href="editions_menu.html"><img src="images/sections/regionales.png" width="23%"></a>');
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

function loadPages(pages){
	$('#section-page #pages').html();
	$.each(pages, function(index, page){
		$('#section-page #pages').append('<dt style="display:none">'+
			'<ul data-role="listview" data-inset="true" class="loc-card"><li class="loc-image">' +
			'<div><a href="zoom.html"><img src="' + page.medium + '" alt="Page #' + page.number + '"/></a></div>' +
			'</li></ul></dt>'
		);
	});
	$('#section-page #pages ul').listview();
	$(document).off("swipeleft").on("swipeleft", "#section-page", nextPage);
	$(document).off("swiperight").on("swiperight", "#section-page", prevPage);
}

function nextPage(){
	var index = parseInt(window.sessionStorage.currentPage);
	var pages = JSON.parse(window.sessionStorage.pages);
	
	if(index + 1 < pages.length){
		showPage(index + 1);
	}
}

function prevPage(){
	var index = parseInt(window.sessionStorage.currentPage);
	
	if(index > 0){
		showPage(index - 1);
	}else{
		$('#tabs-panel').panel('open');
	}
}

function showPage(number){
	if(typeof number == 'undefined'){
		number = 0;
	}
	window.sessionStorage.currentPage = number;
	
	$('#section-page #subtitle').html('P&aacute;gina #' + (number + 1));
	$('#section-page #pages dt.current').hide().toggleClass('current');
	$('#section-page #pages dt:nth-child(' + (number + 1) + ')').show().toggleClass('current');
	
	$('#tabs-panel').panel('close');
	$('#tabs-panel ul .ui-btn-active').removeClass('ui-btn-active')
	$('#tabs-panel ul #tab-' + number).addClass('ui-btn-active');
	
	getMedia();
	$('html,body').animate({scrollTop: 0}, 0);
}

function showTab(number){
    window.sessionStorage.currentPage = number;
    $.mobile.changePage("pages.html");
}


function zoomPage(page){
	$("#zoom-page #page").attr("src", page.medium);
	window.loadImage(page.large, function(img){
        if(img.type === 'error'){
            console.log('Error loading image ' + page.large);
        }else{
        	console.log('large image loading completed.');
        	$("#zoom-page #page").attr("src", page.large);
        }
    },{});
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
	if(typeof page == "undefined"){
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
			//console.log(JSON.stringify(response));
		}
		
	}, "json").fail(function(e){failure(e)});
	
}

function mediaPanel(media){
	if(typeof media == 'undefined'){
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


