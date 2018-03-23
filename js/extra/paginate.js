function getUrl(tipo) {
  if (typeof(sessionStorage.getItem('pg')) === undefined || sessionStorage.getItem('pg') == null) {
    sessionStorage.setItem('pg', 1);
  }
  if (typeof(sessionStorage.getItem('qtd')) === undefined || sessionStorage.getItem('qtd') == null) {
    sessionStorage.setItem('qtd', 15);
  }

  $('select[id="paginateQtd"] option[value="' + sessionStorage.getItem("qtd") + '"]').prop('selected', true);

  var pg = sessionStorage.getItem('pg');
  var qtd = sessionStorage.getItem('qtd');

  if (tipo == "ingrediente") {
    // chamado em urls.js
    var urlShowIng;
    if (sessionStorage.getItem('urlShowIng') == null) {
      urlShowIng = show(pg, qtd, tipo);
    } else {
      urlShowIng = sessionStorage.getItem('urlShowIng');
    }
    return urlShowIng;
  }
  if (tipo == "receita") {
    // chamado em urls.js
    var urlShowRec;
    if (sessionStorage.getItem('urlShowRec') == null) {
      urlShowRec = show(pg, qtd, tipo);
    } else {
      urlShowRec = sessionStorage.getItem('urlShowRec');
    }
    return urlShowRec;
  }

}

// chamado em select de estoque.html
function paging() {
  var e = document.getElementById("paginateQtd");
  var qtd = e.options[e.selectedIndex].value;
  sessionStorage.setItem('qtd', qtd);
  location.reload();
}

function botoesPaginacao(paginate) {
  if (paginate.prev_page_url == null) {
    var previous = '<li class="page-item disabled"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true ">&laquo;</span><span class="sr-only ">Previous</span></a></li>'
  } else {
    var previous = '<li class="page-item"><a class="page-link" href="#" onclick="prevOnClick()" aria-label="Previous"><span aria-hidden="true ">&laquo;</span><span class="sr-only ">Previous</span></a></li>'
  }

  var current = '<li class="page-item"><a class="page-link " href="#">' + paginate.current_page + '</a></li>'

  if (paginate.next_page_url == null) {
    var next = '<li class="page-item disabled"><a class="page-link " href="#" aria-label="Next "><span aria-hidden="true ">&raquo;</span><span class="sr-only ">Next</span></a></li>'
  } else {
    var next = '<li class="page-item"><a class="page-link" href="#" onclick="nextOnClick()" aria-label="Next "><span aria-hidden="true ">&raquo;</span><span class="sr-only "></span></a></li>'
  }
  $(previous).appendTo('.pagination');
  $(current).appendTo('.pagination');
  $(next).appendTo('.pagination');
}

function nextOnClick() {
  sessionStorage.setItem('urlShow', sessionStorage.getItem('nextUrl'));
  location.reload();
}

function prevOnClick() {
  sessionStorage.setItem('urlShow', sessionStorage.getItem('prevUrl'));
  location.reload();
}

function salvaUrlPaginas(paginate) {
  var nextUrl = paginate.next_page_url;
  var prevUrl = paginate.prev_page_url;

  sessionStorage.setItem('nextUrl', nextUrl);
  sessionStorage.setItem('prevUrl', prevUrl);
}