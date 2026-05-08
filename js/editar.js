$(document).ready(function()
{
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    cargarPerro(id);
});

function cargarPerro(id)
{
    $.get("http://localhost:8080/perros/" + id, function(perro)
    {
        $("#nombre").val(perro.nombrePerro);
        $("#edad").val(perro.edadPerro);
        $("#raza").val(perro.razaPerro);
        $("#tamano").val(perro.tamanoPerro);
        $("#descripcion").val(perro.descripcionPerro);
        $("#alta").val(perro.altaPerro);
    });
}

function modificarPerro() 
{
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");

    if(($("#nombre").val().trim().length == 0) || ($("#raza").val().trim().length == 0) || ($("#descripcion").val().trim().length == 0))
    {
        alertify.error("Todos los datos son obligatorios");
        return;
    }
    
    var fecha = $("#alta").val();
    var hoy = new Date();
    var año = hoy.getFullYear();
    var mes = String(hoy.getMonth() + 1).padStart(2, '0');
    var dia = String(hoy.getDate()).padStart(2, '0');
    hoy = año + "-" + mes + "-" + dia;

    if(fecha > hoy)
    {
        alertify.error("Fecha no válida");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/perros/" + id,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            nombrePerro: $("#nombre").val(),
            edadPerro: $("#edad").val(),
            razaPerro: $("#raza").val(),
            tamanoPerro: $("#tamano").val(),
            descripcionPerro: $("#descripcion").val(),
            altaPerro: $("#alta").val(),
        }),
        success: function () 
        {
            if($("#foto")[0].files.length > 0)
            {
                subirFoto(id);
            }
            else
            {
                alert("Perro actualizado correctamente");
                window.location = "panel.html";
            }
        }
    });
}

function subirFoto(idPerro)
{
    var formData = new FormData();
    var archivo = $("#foto")[0].files[0];
    formData.append("archivo", archivo);

    $.ajax({
        url: "http://localhost:8080/perros/" + idPerro + "/foto",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(){

            alert("Perro actualizado correctamente");
            window.location = "panel.html";

        }
    });
}

function volver() 
{
    window.location = "panel.html";
}