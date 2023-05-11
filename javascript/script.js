console.log("O código JavaScript foi carregado");


// JavaScript
document.getElementById("navMenu").addEventListener("click", function() {
    // Toggle active class on menu icon
    this.classList.toggle("active");
    
    // Toggle display property on menu items
    var menuItems = document.getElementById("menuItems");
    if (menuItems.style.display === "inline") {
      menuItems.style.display = "none";
    } else {
      menuItems.style.display = "inline";
      
    }
  });

  // Show the playlist by selection

  function showTab(tabName){
    // hide all tabs
    var tabs = document.getElementsByClassName("myPlaylist");
    for(var i = 0; i < tabs.length; i++){
      tabs[i].style.display = "none";
    }
    // Show selected tab
    document.getElementById(tabName).style.display = "block";
    document.getElementById("songList").style.display = "none";
  }

  // show the first tab by default
  showTab("playlist");

  const menuItems = document.querySelectorAll('.menu-Item');

  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove the "selected" class from all menu items
      menuItems.forEach(item => {
        item.classList.remove('selected');
      });
      // Add the "selected" class to the clicked menu item
      item.classList.add('selected');
    });
  });

  function addToWaitingList(id, title, artist, userName) {
    console.log(id, title, artist, userName);
 
    // Criar uma nova linha de tabela com o título, artista e botão "Remover" da música
    var tr = document.createElement("tr");
    tr.setAttribute("data-id", id);

    var idCell = document.createElement("td");
    idCell.textContent = id;
    tr.appendChild(idCell);

    var titleCell = document.createElement("td");
    titleCell.textContent = title;
    tr.appendChild(titleCell);

    var artistCell = document.createElement("td");
    artistCell.textContent = artist;
    tr.appendChild(artistCell);

    var userNameCell = document.createElement("td");
    userNameCell.textContent = userName;
    tr.appendChild(userNameCell);

    var removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove";
    removeButton.addEventListener("click", function() {
      var itemId = this.parentNode.parentNode.getAttribute("data-id");
      removeFromWaitingList(itemId);
    });
    var removeCell = document.createElement("td");
    removeCell.appendChild(removeButton);
    tr.appendChild(removeCell);
      // Adicionar a linha de tabela à tabela
      var table = document.getElementById("waitingList");
      table.appendChild(tr);
        var emptyMessage = document.getElementById("emptyMessage");
        emptyMessage.style.display = "none";
        document.getElementById("listas").style.display = "block";
      
        // Salvar a lista de espera no armazenamento local
        var waitingList = getWaitingListFromPage();
        console.log(waitingList);
        saveToLocalStorage(waitingList);
  }
  
  function saveToLocalStorage(waitingList) {
    console.log(waitingList);
    localStorage.setItem("waitingList", JSON.stringify(waitingList));
  }
  
  function getWaitingListFromPage() {
    var waitingList = [];
    var trs = document.querySelectorAll("#waitingList tr");
    for (var i = 1; i < trs.length; i++) {
      var tr = trs[i];
      var id = tr.getAttribute("data-id");
      var title = tr.cells[1].textContent;
      var artist = tr.cells[2].textContent;
      var userName = tr.cells[3].textContent;
      waitingList.push({id: id, title: title, artist: artist, userName: userName});
    }
    return waitingList;
  }

  window.addEventListener("load", function() {
    // console.log(localStorage.getItem("waitingList"));
    // Recuperar a lista de espera do armazenamento local
    var waitingList = loadFromLocalStorage();
    console.log(waitingList);
    
    // Adicionar cada item da lista de espera à página
    for (var i = 0; i < waitingList.length; i++) {
      var item = waitingList[i];
      console.log(item);
      addToWaitingList(item.id, item.title, item.artist, item.userName);
    }
  });
  
  function loadFromLocalStorage() {
    var waitingList = JSON.parse(localStorage.getItem("waitingList"));
    if (waitingList === null) {
      waitingList = [];
    }
    return waitingList;
  }
  
  function removeFromWaitingList(id) {
    // Encontrar o item da lista de espera com o ID correspondente
    console.log("Função removeFromWaitingList chamada com o ID:", id);
    var table = document.getElementById("waitingList");
    var rows = Array.from(table.getElementsByTagName("tr"));
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute("data-id") == id) {
        table.removeChild(rows[i]);
        break;
      }
    }
    // Mostrar a mensagem de lista vazia se a lista estiver vazia
    if (table.getElementsByTagName("tr").length === 1) {
      var emptyMessage = document.getElementById("emptyMessage");
      emptyMessage.style.display = "block";
      document.getElementById("listas").style.display = "none";
    }
    // Salvar a lista de espera atualizada no armazenamento local
    var waitingList = getWaitingListFromPage();
    saveToLocalStorage(waitingList);
  }


// Verificar se a página atual é a página da lista de espera
if (document.getElementById("waitingList")) {
  // Adicionar o botão "Limpar lista"
  var clearButton = document.createElement("button");
  clearButton.textContent = "Remove All";
  clearButton.addEventListener("click", function() {
    var table = document.getElementById("waitingList");
    var rows = table.querySelectorAll("tr[data-id]");
    for (var i = rows.length - 1; i >= 0; i--) {
      table.removeChild(rows[i]);
    }
    // Mostrar a mensagem de lista vazia
    var emptyMessage = document.getElementById("emptyMessage");
    emptyMessage.style.display = "block";
    document.getElementById("listas").style.display = "none";
    // Salvar a lista de espera vazia no armazenamento local
    saveToLocalStorage([]);
  });
  var div = document.getElementById("clearButtonDiv");
  div.appendChild(clearButton);
}


function resetSongList() {
  isSongListLoaded = false;
  var list = document.getElementById("songList");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}
  
function showInternacional(lista) {
  resetSongList();

  document.getElementById("playlist").style.display = "none";
	document.getElementById("songList").style.display = "flex";
  
  // A lista de músicas ainda não foi carregada, vamos carregá-la agora.
  
  // Carregar o arquivo XML
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Encontrar todas as músicas internacionais
      var xmlDoc = this.responseXML;
      var musics = xmlDoc.getElementsByTagName("musics");
      var internationalSongs = null;
      for (var i = 0; i < musics.length; i++) {
        if (musics[i].getAttribute("name") == lista) {
          internationalSongs = musics[i].getElementsByTagName("song");
          break;
        }
      }
      if (internationalSongs == null) {
        var list = document.getElementById("songList");
        var p = document.createElement("p");
        p.innerHTML = "Nenhuma música internacional encontrada.";
        list.appendChild(p);
        console.log("Não há músicas internacionais no arquivo XML.");
        return;
      }
      
      var list = document.getElementById("songList");
      
      // Exibir cada música em uma linha da tabela
      for (var i = 0; i < internationalSongs.length; i++) {
        var title = internationalSongs[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        var id = internationalSongs[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var artist = internationalSongs[i].getElementsByTagName("artist")[0].childNodes[0].nodeValue;
        var imgSrc = internationalSongs[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
        
        var li = document.createElement("li");
        li.innerHTML = "<img src='" + imgSrc + "' alt='Imagem do CD'>" +
                       "<div class='songInfo'>" +
                       "<br> "+
                       "<h2>" + title + "</h2>" +
                       "<p>" + id + "</p>" +
                       "<p>" + artist + "</p>" + 
                       "<button class='redBackground' onclick='showUserNameInput(this, \"" + id + "\", \"" + title + "\", \"" + artist + "\")'>+</button>" +
               "</div>";
        list.appendChild(li);
        
      }
    }
  };
  xhttp.open("GET", "karaoke.xml", true);
  xhttp.send();
}

function showUserNameInput(button, id, title, artist) {
  var userNameInput = document.createElement("input");
  userNameInput.type = "text";
  userNameInput.placeholder = "Your Name";
  var addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.style.backgroundColor = 'red';
  addButton.style.color = 'white';
  addButton.addEventListener("click", function() {
    addToWaitingList(id, title, artist, userNameInput.value);
    alert('Music added')
  });
  var songInfoDiv = button.parentNode;
  songInfoDiv.appendChild(userNameInput);
  songInfoDiv.appendChild(addButton);
  button.remove();
}