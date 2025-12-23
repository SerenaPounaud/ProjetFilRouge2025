// Initialise le bouton loupe
function initHeaderSearch() {
    const btnLoupe = document.getElementById('btn_loupe');
    if (!btnLoupe) return;
        btnLoupe.addEventListener('click', () => {
                const barreRecherche = document.getElementById('barre_recherche');
                //si on est sur l'index
                if (barreRecherche) {
                  focusAndScrollToSearch();
            } else { //redirige vers index
                window.location.href = '/frontend/index.html#recherche'; 
            }
        });
}

// Focus + scroll + retry si barre pas encore visible
function focusAndScrollToSearch(retry = 0) {
    const barreRecherche = document.getElementById('barre_recherche');
    if (!barreRecherche) return;
    //si la barre n'est pas encore visible
    if (barreRecherche.offsetParent === null && retry < 10) {
        setTimeout(() => focusAndScrollToSearch(retry + 1), 150);
        return;
    }
    barreRecherche.focus(); //redirige vers la barre de recherche
    barreRecherche.scrollIntoView({ behavior: 'smooth', block: 'center'}); //scroll si besoin
    history.replaceState(null, '', window.location.pathname); //nettoie l'url
}

document.addEventListener('DOMContentLoaded', () => {
    //Si on est sur l'index
        initHeaderSearch();
    if (window.location.hash === '#recherche') {
        setTimeout(focusAndScrollToSearch, 300); //attend le rendu
    }
});

window.addEventListener('load', () => { //attend que tout charge
    //si on est sur une autre page
    if (window.location.hash === '#recherche') {
        focusAndScrollToSearch();
    }
});