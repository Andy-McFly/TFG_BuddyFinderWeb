alertify.set('notifier','delay', 3);

function login()
{
    const datos = {
        emailRefugio: $("#email").val(),
        passwordRefugio: $("#password").val()
    };

    $.ajax({
        url: "http://localhost:8080/refugios/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function(respuesta)
        {
            if(respuesta && respuesta.idRefugio)
            {
                localStorage.setItem("refugioId", respuesta.idRefugio);
                localStorage.setItem("nombreRefugio", respuesta.nombreRefugio);
                localStorage.setItem("ciudadRefugio", respuesta.ciudadRefugio);

                if(respuesta.primerLogin)
                {
                    window.location = "cambiarPassword.html";
                }
                else
                {
                    window.location = "panel.html";
                }
            } 
            else 
            {
                $("#mensajeError").text("Email o contraseña incorrectos");
            }
        },

        error: function()
        {
            $("#mensajeError").text("Error conectando con el servidor");
        }
    });
}

function comprobarLogin()
{
    const refugioId = localStorage.getItem("refugioId");
    if(refugioId == null)
    {
        window.location = "index.html";
    }
}

function logout()
{
    localStorage.removeItem("refugioId");
    window.location = "index.html";
}