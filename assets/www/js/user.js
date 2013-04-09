var signupURL = "http://media.nuestrodiario.com/MovilX/mobileOps/userRegistration.php";
var signinURL = "http://media.nuestrodiario.com/MovilX/mobileOps/usercheck.php?method=login&returnformat=json";


function failure(e){
	navigator.notification.alert("Ocurrió un error interno, por favor intente más tarde.", function(){}, "Error", "Aceptar");
	console.log(e);
	$("#submit-button").removeAttr("disabled");
	//$.mobile.loading('hide');
}

function login(username, password){
    $.post(signinURL, {username: username, password: password}, function(response){
        if(response != 0){
        	userID = response;
            movilxUserId = response;
            //navigator.notification.alert("Bienvenido a NuestroDiario Digital.", function(){}, "Bienvenido", "Aceptar");
            
            window.localStorage["username"] = username;
            window.localStorage["password"] = password;
            
            $.mobile.changePage(path("/edition/edition-list-cards.html"));
        }else{
            navigator.notification.alert("Usuario o password inválido.", function(){}, "Error", "Aceptar");
            //$.mobile.changePage("user/signin.html");
        }
        
        $.mobile.loading('hide');
        $("#submit-button").removeAttr("disabled");
        
    },"json").fail(function(e){failure(e);});
    
    return false;
}

function autoLogin(){
    var username = window.localStorage["username"];
    var password = window.localStorage["password"];
    
    if(username != undefined && password != undefined){
    	//$.mobile.loading('show', {text: "Iniciando sesión...", textVisible: true});
        login(username, password);
    }
}

function signin(){
    var form = $("#sign-in-form");
    var username = $("#username", form).val();
    var password = $("#password", form).val();
    
    if(username != '' && password != ''){
    	$("#submit-button", form).attr("disabled", "disabled");	// disabling to avoid resubmits
    	$.mobile.loading('show', {text: "Iniciando sesión...", textVisible: true});
    	
        login(username, password);
    }else{
        navigator.notification.alert("Debes ingresar tu usuario y password.", function(){}, "Error", "Aceptar");
    }
    
    $("#submit-button", form).removeAttr("disabled");
    
    return true;
}

function signup(){
	var form = $("#sign-up-form");
	
	$("#submit-button", form).attr("disabled", "disabled");	// disabling to avoid resubmits
	
	var username = $("#username", form).val();
	var password = $("#password", form).val();
	var email = $("#email", form).val();
	
    $.post(signupURL, {username: username, password: password, email: email}, function(response){
    	console.log(response);
    	
        if(response == true){
            navigator.notification.alert("Registro completado, bienvenido.", function(){}, "Bienvenido", "Aceptar");          
            login(username, password);	// auto login
        }else{
            if(response == '0'){ // Username repetido.
              navigator.notification.alert("Lo sentimos, el usuario ingresado ya existe, escoge uno diferente.", function(){}, "Error", "Aceptar");
            }else{
              navigator.notification.alert("Error al registrarse: ", function(){}, "Error", "Aceptar");  
            }
        }
        
    	$("#submit-button").removeAttr("disabled");
    	
    }, "json").fail(function(e){failure(e);});
    
    $("#submit-button", form).removeAttr("disabled");
    
    return true;
}

function logout(){
	window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
}