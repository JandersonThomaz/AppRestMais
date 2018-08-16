const uri = 'http://localhost:4890/api/restaurantes';


$(document).ready(function () {

    //Clicks

    //Click menu
    $(document).on("click", "#link-restaurantes", function () {
        buscarTodosOsRestaurantes();
    });

    //ações

    $(document).on("click", "#btnNovoRestaurante", function () {
        renderizarFormRestaurante();
    });

    $(document).on("click", ".editarRestaurante", function () {
        var id = $(this).data("id");

        prepararEditarRestaurante(id);
    });

    $(document).on("click", ".excluirRestaurante", function () {
        var id = $(this).data("id");

        excluirRestaurante(id);
        buscarTodosOsRestaurantes();
    });

    $(document).on("click", "#btnCancelarRestaurante", function () {
        buscarTodosOsRestaurantes();
    });

    // submits

    //Filtro de pesquisa
    $(document).on("submit", "#formPesquisaRestaurante", function (e) {
        e.preventDefault();

        var nome = $("#nome").val();
        buscarRestaurantePorNome(nome);
    });


    //Salvar ou editar
    $(document).on("submit", "#formRestaurante", function (e) {
        e.preventDefault();

        var data = $(this).serializeJSON();

        if(data.restauranteId){
            editarRestaurante(data);
        }
        else{
            salvarRestaurante(data);
        }
    });
});


//funções

function buscarTodosOsRestaurantes() {

    renderizarListaDeRestaurantes();

    $.ajax({
        type: 'GET',
        url: uri,
        success: function (data) {
            renderizarListaDeRestaurantes(data);
        }
    });
}

function buscarRestaurantePorNome(nome) {
    $.ajax({
        type: 'GET',
        url: uri + "?nome=" + nome,
        success: function (data) {
            renderizarListaDeRestaurantes(data);
        }
    });
}


function salvarRestaurante(data) {
    $.ajax({
        type: 'POST',
        accepts: 'application/json',
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText)
        },
        success: function (result) {
            buscarTodosOsRestaurantes();
        }
    });
}

function editarRestaurante(data) {
    $.ajax({
        type: 'PUT',
        accepts: 'application/json',
        url: uri + "/" + data.restauranteId,
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText)
        },
        success: function (result) {
            buscarTodosOsRestaurantes();
        }
    });
}

function excluirRestaurante(id) {
    $.ajax({
        url: uri + '/' + id,
        type: 'DELETE',
        success: function (result) {
            buscarTodosOsRestaurantes();
        }
    });
}

function prepararEditarRestaurante(id) {
    $.ajax({
        url: uri + '/' + id,
        type: 'GET',
        success: function (data) {
            renderizarFormRestaurante(data);
        }
    });
}

function renderizarFormRestaurante(data) {

    var template = Handlebars.compile($('#cadastro-restaurante').html());


    if(data){
        $('#conteudo').html(template(data));
    }
    else{
        $('#conteudo').html(template);
    }

}

function renderizarListaDeRestaurantes(data) {
    var template = Handlebars.compile($('#index-restaurante').html());

    if(data){
        $('#conteudo').html(template(data));
    }
    else{
        $('#conteudo').html(template);
    }

}