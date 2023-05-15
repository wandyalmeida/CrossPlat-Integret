var db = openDatabase('musics', '1.0', 'My first data', 2 * 1024 * 1024);
db.transaction(function(tx){
  tx.executeSql('CREATE TABLE waitList(ID_song INTEGER, title TEXT, artist TEXT, userName TEXT)');
});

// db.transaction(function (tx) {
//   tx.executeSql('DROP TABLE waitList');
// });


// db.transaction(function (tx) {
//   tx.executeSql('ALTER TABLE waitList ADD COLUMN ID_song INTEGER');
// });

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
    console.log('addToWaitingList chamada com', id, title, artist, userName);

    // Adicione o item ao banco de dados
    // var db = openDatabase('musics', '1.0', 'My first data', 2 * 1024 * 1024);


    db.transaction(function (tx) {
      // Verifique se a música já existe no banco de dados
      tx.executeSql(
        'SELECT * FROM waitList WHERE ID_song = ? And userName = ?',
        [id, userName],
        function (tx, results) {
          if (results.rows.length == 0) {
            // A música não existe no banco de dados, então insira-a
            tx.executeSql(
              'INSERT INTO waitList (ID_song, title, artist, userName) VALUES (?, ?, ?, ?)',
              [id, title, artist, userName],
              
              function (tx, results) {
                console.log('Item adicionado com sucesso');
                // console.log('Dados inseridos na tabela waitList:', id, title, artist, userName);

              },
              function (tx, error) {
                console.log('Erro ao adicionar item: ' + error.message);
              }
            );
          } else {
            // A música já existe no banco de dados
            console.log('A música já existe no banco de dados');
          }
        },
        function (tx, error) {
          console.log('Erro ao verificar se a música existe: ' + error.message);
        }
      );
      // loadWaitingListFromDatabase();
    });
  
    // // Criar uma nova linha de tabela com o título, artista e botão "Remover" da música
    // var tr = document.createElement("tr");
    // tr.setAttribute("data-id", id);
  
    // var idCell = document.createElement("td");
    // idCell.textContent = id;
    // tr.appendChild(idCell);
  
    // var titleCell = document.createElement("td");
    // titleCell.textContent = title;
    // tr.appendChild(titleCell);
  
    // var artistCell = document.createElement("td");
    // artistCell.textContent = artist;
    // tr.appendChild(artistCell);
  
    // var userNameCell = document.createElement("td");
    // userNameCell.textContent = userName;
    // tr.appendChild(userNameCell);
  
    // var removeButton = document.createElement("button");
    // removeButton.innerHTML = "Remove";
    // removeButton.addEventListener("click", function() {
    //   var itemId = this.parentNode.parentNode.getAttribute("data-id");
    //   removeFromWaitingList(itemId);
    // });
    // var removeCell = document.createElement("td");
    // removeCell.appendChild(removeButton);
    // tr.appendChild(removeCell);
  
    // // Adicionar a linha de tabela à tabela
    // var table = document.getElementById("waitingList");
    // table.appendChild(tr);
  
    // Mostrar a mensagem de lista vazia se a lista estiver vazia
    var emptyMessage = document.getElementById("emptyMessage");
    emptyMessage.style.display = "none";
    // loadWaitingListFromDatabase();
  }
  
  // function saveToXMLFile(waitingList) {
  //   console.log("Função saveToXMLFile chamada com os dados:", waitingList);
  //    // Atualize o conteúdo da tabela com os dados da lista de espera
  // var table = document.getElementById("waitingList");
  // var rows = table.getElementsByTagName("tr");
  // for (var i = rows.length - 1; i > 0; i--) {
  //   table.deleteRow(i);
  // }
  // for (var i = 0; i < waitingList.length; i++) {
  //   var tr = table.insertRow(-1);
    
  //   var idCell = tr.insertCell(-1);
  //   idCell.textContent = waitingList[i].id;
    
  //   var titleCell = tr.insertCell(-1);
  //   titleCell.textContent = waitingList[i].title;
    
  //   var artistCell = tr.insertCell(-1);
  //   artistCell.textContent = waitingList[i].artist;
    
  //   var userNameCell = tr.insertCell(-1);
  //   userNameCell.textContent = waitingList[i].userName;
  // }
  
//   // Mostrar ou ocultar a tabela dependendo se a lista de espera está vazia ou não
//   if (waitingList.length > 0) {
//     document.getElementById("listas").style.display = "block";
//   } else {
//     document.getElementById("listas").style.display = "block";
//   }
// }
  
  function getWaitingListFromPage() {
      var waitingList = [];
      var trs = document.querySelectorAll("#waitingList tr");
      for (var i = 1; i < trs.length; i++) {
          var tr = trs[i];
          var id = tr.getAttribute("data-id");
          var title = tr.cells[1].textContent;
          var artist = tr.cells[2].textContent;
          waitingList.push({ id: id, title: title, artist: artist });
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
      }
      
      // Salvar a lista de espera no arquivo XML
      var waitingList = getWaitingListFromPage();
      // saveToXMLFile(waitingList);
      // location.reload();
  }

//   function addToWaitingList(id, title, artist, userName) {
//     console.log(id, title, artist, userName);
 
//     // Criar uma nova linha de tabela com o título, artista e botão "Remover" da música
//     var tr = document.createElement("tr");
//     tr.setAttribute("data-id", id);

//     var idCell = document.createElement("td");
//     idCell.textContent = id;
//     tr.appendChild(idCell);

//     var titleCell = document.createElement("td");
//     titleCell.textContent = title;
//     tr.appendChild(titleCell);

//     var artistCell = document.createElement("td");
//     artistCell.textContent = artist;
//     tr.appendChild(artistCell);

//     var userNameCell = document.createElement("td");
//     userNameCell.textContent = userName;
//     tr.appendChild(userNameCell);

//     var removeButton = document.createElement("button");
//     removeButton.innerHTML = "Remove";
//     removeButton.addEventListener("click", function() {
//       var itemId = this.parentNode.parentNode.getAttribute("data-id");
//       removeFromWaitingList(itemId);
//     });
//     var removeCell = document.createElement("td");
//     removeCell.appendChild(removeButton);
//     tr.appendChild(removeCell);
//       // Adicionar a linha de tabela à tabela
//       var table = document.getElementById("waitingList");
//       table.appendChild(tr);
//         var emptyMessage = document.getElementById("emptyMessage");
//         emptyMessage.style.display = "none";
//         document.getElementById("listas").style.display = "block";
      
//         // Salvar a lista de espera no armazenamento local
//         var waitingList = getWaitingListFromPage();
//         console.log(waitingList);
//         saveToLocalStorage(waitingList);
//   }
  
//   function saveToLocalStorage(waitingList) {
//     // console.log(waitingList);
//     localStorage.setItem("waitingList", JSON.stringify(waitingList));
//   }
  
//   function getWaitingListFromPage() {
//     var waitingList = [];
//     var trs = document.querySelectorAll("#waitingList tr");
//     for (var i = 1; i < trs.length; i++) {
//       var tr = trs[i];
//       var id = tr.getAttribute("data-id");
//       var title = tr.cells[1].textContent;
//       var artist = tr.cells[2].textContent;
//       var userName = tr.cells[3].textContent;
//       waitingList.push({id: id, title: title, artist: artist, userName: userName});
//     }
//     return waitingList;
//   }

//   window.addEventListener("load", function() {
//     // console.log(localStorage.getItem("waitingList"));
//     // Recuperar a lista de espera do armazenamento local
//     var waitingList = loadFromLocalStorage();
    
    
//     // Adicionar cada item da lista de espera à página
//     for (var i = 0; i < waitingList.length; i++) {
//       var item = waitingList[i];
//       // console.log(item);
//       addToWaitingList(item.id, item.title, item.artist, item.userName);
//     }
//   });
  
//   function loadFromLocalStorage() {
//     var waitingList = JSON.parse(localStorage.getItem("waitingList"));
//     if (waitingList === null) {
//       waitingList = [];
//     }
//     return waitingList;
//   }
  
//   function removeFromWaitingList(id) {
//     // Encontrar o item da lista de espera com o ID correspondente
//     console.log("Função removeFromWaitingList chamada com o ID:", id);
//     var table = document.getElementById("waitingList");
//     var rows = Array.from(table.getElementsByTagName("tr"));
//     for (var i = 0; i < rows.length; i++) {
//       if (rows[i].getAttribute("data-id") == id) {
//         table.removeChild(rows[i]);
//         break;
//       }
//     }
//     // Mostrar a mensagem de lista vazia se a lista estiver vazia
//     if (table.getElementsByTagName("tr").length === 1) {
//       var emptyMessage = document.getElementById("emptyMessage");
//       emptyMessage.style.display = "block";
//       document.getElementById("listas").style.display = "none";
//     }
//     // Salvar a lista de espera atualizada no armazenamento local
//     var waitingList = getWaitingListFromPage();
//     saveToLocalStorage(waitingList);
//   }


// // Verificar se a página atual é a página da lista de espera
// if (document.getElementById("waitingList")) {
//   // Adicionar o botão "Limpar lista"
//   var clearButton = document.createElement("button");
//   clearButton.textContent = "Remove All";
//   clearButton.addEventListener("click", function() {
//     var table = document.getElementById("waitingList");
//     var rows = table.querySelectorAll("tr[data-id]");
//     for (var i = rows.length - 1; i >= 0; i--) {
//       table.removeChild(rows[i]);
//     }
//     // Mostrar a mensagem de lista vazia
//     var emptyMessage = document.getElementById("emptyMessage");
//     emptyMessage.style.display = "block";
//     document.getElementById("listas").style.display = "none";
//     // Salvar a lista de espera vazia no armazenamento local
//     saveToLocalStorage([]);
//   });
//   var div = document.getElementById("clearButtonDiv");
//   div.appendChild(clearButton);
// }


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

// Get references to the form elements
var form = document.querySelector(".input-holder");
var input = form.querySelector("input[name='search']");

// Handle form submission
form.addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the search query from the input element
    var searchQuery = input.value;

     // Capitalize the first letter of the search query
     searchQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);

    // Perform the search
    searchSongs(searchQuery, searchQuery, searchQuery);
});

function searchSongs(searchId, searchBand, searchName) {
    resetSongList();

    document.getElementById("playlist").style.display = "none";
    document.getElementById("songList").style.display = "flex";

    // Load the XML file
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Find all songs that match the search criteria
            var xmlDoc = this.responseXML;
            var songs = xmlDoc.getElementsByTagName("song");
            var matchingSongs = [];
            for (var i = 0; i < songs.length; i++) {
                var song = songs[i];
                var id = song.getElementsByTagName("id")[0].textContent;
                var artist = song.getElementsByTagName("artist")[0].textContent;
                var title = song.getElementsByTagName("title")[0].textContent;

                if (id == searchId || artist == searchBand || title == searchName) {
                    matchingSongs.push(song);
                }
            }

            if (matchingSongs.length == 0) {
                var list = document.getElementById("songList");
                var p = document.createElement("p");
                p.innerHTML = "No matching songs found.";
                list.appendChild(p);
                console.log("No matching songs found in the XML file.");
                return;
            }

            var list = document.getElementById("songList");

            // Display each matching song in a row of the table
            for (var i = 0; i < matchingSongs.length; i++) {
                var title = matchingSongs[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                var id = matchingSongs[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
                var artist = matchingSongs[i].getElementsByTagName("artist")[0].childNodes[0].nodeValue;
                var imgSrc = matchingSongs[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;

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
  var songInfoDiv = button.parentNode;
  var userNameInput = songInfoDiv.querySelector("input");
  if (!userNameInput) {
      userNameInput = document.createElement("input");
      userNameInput.type = "text";
      userNameInput.placeholder = "Your Name";
      userNameInput.style.borderRadius = "10px";
      songInfoDiv.appendChild(userNameInput);
  } else {
      userNameInput.style.display = "";
  }
  var addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.style.backgroundColor = 'red';
  addButton.style.borderRadius = '10px';
  addButton.style.color = 'white';
  addButton.addEventListener("click", function() { 
      addToWaitingList(id, title, artist, userNameInput.value);
      alert('Music added')
      loadWaitingListFromDatabase();
      // location.reload();
      userNameInput.style.display="none";
      addButton.remove();
      var originalButton = document.createElement("button");
      originalButton.className = 'redBackground';
      originalButton.textContent = "+";
      originalButton.addEventListener("click", function() {
          showUserNameInput(originalButton, id, title, artist);
      });
      songInfoDiv.appendChild(originalButton);
   
    // location.reload();
  });
  songInfoDiv.appendChild(addButton);
  button.remove();
  // location.reload();
}

function deleteAll() {
  // var db = openDatabase('musics', '1.0', 'My first data', 2 * 1024 * 1024);

  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM waitList');
    console.log("deleted")
    location.reload();
  });
  // location.reload();
}

function loadWaitingListFromDatabase() {
  console.log("Função loadWaitingListFromDatabase chamada");
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM waitList', [], function(tx, results) {
      var len = results.rows.length;
      console.log("Número de músicas na lista de espera:", len);
      
      // Adicionar esta verificação
      if (len === 0) {
        // Se a lista de espera estiver vazia, mostrar a mensagem "Lista vazia" e ocultar a lista de espera
        var emptyMessage = document.getElementById("emptyMessage");
        emptyMessage.style.display = "block";
        console.log("Mostrando mensagem 'Lista vazia'");
        var listasDiv = document.getElementById("listas");
        listasDiv.style.display = "none";
        console.log("Ocultando lista de espera");
      } else {
        // Se a lista de espera não estiver vazia, ocultar a mensagem "Lista vazia" e mostrar a lista de espera
        var emptyMessage = document.getElementById("emptyMessage");
        emptyMessage.style.display = "none";
        console.log("Ocultando mensagem 'Lista vazia'");
        var listasDiv = document.getElementById("listas");
        listasDiv.style.display = "block";
        console.log("Mostrando lista de espera");
        // var table = document.getElementById("waitingList");
        // var rows = table.querySelectorAll("tr:not(first-child)"); // seleciona apenas as linhas com a classe "data-row"
        // console.log("Número de linhas selecionadas:", rows.length);
        // for (var i = 0; i < rows.length; i++) {
        //   console.log("Removendo linha:", rows[i], "do pai:", table);
        //   table.removeChild(rows[i]);
        
        // }
        var table = document.getElementById("waitingList");
        table.innerHTML = "";

        // Recriar a linha de cabeçalho
        var headerRow = document.createElement("tr");
        var headers = ["ID", "Title", "Artist", "UserName", ""];
        for (var i = 0; i < headers.length; i++) {
            var th = document.createElement("th");
            th.textContent = headers[i];
            headerRow.appendChild(th);
        }
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove all";
        removeButton.addEventListener("click", function() {
            deleteAll();
        });
        headerRow.lastChild.appendChild(removeButton);

        table.appendChild(headerRow);


      }
      console.log('Passei');
      
      for (var i = 0; i < len; i++) {
        var row = results.rows.item(i);
        // console.log("Adicionando música à lista de espera:", row.ID, row.title, row.artist, row.userName);
        console.log('Dados recuperados da tabela waitList:', row.ID_song, row.title, row.artist, row.userName);
        
        // Verifique se a música já está na lista de espera
        var waitingList = getWaitingListFromPage();
        var songAlreadyInList = waitingList.some(function(song) {
          return song.id == row.ID_song && song.userName == row.userName;
        });
        
        if (songAlreadyInList) {
          // A música já está na lista de espera, então não precisamos adicioná-la novamente
          continue;
        }
     
        
        // Criar uma nova linha de tabela com o título, artista e botão "Remover" da música
        var tr = document.createElement("tr");
        tr.setAttribute("data-id", row.ID_song);
        
        var idCell = document.createElement("td");
        idCell.textContent = row.ID_song;
        tr.appendChild(idCell);
        
        var titleCell = document.createElement("td");
        titleCell.textContent = row.title;
        tr.appendChild(titleCell);
        
        var artistCell = document.createElement("td");
        artistCell.textContent = row.artist;
        tr.appendChild(artistCell);
        
        var userNameCell = document.createElement("td");
        userNameCell.textContent = row.userName;
        tr.appendChild(userNameCell);
        
        var removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.addEventListener("click", function() {
          var itemId = this.parentNode.parentNode.getAttribute("data-id");
          removeFromWaitingList(itemId);
          // loadWaitingListFromDatabase();
        });
        var removeCell = document.createElement("td");
        removeCell.appendChild(removeButton);
        tr.appendChild(removeCell);

        // Adicionar a linha de tabela à tabela
        var table = document.getElementById("waitingList");
        table.appendChild(tr);
        }
        });
        });
        }
     
// Chamar a função loadWaitingListFromDatabase quando a página for carregada
window.addEventListener("load", loadWaitingListFromDatabase);
