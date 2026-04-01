// Initialise le bouton loupe
function initHeaderSearch() {
    document.addEventListener('click', (e) => {
        // détecte tout clic sur la loupe, même si injectée plus tard
        if (e.target.closest('#btn_loupe')) {
            const barreRecherche = document.getElementById('barre_recherche');
            //si on est sur l'index -> scroll
            if (barreRecherche) {
                focusAndScrollToSearch();
            } else { //redirige vers la barre de recherche d'index
                window.location.href = `${window.location.origin}/frontend/index.html#recherche`; 
            }
        }
    });
}

// Focus + scroll + retry si barre pas encore visible
function focusAndScrollToSearch(retry = 0) {
    const barreRecherche = document.getElementById('barre_recherche');
    if (!barreRecherche) return;
    //si la barre n'est pas encore visible
    if (barreRecherche.offsetParent === null && retry < 10) { //et qu'on a pas dépasser 10 tentatives
        setTimeout(() => focusAndScrollToSearch(retry + 1), 150); //réessaye après 150 ms, +1 éviter une boucle infinie
        return;
    }
    
    barreRecherche.scrollIntoView({ behavior: 'smooth', block: 'center'}); //scroll si besoin
    barreRecherche.focus({ preventScroll: true}); //redirige vers la barre de recherche
    history.replaceState(null, '', window.location.pathname); //nettoie l'url
}

// Chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    //Si on est sur l'index -> active le bouton
        initHeaderSearch();
    if (window.location.hash === '#recherche') {
        setTimeout(focusAndScrollToSearch, 300); //attend 300ms pour charger dom puis focus + scroll -> évite que ça échoue
    }
});

// Chargement complet
window.addEventListener('load', () => { //attend que tout charge
    //si on est sur une autre page
    if (window.location.hash === '#recherche') {
        focusAndScrollToSearch();
    }
});