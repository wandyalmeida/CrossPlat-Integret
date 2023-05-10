
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


  // Função para adicionar uma música à lista de espera
  function addToWaitingList(id, title, artist) {
    // Criar um novo item de lista com o título e o artista da música
    var li = document.createElement("li");
    var text = document.createTextNode(id + " - " + title + " - " + artist);
    li.appendChild(text);
    
    // Adicionar o item de lista à lista de espera
    var ul = document.getElementById("waitingList");
    ul.appendChild(li);
    
    // // Atualizar o arquivo XML com a nova música na lista de espera
    // var xhttp = new XMLHttpRequest();
    // xhttp.open("POST", "updateXml.php", true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhttp.send("id="+ id + "title=" + title + "&artist=" + artist);
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
                       "<button class='redBackground ' onclick='addToWaitingList(\"" + id + "\", \"" + title + "\", \"" + artist + "\")'>+</button>" +
                       "</div>";
        list.appendChild(li);
      }
    }
  };
  xhttp.open("GET", "karaoke.xml", true);
  xhttp.send();
}
