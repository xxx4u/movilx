function errorPlacement(error, element){
    element.parent().after(error);
}

// Deprecated
function basePath(){
	return window.location.href.split('www')[0] + "www";
}

function path(file){
	return $.mobile.path.makePathAbsolute(file, window.location.href);
}

function enable(selector){
	return $(selector).removeClass("ui-disabled");
}

function disable(selector){
	return $(selector).addClass("ui-disabled");
}


function today(){
	return new Date();
}

function lastWeek(){
	var d = new Date();
	d.setDate(d.getDate() - 7);
	return d;
}

function parseDate(string){
	var regex = /(\d{2})\/(\d{2})\/(\d{4})/;
	var a = regex.exec(string);
	return new Date(a[3],a[2]-1,a[1]);
}

function formatDate(date){
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
}

function prettyDate(date){
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd = date.getDate().toString();
	return (dd[1]?dd:"0"+dd[0])+ "/" + (mm[1]?mm:"0"+mm[0]) + "/" + yyyy; // padding
}

function slashDate(date){
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd = date.getDate().toString();
	return yyyy + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]); // padding
}

function checkRequirements(){
   if (navigator.connection.type == Connection.NONE){
      navigator.notification.alert('Necesitas conexión a internet para usar la aplicación.', function(){}, 'Alerta', 'Aceptar');
      return false;
   }
   return true;
}


