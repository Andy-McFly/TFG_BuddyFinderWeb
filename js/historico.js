$(document).ready(function()
{
    cargarHistorico();
});

$(document).on("change", "#filtroMotivo", function()
{
    cargarHistorico();
});

function cargarHistorico()
{
    var idRefugio = localStorage.getItem("refugioId");

    $.get("http://localhost:8080/historico/refugio/" + idRefugio,
    function(listaHistorial)
    {
        $("#tablaHistorico tbody").empty();
        var filtro = $("#filtroMotivo").val();

        if(filtro != "TODOS")
        {
            listaHistorial = listaHistorial.filter(function(historial)
            {
                return historial.motivoBaja == filtro;
            });
        }

        for(var i=0;i<listaHistorial.length;i++)
        {
            var historial = listaHistorial[i];
            var perro = historial.perro;
            var fechaEntrada = new Date(historial.fechaDesde).toLocaleDateString();
            var fechaSalida = new Date(historial.fechaHasta).toLocaleDateString();
            var motivo = historial.motivoBaja;

            $("#tablaHistorico tbody").append(
                "<tr style='text-align:center'>" +
                "<td>" + perro.idPerro + "</td>" +
                "<td><img src='http://localhost:8080/uploads/" + perro.fotoPerro + "' width='80'></td>" +
                "<td>" + perro.nombrePerro + "</td>" +
                "<td>" + perro.razaPerro + "</td>" +
                "<td>" + perro.edadPerro + "</td>" +
                "<td>" + fechaEntrada + "</td>" +
                "<td>" + fechaSalida + "</td>" +
                "<td>" + motivo + "</td>" +
                "</tr>"
            );
        }

    });
}