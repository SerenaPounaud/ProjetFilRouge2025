let toastTimeout;

// Notification toast    
function toast(message) {
    const t = document.getElementById("toast");
    if (!t) return;

    if (toastTimeout) clearTimeout(toastTimeout); //annule le précédent toast si besoin
    //reset animation
    t.style.transition = "none";
    t.style.opacity = "0";
    t.style.transform = "translateY(20px)";

    void t.offsetWidth; //force reflow pour relancer l'animation

    t.textContent = message;
    t.style.transition = "all 0.3s ease"; //réinitialise
    t.style.opacity = "1";
    t.style.transform = "translateY(0)"; //déplace verticalement, 0 = pas de déplacement

    toastTimeout = setTimeout(() => {
        t.style.opacity = "0";
        t.style.transform = "translateY(20px)"; //déplace vers le bas
    }, 3000);
}  
