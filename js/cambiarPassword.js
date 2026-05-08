function cambiarPassword() 
{
    const passwordNueva = $("#passwordNueva").val();
    const passwordRepetida = $("#passwordRepetida").val();

    if (passwordNueva != passwordRepetida) 
    {
        $("#mensajeError").text("Las contraseñas no coinciden");
    }

    else if(passwordNueva.length < 8)
    {
        $("#mensajeError").text("La contraseña debe tener al menos 8 caracteres");
    }

    else 
    {
        const id = localStorage.getItem("refugioId");
        const datos = {
            passwordRefugio: passwordNueva
        };

        $.ajax({
            url: "http://localhost:8080/refugios/" + id + "/password",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function () 
            {
                alert("Contraseña cambiada correctamente");
                window.location = "panel.html";
            },
            error: function () 
            {
                $("#mensajeError").text("Error cambiando la contraseña");
            }
        });
    }
}