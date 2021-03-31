/**
 * Chargement de la liste des utilisateurs et météorites existants
 */
function updateMapAndUser() {
    let url = "http://localhost:3376/api/resources";
    let init = {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        cache: 'default'
    };
    let request = new Request(url)

    fetch(request, init)
        .then(resp => resp.json())
        .then(user => {
            var ul = document.getElementById("ul-users");

            for (const id of Object.keys(user)) {
                if (user[id].role === "player") {
                    renderHtmlUser(user[id], ul);
                    //marker for players
                    L.marker([user[id].position[0], user[id].position[1]], { icon: greenIcon })
                        .addTo(mymap)
                        .bindPopup(`Utilisateur <strong>${user[id].login}</strong><br>TTL restant: <strong>${user[id].ttl}</strong>s.`);

                    console.log(`Login: ${user[id].login}, ttl: ${user[id].ttl}, position: [${user[id].position[0]}, ${user[id].position[1]}]`);
                } else {
                    //marker for impacts
                    L.marker([user[id].position[0], user[id].position[1]], { icon: orangeIcon })
                        .addTo(mymap)
                        .bindPopup(`Météorite de type <strong>${user[id].composition}</strong>.<br>TTL restant: <strong>${user[id].ttl}</strong>s.`);


                    console.log(`Composition: ${user[id].composition}, position: [${user[id].position[0]}, ${user[id].position[1]}]`);
                }
            }
        }).catch(error => {
            console.log(error);
        })
}

function renderHtmlUser(user, ul) {
    //li
    var li = document.createElement("li");
    li.setAttribute("id", "li-user-" + user.login);

    //li - create link for image
    var aImage = document.createElement("a");
    aImage.setAttribute("href", "javascript:updateImage(" + user.login + ")");
    var img = document.createElement("img");
    img.setAttribute("src", user.image);
    img.setAttribute("class", "icon");
    aImage.appendChild(img);
    li.appendChild(aImage);

    li.appendChild(document.createTextNode("  -  "));
    //li - create name
    var aName = document.createElement("a");
    aName.setAttribute("href", "javascript:updateName(" + user.login + ")");
    aName.appendChild(document.createTextNode(user.login));
    li.appendChild(aName);

    li.appendChild(document.createTextNode("  -  "));
    //li - create ttl
    var ttl = document.createElement("strong");
    ttl.appendChild(document.createTextNode("TTL: " + user.ttl));
    li.appendChild(ttl);

    li.appendChild(document.createTextNode("  -  "));
    //li - create trophys
    var trophys = document.createElement("strong");
    trophys.appendChild(document.createTextNode("Trophys: " + user.trophys));
    li.appendChild(trophys);

    //append li to ul
    ul.appendChild(li);
}