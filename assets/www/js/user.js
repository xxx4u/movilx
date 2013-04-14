var signupURL  = "http://media.nuestrodiario.com/MovilX/mobileOps/userRegistration.php";
var signinURL  = "http://media.nuestrodiario.com/MovilX/mobileOps/usercheck.php";
var profileURL = "http://media.nuestrodiario.com/MovilX/mobileOps/userProfile.php";
var updateURL  = "http://media.nuestrodiario.com/MovilX/mobileOps/userUpdate.php";

function failure(e){
	console.log(e);
	
	navigator.notification.alert("Ocurrió un problema, por favor intenta más tarde.", function(){}, "Error", "Aceptar");
	enable("#submit-button");
	$.mobile.loading('hide');
}

function login(username, password, success, error){
    $.post(signinURL, {username: username, password: password}, function(response){
    	if(success){
    		success(response);
    	}
    	
        if(response != 0){
        	userID = response;
            movilxUserId = response;
            //navigator.notification.alert("Bienvenido a NuestroDiario Digital.", function(){}, "Bienvenido", "Aceptar");
            
            window.localStorage["username"] = username;
            window.localStorage["password"] = password;
            
            $.mobile.changePage(path("/edition/index.html"));
        }else{
            navigator.notification.alert("Usuario o password inválido.", function(){}, "Error", "Aceptar");
            //$.mobile.changePage("user/signin.html");
        }
        
    },"json").fail(function(e){failure(e);});
    
    return false;
}

function autoLogin(){
    var username = window.localStorage["username"];
    var password = window.localStorage["password"];
    
    if(username != undefined && password != undefined){
    	$.mobile.loading('show', {text: "Iniciando sesión...", textVisible: true});
        login(username, password, function(){
        	$.mobile.loading('hide');
        }, function(e){
			failure(e);
		});
    }
}

function signin(){
    var form = $("#sign-in-form");
    var username = $("#username", form).val();
    var password = $("#password", form).val();
    
    if(username != '' && password != ''){
    	disable("#submit-button");
    	$.mobile.loading('show', {text: "Iniciando sesión...", textVisible: true});
    	
        login(username, password, function(){
        	$.mobile.loading('hide');
        	enable("#submit-button");
        }, function(e){
			failure(e);
		});
    }else{
        navigator.notification.alert("Debes ingresar tu usuario y password.", function(){}, "Error", "Aceptar");
    }
    
    enable("#submit-button");
    
    return true;
}

function signup(){
	var form = $("#sign-up-form");
	
	disable("#submit-button");
	
	var username = $("#username", form).val();
	var password = $("#password", form).val();
	var email = $("#email", form).val();
	
	var args = {username: username, password: password, email: email};
    $.post(signupURL, args, function(response){
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
        
        enable("#submit-button");
    	
    }, "json").fail(function(e){failure(e);});
    
    enable("#submit-button");
    
    return true;
}

function profile(){
	if(userID != 0){
		$.mobile.loading('show', {text: "Cargando...", textVisible: true});
		disable("#submit-button");
		
		$.post(profileURL, {username: userID}, function(response){
			$.mobile.loading('hide');
			if(response != 0){
				var user = response.items[0].userData;
				$("#username").val(user.account_name);
				$("#email").val(user.account_email);
				$("#password").val(user.account_password);
				
				enable("#submit-button");
			}
		}, "json").fail(function(e){failure(e);});
	}
}

function updateProfile(){
	if(userID != 0){
		$.mobile.loading('show', {text: "Actualizando...", textVisible: true});
		disable("#submit-button");
		
		var username = $("#username").val();
		var email = $("#email").val();
		var password = $("#password").val();
		
		var args = {userid: userID, username: username, password: password, email: email};
		$.post(updateURL, args, function(response){
			// check response ?
			$.mobile.loading('hide');
			enable("#submit-button");
			navigator.notification.alert("Cuenta actualizada con éxito.", function(){}, "Alerta", "Aceptar");
		}, "json").fail(function(e){failure(e);});
	}
}

function logout(){
	window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
}