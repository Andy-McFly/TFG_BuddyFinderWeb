$(document).ready(function()
{
    cargarSolicitudes();
});

$(document).on('change', '#filtroEstadoSolicitud', function()
{
    cargarSolicitudes();
});

$(document).on('change', '#ordenFechaSolicitud', function()
{
    cargarSolicitudes();
});

function cargarSolicitudes()
{
    var idRefugio = localStorage.getItem("refugioId");

    $.get("http://localhost:8080/solicitudes/refugio/" + idRefugio,
        function(lista)
        {
            $("#tablaSolicitudes tbody").empty();
            var filtro = $("#filtroEstadoSolicitud").val();
            var orden = $("#ordenFechaSolicitud").val();

            if(filtro != "TODOS")
            {
                lista = lista.filter(function(s)
                {
                    return s.estadoSolicitud == filtro;
                });
            }

            lista.sort(function(a,b)
            {
                if(orden == "ASC")
                {
                    return new Date(a.fechaSolicitud) - new Date(b.fechaSolicitud);
                }
                else
                {
                    return new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud);
                }
            });

            for(var i = 0; i < lista.length; i++)
            {
                var solicitudes = lista[i];
                var nombrePerro = solicitudes.perro.nombrePerro;
                var nombreUsuario = solicitudes.usuario.nombreUsuario;
                var email = solicitudes.usuario.emailUsuario;
                var telefono = solicitudes.usuario.telefonoUsuario;
                var fecha = new Date(solicitudes.fechaSolicitud).toLocaleDateString();
                var estado = solicitudes.estadoSolicitud;
                var botones = generarBotones(solicitudes);

                $("#tablaSolicitudes tbody").append(
                    "<tr>" +
                    "<td>" + nombrePerro + "</td>" +
                    "<td>" + nombreUsuario + "</td>" +
                    "<td>" + email + "</td>" +
                    "<td>" + telefono + "</td>" +
                    "<td>" + fecha + "</td>" +
                    "<td>" + estado + "</td>" +
                    "<td>" + botones + "</td>" +
                    "</tr>"
                );
            }
        }
    );
}

function generarBotones(solicitud)
{
    var id = solicitud.idSolicitud;
    var estado = solicitud.estadoSolicitud;

    if(estado == "PENDIENTE")
    {
        return "<button class='buttonTabla' onclick='cambiarEstado(" + id + ",\"RECIBIDA\")'>Marcar recibida</button>";
    }

    if(estado == "RECIBIDA")
    {
        return "<button class='buttonTabla' onclick='cambiarEstado(" + id + ",\"ACEPTADA\")'>Aceptar</button>" +
               "<button class='buttonTabla' onclick='cambiarEstado(" + id + ",\"CANCELADA\")'>Cancelar</button>";
    }

    return "-";
}

function cambiarEstado(idSolicitud, nuevoEstado)
{
    alertify.confirm(
        "Cambiar estado",
        "¿Seguro que quieres marcar la solicitud como <b>" + nuevoEstado + "</b>?",
        function()
        {
            $.ajax({
                url: "http://localhost:8080/solicitudes/" + idSolicitud + "/estado?estado=" + nuevoEstado,
                type: "PUT",
                success: function()
                {
                    alertify.success("Estado actualizado correctamente");
                    cargarSolicitudes();
                }
            });
        },
        function()
        {
            alertify.message("Cancelado");
        }
    );
}