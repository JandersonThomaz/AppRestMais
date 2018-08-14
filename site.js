const uri = 'http://localhost:4890/api/restaurantes';
let todos = null;
function getCount(data) {
    const el = $('#counter');
    let name = 'to-do';
    if (data) {
        if (data > 1) {
            name = 'to-dos';
        }
        el.text(data + ' ' + name);
    } else {
        el.html('No ' + name);
    }
}

$(document).ready(function () {
    getData();

    $(document).on("submit", "#formPesquisa", function (e) {

        e.preventDefault();

        var nome = $("#nome").val();

        getDataPorNome(nome);
    });


    $("#btnNovo").click(function(){
        novoItem();
    });
});

function getData() {
    $.ajax({
        type: 'GET',
        url: uri,
        success: function (data) {
            montarLista(data);
            todos = data;
        }
    });
}

function getDataPorNome(nome) {
    $.ajax({
        type: 'GET',
        url: uri + "?nome=" + nome,
        success: function (data) {
            montarLista(data);
            todos = data;
        }
    });
}

function novoItem(){

    var html = '<h1 class="mb-4 mt-4">Cadastro de restaurante</h1>'+
    '<div class="row">'+
        '<div class="col-md-12">'+
            '<div class="card border-default mb-4">'+
                '<div class="card-header">Filtros</div>'+
                '<div class="card-body">'+
                ' <form id="formPesquisa" method="GET">'+
                        '<div class="form-group">'+
                            '<label>Nome</label>'+
                            '<input id="nome" required="required" type="text" class="form-control">'+
                        '</div>'+
                        '<button id="btnPesquisa" class="btn btn-primary">Pesquisar</button>'+
                        '<button type="button" id="btnNovo" class="btn btn-success">Cadastrar novo restaurante</a>'+
                        '</form>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';

    $('#conteudo').html(html);
}


function addItem() {
    const item = {
        nome: $('#add-name').val(),
    };

    console.log(item);
    console.log(uri);

    $.ajax({
        type: 'POST',
        accepts: 'application/json',
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText)
        },
        success: function (result) {
            getData();
            $('#add-name').val('');
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url: uri + '/' + id,
        type: 'DELETE',
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $('#edit-name').val(item.name);
            $('#edit-id').val(item.id);
            $('#edit-isComplete')[0].checked = item.isComplete;
        }
    });
    $('#spoiler').css({ 'display': 'block' });
}

$('.my-form').on('submit', function () {
    const item = {
        'name': $('#edit-name').val(),
        'isComplete': $('#edit-isComplete').is(':checked'),
        'id': $('#edit-id').val()
    };

    $.ajax({
        url: uri + '/' + $('#edit-id').val(),
        type: 'PUT',
        accepts: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $('#spoiler').css({ 'display': 'none' });
}

function montarLista(data) {
    $('#restaurantes').empty();
    getCount(data.length);
    $.each(data, function (key, item) {

        $('<tr>' +
            '<td>' +
            '<button class="btn btn-sm btn-primary" onclick="editItem(' + item.RestauranteId + ')">Editar</button>' +
            '<button class="btn btn-sm btn-danger" onclick="deleteItem(' + item.RestauranteId + ')">Excluir</button>' +
            '</td>' +
            '<td>' + item.nome + '</td>' +
            '</tr>').appendTo($('#restaurantes'));
    });
}