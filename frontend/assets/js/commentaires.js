let user = null;

let commentaires = JSON.parse(localStorage.getItem("commentaires")) || [];
displayComments();

function connexion() {
    const prenomInput = document.getElementById("prenom");
    const nom = prenomInput.value.trim();

    if (!nom) {
        alert("Veuillez entrer un prénom");
        return;
    }

    user = nom;
    document.getElementById("connexion").style.display = "none";
    document.getElementById("zone_commentaire").style.display = "block";
}

function ajoutCommentaire() {
    const text = document.getElementById("commentaire_input").value.trim();
    const noteInput = document.getElementById("note_input").value;
    if (!text) {
        return alert ("Aucun commentaire");
    }
    if (!noteInput) {
        return alert("Veuillez choisir une note avant d'envoyer");
    }
    const note = parseInt(noteInput);

    const newCommentaire = {
        id: Date.now(),
        newUser: user,
        message: text,
        date: new Date().toLocaleDateString(),
        note: note
    };

    commentaires.push(newCommentaire);
    localStorage.setItem("commentaires",JSON.stringify(commentaires));

    document.getElementById("commentaire_input").value = "";
    document.getElementById("note_input").value = "";
    displayComments();
}

function supprimerCommentaire(id) {
    commentaires = commentaires.filter(c => c.id !== id);
    localStorage.setItem("commentaires", JSON.stringify(commentaires));
    displayComments();
}

function displayComments() {
    const contenu = document.getElementById("commentaires");
    contenu.innerHTML = "";

    commentaires.forEach(c => {
        const div = document.createElement("div");
        div.className = "commentaires";
        let etoiles = "★".repeat(c.note) + "☆".repeat(5 - c.note);
        div.innerHTML = `
        <div class="meta">
            <strong>${c.newUser}</strong> - ${c.date} - ${etoiles}
            <button onclick="supprimerCommentaire(${c.id})" style = "margin-left:10px;color:red;">Supprimer</button>
        </div>
        <div>${c.message}</div>`;
        contenu.appendChild(div);
    });
}