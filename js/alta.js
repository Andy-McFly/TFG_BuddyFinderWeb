function guardarPerro() 
{
    if(($("#chip").val().trim().length == 0) || ($("#nombre").val().trim().length == 0) || 
        ($("#raza").val().trim().length == 0) || ($("#descripcion").val().trim().length == 0))
    {
        alertify.error("Todos los datos son obligatorios");
        return;
    }

    if(!/^[0-9]{15}$/.test($("#chip").val().trim()))
    {
        alertify.error("Código de microchip no válido");
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
        url: "http://localhost:8080/perros",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            chipPerro: $("#chip").val().trim(),
            nombrePerro: $("#nombre").val().trim(),
            edadPerro: $("#edad").val(),
            razaPerro: $("#raza").val().trim(),
            tamanoPerro: $("#tamano").val(),
            descripcionPerro: $("#descripcion").val(),
            altaPerro: $("#alta").val(),
            refugio: {
                idRefugio: localStorage.getItem("refugioId")
            }
        }),
        success: function (perro) 
        {
            if($("#foto")[0].files.length > 0)
            {
                subirFoto(perro.idPerro);
            }
            else
            {
                alert("Perro actualizado correctamente");
                window.location = "panel.html";
            }
        },
        error: function(respuesta)
        {
            var refugioId = localStorage.getItem("refugioId");
            var perro = respuesta.responseJSON;
            alertify.alert(
                "Aviso",
                "<b>No se ha registrado el perro.</b><br><br>" +
                "Ya existe en la base de datos un perro con el mismo microchip.<br><br>" +
                "Para realizar una transferencia contacte con el administrador:<br>" +
                "<a href='mailto:andres.mrom@gmail.com' title='mail to'>andres.mrom@gmail.com</a><br><br>" +
                "Indicando en el mensaje:<br>" +
                "Asunto: <b>Transferencia</b><br>" +
                "ID del perro: <b>" + perro.idPerro + "</b><br>" +
                "Microchip: <b>" + perro.chipPerro + "</b><br>" +
                "ID del refugio: <b>" + refugioId + "</b><br>"
            );
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
        success: function()
        {
            alert("Perro añadido correctamente");
            window.location = "panel.html";
        }
    });
}

function volver() 
{
    window.location = "panel.html";
}