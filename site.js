const uri = 'http://localhost:4890/api/restaurantes';

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

    $(document).on("click","#btnNovo", function(){
        novoItem();
    });

    $(document).on("click","#btnCancelar", function(){
        getData();
    });
});

function getData() {
    $.ajax({
        type: 'GET',
        url: uri,
        success: function (data) {
            montarLista(data);
        }
    });
}

function getDataPorNome(nome) {
    $.ajax({
        type: 'GET',
        url: uri + "?nome=" + nome,
        success: function (data) {
            montarLista(data);
        }
    });
}

function novoItem(){

    var template = Handlebars.compile($('#novo-restaurante').html());

    $('#conteudo').html(template);
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
    var template = Handlebars.compile($('#index-restaurante').html());

    $('#conteudo').html(template(data));
}