var signupURL   = "http://media.nuestrodiario.com/MovilX/mobileOps2/user_registration.php";
var signinURL   = "http://media.nuestrodiario.com/MovilX/mobileOps2/user_in.php";
var signoutURL  = "http://media.nuestrodiario.com/MovilX/mobileOps2/user_out.php";
var profileURL  = "http://media.nuestrodiario.com/MovilX/mobileOps2/get_profile.php";
var updateURL   = "http://media.nuestrodiario.com/MovilX/mobileOps2/set_profile.php";
var resetURL    = "http://media.nuestrodiario.com/MovilX/mobileOps2/passwd_recovery.php";
var passwordURL = "http://media.nuestrodiario.com/MovilX/mobileOps2/set_password.php";

function failure(e){
	console.log(JSON.stringify(e));
	navigator.notification.alert("Ocurrió un problema, por favor intenta más tarde.", function(){}, "Error", "Aceptar");
	enable("#submit-button");
	$.mobile.loading('hide');
}

function signed_in(event){
	if(typeof window.sessionStorage.session == 'undefined"'){
		event.preventDefault();
		$.mobile.changePage("index.html", {transition: "none"});
	}
}

function login(username, password, success, error){
    $.post(signinURL, {username: username, password: password}, function(response){
    	if(success){
    		success(response);
    	}
    	
        if(response.items != undefined){
        	//navigator.notification.alert("Bienvenido a NuestroDiario Digital.", function(){}, "Bienvenido", "Aceptar");
            
            window.localStorage.username = username;
            window.sessionStorage.password = password;
            window.sessionStorage.session = response.items[0].session_id;
            $.mobile.changePage("editions.html");
        }else{
        	console.log(JSON.stringify(response));

        	var error = "Ocurrió un error, intenta más tarde.";
        	if(response.error != undefined){
        		error = response.error[0].text;
        	}
        		
        	navigator.notification.alert("Error: " + error, function(){}, "Error", "Aceptar");
            $.mobile.changePage("signin.html");
        }
    	
        
    },"json").fail(function(e){failure(e);});
    
    return false;
}

function autoLogin(dest){
    var username = window.localStorage.username;
    var password = window.sessionStorage.password;
    
    if(typeof username != 'undefined' && typeof password != 'undefined'){
    	logout();
    	$.mobile.loading('show', {text: "Iniciando sesión...", textVisible: true});
        login(username, password, function(){
        	$.mobile.loading('hide');
        }, function(e){
			failure(e);
		});
    }else{
    	if(typeof dest != 'undefined'){
    		$.mobile.changePage(dest);
    	}
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
	var name = $("#name", form).val();
	var lastname = $("#lastname", form).val();
	var password = $("#password", form).val();
	var email = $("#email", form).val();
	
	var args = {username: username, name: name, lastname: lastname, password: password, email: email};
    $.post(signupURL, args, function(response){
    	console.log(JSON.stringify(response));
    	
        if(response.items != undefined){
            navigator.notification.alert("Registro completado, bienvenido.", function(){}, "Bienvenido", "Aceptar");          
            login(username, password);	// auto login
        }else{
        	navigator.notification.alert("Error al registrarse: " + response.error[0].text, function(){}, "Error", "Aceptar");  
        }
        
        enable("#submit-button");
    	
    }, "json").fail(function(e){failure(e);});
    
    enable("#submit-button");
    
    return true;
}

function profile(){
	var username = window.localStorage.username;
	var session = window.sessionStorage.session;
	
	if(username != undefined){
		$.mobile.loading('show', {text: "Cargando...", textVisible: true});
		disable("#submit-button");
		
		$.post(profileURL, {username: username, session: session}, function(response){
			$.mobile.loading('hide');
			if(response.items != undefined){
				var user = response.items[0];
				$("#username").val(user.username);
				$("#email").val(user.email);
				$("#name").val(user.name);
				$("#lastname").val(user.lastname);
			}else{
				navigator.notification.alert("Error: " + response.error[0].text, function(){}, "Error", "Aceptar");
			}
			
			enable("#submit-button");
		}, "json").fail(function(e){failure(e);});
	}
}

function updateProfile(){
	var username = window.localStorage.username;
	var session = window.sessionStorage.session;
	
	if(username != undefined){
		$.mobile.loading('show', {text: "Actualizando...", textVisible: true});
		disable("#submit-button");
		
		var username = $("#username").val();
		var email = $("#email").val();
		var name = $("#name").val();
		var lastname = $("#lastname").val();
		
		var args = {session: session, username: username, name: name, lastname: lastname, email: email};
		$.post(updateURL, args, function(response){
			// check response ?
			$.mobile.loading('hide');
			enable("#submit-button");
			navigator.notification.alert("Cuenta actualizada con éxito.", function(){}, "Alerta", "Aceptar");
		}, "json").fail(function(e){failure(e);});
	}
}

function logout(skipRedirect){
	var username = window.localStorage.username;
	$.post(signoutURL, {username: username}, function(response){

        if(response.items[0].closed == "OK"){
        	window.localStorage.removeItem("username");
        	window.sessionStorage.removeItem("password");
        	window.sessionStorage.removeItem("session");

            if(typeof skipRedirect == 'undefined'){
                $.mobile.changePage("index.html");
            }
        }else{
            if(typeof skipRedirect == 'undefined'){
                navigator.notification.alert("Error:" + response.error[0].text, function(){}, "Error", "Aceptar");
            }
        }
        
    },"json").fail(function(e){failure(e);});
	
}

function passwordReset(){
	var login = $("#login").val();
	if(login != ''){
	    $.mobile.loading('show', {text: "Procesando...", textVisible: true});
	    disable("#reset-button");

        $.post(resetURL, {email_or_account: login, generate: 1}, function(response){

            if(response.items != undefined && response.items.email_sent == "OK"){
                window.sessionStorage.removeItem("password");
                window.sessionStorage.removeItem("session");

                $('#login-collapse').trigger("expand");
                navigator.notification.alert("Se ha enviado una nueva contraseña a: " + response.items.account_email, function(){}, "Atención", "Aceptar");
            }else{
                navigator.notification.alert(response.error[0].text, function(){}, "Error", "Aceptar");
            }

            $.mobile.loading('hide');
            enable("#reset-button");

        },"json").fail(function(e){failure(e);});
    }
}

function passwordChange(){
	var session = window.sessionStorage.session;
    var password = $("#password").val();
    var confirm = $("#confirm").val();

	if(password != ''){
	    if(password == confirm){
	        $.mobile.loading('show', {text: "Actualizando...", textVisible: true});
            disable("#password-change-button");

            var args = {session: session, passw: password};
            $.post(passwordURL, args, function(response){
                console.log(JSON.stringify(response));

                if(typeof response.error == 'undefined'){
                    window.sessionStorage.password = password;

                    $('#profile-collapse').trigger("expand");
                    navigator.notification.alert("Contraseña cambiada con éxito.", function(){}, "Alerta", "Aceptar");
                }else{
                    navigator.notification.alert(response.error[0].text, function(){}, "Error", "Aceptar");
                }

                $.mobile.loading('hide');
                enable("#password-change-button");

            }, "json").fail(function(e){failure(e);});
	    }else{
	        navigator.notification.alert("Las contraseñas no coinciden.", function(){}, "Error", "Aceptar");
	    }
	}else{
	    navigator.notification.alert("Tu contraseña no puede estar en blanco.", function(){}, "Error", "Aceptar");
	}
}