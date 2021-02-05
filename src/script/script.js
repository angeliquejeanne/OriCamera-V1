// ==== Afficher nombre d'article dans le panier  ====//
// ==== Afficher nombre d'article dans le panier  ====//

console.log("NbOfProduct !")

const numberOfProductsInCart = document.getElementById("nbProduct");
const qty = document.getElementById("qty");

const NbOfProductInCart = () => {
    numberOfProductsInCart.innerHTML= cart.length;
    qty.innerHTML = cart.length;
}

if(JSON.parse(localStorage.getItem("cart"))){ // Si panier non vide au chargement de la page
    var cart= JSON.parse(localStorage.getItem("cart")); // Reprise des éléments du cart
    NbOfProductInCart (); // Et affichage du nombre sur le panier 
    console.log(cart);
} else {
    var cart=[]; // Sinon, initialisation de la variable cart et affichage du 0 sur le panier
    numberOfProductsInCart.innerHTML= 0;
}

