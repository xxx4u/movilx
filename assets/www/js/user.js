var signupURL = "http://media.nuestrodiario.com/MovilX/mobileOps/userRegistration.php";
var signinURL = "http://media.nuestrodiario.com/MovilX/mobileOps/usercheck.php?method=login&returnformat=json";


function failure(e){
	navigator.notification.alert("Ocurrió un error interno, por favor intente más tarde.", function(){}, "Error", "Aceptar");
	console.log(e);
	$("#submit-button").removeAttr("disabled");
}


function login(username, password){
    $.post(signinURL, {username: username, password: password}, function(response){
        if(response != 0){
            movilxUserId = response;
            navigator.notification.alert("Bienvenido a NuestroDiario Digital.", function(){}, "Bienvenido", "Aceptar");
            
            // store
            window.localStorage["username"] = username;
            window.localStorage["password"] = password;
            $.mobile.changePage("editionlist-cards.html", {transition: 'slide'});
        }else{
            navigator.notification.alert("Usuario o password inválido.", function(){}, "Error", "Aceptar");
        }
        
        $("#submit-button").removeAttr("disabled");
        
    },"json").fail(function(e){failure(e);});
    
    return false;
}

/*
*  Fecha Creacion: Enero 28, 2013
*  Creado por: Edwin Maldonado ERMP
*  Descripcion: Control de login.
*/

function autoLogin(){
    var username = window.localStorage["username"];
    var password = window.localStorage["password"];
        
    if(username != undefined && password != undefined){
        login();
    }
}

function signin(){
    var form = $("#sign-in-form");    
    
	$("#submit-button", form).attr("disabled", "disabled");	//disabling to avoid resubmits
    
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    
    if(u != '' && p!= ''){
        login();
    }else{
        navigator.notification.alert("Debes ingresar tu usuario y password.", function(){}, "Error", "Aceptar");
    }
    
    $("#submit-button", form).removeAttr("disabled");
    
    return true;
}


/*
*  Fecha Creacion: Febrero 2, 2013
*  Creado por: Edwin Maldonado ERMP
*  Descripcion: Llevar registro de usuarios
*/

function signup(){
	var form = $("#sign-up-form");
	
	$("#submit-button", form).attr("disabled", "disabled");	// disabling to avoid resubmits
	
	var username = $("#username", form).val();
	var password = $("#password", form).val();
	var email = $("#email", form).val();
	
    $.post(signupURL, {username: username, password: password, email: email}, function(response){
    	console.log(response);
    	
        if(response == true){
            navigator.notification.alert("Registro completado, bienvenido", function(){}, "Bienvenido", "Aceptar");          
            login(username, password);	// auto login
        }else{
            if(response == '0'){ // Username repetido.
              navigator.notification.alert("Error al registrarse: Usuario ya existe, escoge uno diferente.", function(){}, "Error", "Aceptar");
            }else{
              navigator.notification.alert("Error al registrarse: ", function(){}, "Error", "Aceptar");  
            }
        }
        
    	$("#submit-button").removeAttr("disabled");
    	
    }, "json").fail(function(e){failure(e);});
    $("#submit-button", form).removeAttr("disabled");
    
    return true;
}
