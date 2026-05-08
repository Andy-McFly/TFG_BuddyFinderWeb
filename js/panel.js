$(document).ready(function()
{
    var id = localStorage.getItem("refugioId");
    $("#nombreRefugio").text(localStorage.getItem("nombreRefugio"));
    $("#ciudadRefugio").text(localStorage.getItem("ciudadRefugio") + " #" + id);
});

$(document).ready(function()
{
    cargarPerros();
});

$(document).ready(function()
{
    comprobarSolicitudesPendientes();
});

$(document).on('change', '#filtroEstado', function() 
{
    cargarPerros();
});
$(document).on('change', '#orden', function() 
{
    cargarPerros();
});
$(document).on('input', '#buscar', function()
{
    cargarPerros();
});
$(document).on('click', "#visor", function()
{
    $(this).hide();
});

function cargarPerros()
{
    var id = localStorage.getItem("refugioId");

    $.get("http://localhost:8080/refugios/" + id + "/perros", function(perros)
    {
        $("#tablaPerros tbody").empty();

        var filtro = $("#filtroEstado").val();
        var orden = $("#orden").val();
        var nombreBuscar = $("#buscar").val().toLowerCase();

        if(nombreBuscar.length > 0)
        {
            perros = perros.filter(function(perro) {
                return perro.nombrePerro.toLowerCase().includes(nombreBuscar);
            });
        }
        if(filtro == 0)
        {
            perros = perros.filter(function(perro) {
                return perro.estadoPerro == 0;
            });
        }
        if(filtro == "1")
        {
            perros = perros.filter(function(perro) {
                return perro.estadoPerro == 1;
            });
        }
        if(orden == "nombre")
        {
            perros.sort(function(a, b) {
                if (a.nombrePerro.toLowerCase() > b.nombrePerro.toLowerCase()) {
                    return 1;
                }
                if (a.nombrePerro.toLowerCase() < b.nombrePerro.toLowerCase()) {
                    return -1;
                }
                return 0;
            });
        }
        if(orden == "fecha") 
        {
            perros.sort(function(a, b) {
                return new Date(b.altaPerro).getTime() - new Date(a.altaPerro).getTime();
            });
        }

        for(var i = 0; i < perros.length; i++)
        {
            var perro = perros[i];
            var estado;
            var fecha = new Date(perro.altaPerro).toLocaleDateString();

            if(perro.estadoPerro == 0)
            {
                estado = "<span style='color:green'>Disponible</span>";
            } 
            else
            {
                estado = "<span style='color:red'>No disponible</span>";
            }

            $("#tablaPerros tbody").append(

                "<tr style='text-align:center'>" +
                "<td>" + perro.idPerro + "</td>" +
                "<td><img src='http://localhost:8080/uploads/" + perro.fotoPerro + "' width='80' onclick='verImagen(this.src)'></td>" +
                "<td>" + perro.nombrePerro + "</td>" +
                "<td>" + perro.razaPerro + "</td>" +
                "<td>" + perro.edadPerro + "</td>" +
                "<td>" + perro.tamanoPerro + "</td>" +
                "<td>" + fecha + "</td>" +
                "<td>" + estado + "<button class='buttonTabla' onclick='cambiarEstado(" + perro.idPerro + "," + perro.estadoPerro + ")'>Cambiar Estado</button></td>" +
                
                "<td>" +
                "<button class='buttonTabla' onclick='editarPerro(" + perro.idPerro + ")'>Editar</button>" +
                "<button class='buttonTabla' onclick='borrarPerro(" + perro.idPerro + ")'>Baja</button>" +
                "</td>" +

                "</tr>"
            );
        }
    });
}

function irNuevoPerro()
{
    window.location = "alta.html";
}

function borrarPerro(id)
{
    alertify.confirm(
        "Baja",
        "Selecciona el motivo de la baja:<br><br>" +
        "<select id='motivoBaja'>" +
        "<option value='ADOPTADO'>Adoptado</option>" +
        "<option value='TRANSFERENCIA'>Transferencia</option>" +
        "<option value='OTROS'>Otros</option>" +
        "</select>",
        function()
        {
            var motivo = $("#motivoBaja").val();
            $.ajax({
                url: "http://localhost:8080/perros/" + id + "/baja?motivo=" + motivo,
                type: "PUT",
                success: function()
                {
                    alertify.success("Baja completada correctamente");
                    cargarPerros();
                }
            });
        },
        function()
        {
            alertify.message("Cancelado");
        }
    );
}

function editarPerro(id)
{
    window.location = "editar.html?id=" + id;
}

function cambiarEstado(id, estado)
{
    var mensaje;

    if(estado == 0)
    {
        mensaje = "¿Marcar como <b>No disponible</b>?"
    }
    else
    {
        mensaje = "¿Marcar como <b>Disponible</b>?"
    }

    alertify.confirm("Cambiar Estado", mensaje,
        function()
        {
            $.ajax({
                url: "http://localhost:8080/perros/" + id + "/disponible",
                type: "PUT",

                success: function()
                {
                    location.reload();
                },

                error: function(xhr)
                {
                    if(xhr.status == 409)
                    {
                        alertify.alert(
                            "Aviso",
                            "<b>No se puede cambiar el estado.</b><br><br>" +
                            "El perro pertenece a una solicitud ya aceptada."
                        );
                    }
                    else
                    {
                        alertify.error("Error inesperado al cambiar el estado");
                    }
                }
            });
        },
        function()
        {
            alertify.message("Cancelado");
        });
}

function verImagen(src)
{
    $("#imagenGrande").attr("src", src);
    $("#visor").css("display", "flex");
}

function comprobarSolicitudesPendientes()
{
    var idRefugio = localStorage.getItem("refugioId");
    $.get("http://localhost:8080/solicitudes/refugio/" + idRefugio,
        function(lista)
        {
            var pendientes = lista.filter(function(s)
            {
                return s.estadoSolicitud == "PENDIENTE";
            });

            if(pendientes.length > 0)
            {
                $("#avisoSolicitudes")
                    .html("⚠ Tiene " + pendientes.length + " solicitudes pendientes").css("cursor","pointer")
                    .click(function(){window.location = "solicitudes.html";})
                    .show();
            }
        }
    );
}