const urlPrato = 'http://localhost:4890/api/pratos';


$(document).ready(function () {

    //Clicks

    //Click menu
    $(document).on("click", "#link-pratos", function () {
        buscarTodosOsPratos();
    });

    //ações

    $(document).on("click", "#btnNovoPrato", function () {

        renderizarFormPrato();
        carregarDropDown();
    });

    $(document).on("click", ".editarPrato", function () {
        var id = $(this).data("id");

        prepararEditarPrato(id);
    });

    $(document).on("click", ".excluirPrato", function () {
        var id = $(this).data("id");

        excluirPrato(id);
        buscarTodosOsPratos();
    });

    $(document).on("click", "#btnCancelarPrato", function () {
        buscarTodosOsPratos();
    });

    // submits

    //Filtro de pesquisa
    $(document).on("submit", "#formPesquisaPrato", function (e) {
        e.preventDefault();

        var nome = $("#nome").val();
        buscarPratosPorNome(nome);
    });


    //Salvar ou editar
    $(document).on("submit", "#formPrato", function (e) {
        e.preventDefault();

        var data = $(this).serializeJSON();

        if(data.pratoId){
            editarPrato(data);
        }
        else{
            salvarPrato(data);
        }
    });
});


//funções

function buscarTodosOsPratos() {

    renderizarListaDePratos();

    $.ajax({
        type: 'GET',
        url: urlPrato,
        success: function (data) {
            renderizarListaDePratos(data);
        }
    });
}

function buscarPratosPorNome(nome) {
    $.ajax({
        type: 'GET',
        url: urlPrato + "?nome=" + nome,
        success: function (data) {
            renderizarListaDePratos(data);
        }
    });
}


function salvarPrato(data) {
    $.ajax({
        type: 'POST',
        accepts: 'application/json',
        url: urlPrato,
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText)
        },
        success: function (result) {
            buscarTodosOsPratos();
        }
    });
}

function editarPrato(data) {
    $.ajax({
        type: 'PUT',
        accepts: 'application/json',
        url: urlPrato + "/" + data.pratoId,
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText)
        },
        success: function (result) {
            buscarTodosOsPratos();
        }
    });
}

function excluirPrato(id) {
    $.ajax({
        url: urlPrato + '/' + id,
        type: 'DELETE',
        success: function (result) {
            getData();
        }
    });
}

function prepararEditarPrato(id) {
    $.ajax({
        url: urlPrato + '/' + id,
        type: 'GET',
        success: function (data) {
            renderizarFormPrato(data);
            carregarDropDown();
        }
    });
}

function carregarDropDown(optionSelecionado){
    $.ajax({
        url: uri,
        type: 'GET',
        success: function (data) {
            renderizarSelectRestaurante(data);
        }
    });
}

function renderizarSelectRestaurante(data){
    var template = Handlebars.compile($('#select-restaurante').html());

    if(data){
        $('#conteudo-select-restaurante').html(template(data));
    }
    else{
        $('#conteudo-select-restaurante').html(template);
    }
}

function renderizarFormPrato(data) {

    var template = Handlebars.compile($('#cadastro-prato').html());

    if(data){
        $('#conteudo').html(template(data));
    }
    else{
        $('#conteudo').html(template);
    }

}

function renderizarListaDePratos(data) {

    var template = Handlebars.compile($('#index-prato').html());

    if(data){
        $('#conteudo').html(template(data));
    }
    else{
        $('#conteudo').html(template);
    }
}