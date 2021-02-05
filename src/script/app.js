//Go Back
function OpenProduct(i){
    var i = $('.product-image[item-data="'+i+'"] img');
    var lbi = $('.popup .product-image img');
    console.log($(i).attr("src"));
    $(lbi).attr("src", $(i).attr("src"));  
    $(".popup").toggle();
      
    $("#product-quantity-input").val("0");
    CalcPrice (0);
    
  }
  function GoBack(){
    $(".popup").toggle();
  }
  
  //Calculate new total when the quantity changes.
  function CalcPrice (qty){
    var price = $(".product-price").attr("price-data");
    var total = parseFloat((price * qty)).toFixed(2);
    $(".product-checkout-total-amount").text(total);
  }


  //Reduce quantity by 1 if clicked
  $(document).on("click", ".product-quantity-subtract", function(e){
    var value = $("#product-quantity-input").val();
    //console.log(value);
    var newValue = parseInt(value) - 1;
    if(newValue < 0) newValue=0;
    $("#product-quantity-input").val(newValue);
    CalcPrice(newValue);
  });
  
  //Increase quantity by 1 if clicked
  $(document).on("click", ".product-quantity-add", function(e){
    var value = $("#product-quantity-input ").val();
    //console.log(value);
    var newValue = parseInt(value) + 1;
    $("#product-quantity-input").val(newValue);
    CalcPrice(newValue);
  });
  
  $(document).on("blur", "#product-quantity-input", function(e){
    var value = $("#product-quantity-input").val();
    //console.log(value);
    CalcPrice(value);
  });
  
  
  function AddToCart(e){
    e.preventDefault();
    var qty = $("#product-quantity-input").val();
    if(qty === '0'){return;}
    var toast = '<div class="toast toast-success">Added '+ qty +' to cart.</div>';  
    $("body").append(toast);
    setTimeout(function(){ 
    $(".toast").addClass("toast-transition");
      }, 100);
    setTimeout(function(){      
      $(".toast").remove();
    }, 3500);
  }


  // =========== Page Panier =========== //
// 1) Créer une ligne par produit dans le Panier //
// 2) Calcul de la somme des articles dans le panier //
// 3) Rendre Fonctionnel l'icone poubelle //
// 4) Envoyer le récap de commande et les informations contacts et récupérer le numéro de commande //

console.log("Cart says Hello !");

// ====> 1) Créer une ligne par produit dans le Panier <==== //

const createARowByProductsInCart = () => {
    
    const resume = document.getElementById("resume");

    cart.forEach( product => {

        // div card-body rattaché à resume
        const tr = document.createElement("tr");
        tr.classList.add("tr")
        resume.appendChild(tr);

        // image miniature attachée à card-body
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        tr.appendChild(th);

        const img = document.createElement("img");
        img.classList.add("float-left","shadow-sm", "col-1");
        img.style.maxWidth="100px";
        img.src = product.imageUrl;
        th.appendChild(img);

        //  nom du teddy attachée à tr
        const teddyName = document.createElement("td");
        teddyName.classList.add("align-middle");
        teddyName.innerHTML = product.name;
        tr.appendChild(teddyName);

        // Sa couleur attaché à tr
        const option = document.createElement("td");
        option.classList.add("align-middle");
        option.innerHTML =  product.option;
        tr.appendChild(option);


        // quantité attaché à tr
        const quantity = document.createElement("td");
        quantity.classList.add("align-middle");
        quantity.innerHTML = 1;
        tr.appendChild(quantity);

        // span prix attaché à tr
        const price= document.createElement("td");
        price.classList.add("align-middle");
        price.innerHTML = formatInPrice(product.price);
        tr.appendChild(price);

        // bouton pour enlever un produit attaché à card-body
        const removeProduct = document.createElement("td");
        removeProduct.classList.add("btn","btn-primary","ml-3","btn-add-to-cart", "btn-remove-product-from-cart", "px-4","mx-3", "my-3");
        removeProduct.href = "#";
        removeProduct.type = "submit";
        tr.appendChild(removeProduct);

        // icone fontawesome rattaché à removeProduct
        const iconGarbage = document.createElement("i");
        iconGarbage.classList.add("fas","fa-trash-alt");
        removeProduct.appendChild(iconGarbage);

    });
}
createARowByProductsInCart();

// ====> 2) Calcul de la somme des articles dans le panier <==== //

calculateTotal(cart, "subtotal");

// ====> 3) Rendre fonctionnel le bouton poubelle <====//

const removeProductFromCart = () => {

    for (let i=0; i < cart.length; i++) {
        const btnRemoveProductFromCart = document.getElementsByClassName("btn-remove-product-from-cart")[i];
        btnRemoveProductFromCart.addEventListener("click", (event) => {
            event.preventDefault();

            // Supprime l'article du localStorage
            cart.splice(i,1);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Enlève l'affichage de la ligne //
            if(event.target.parentElement.classList == "tr") {
                event.target.parentElement.remove();
            } else {
                event.target.parentElement.parentElement.remove();
            }

            // Refresh nombre de produit et total //
            NbOfProductInCart();
            calculateTotal();
        })
    }
}
removeProductFromCart();


// ====> 4) Envoyer le récap de commande et les informations contacts et récupérer le numéro de commande <==== //

const commandConfirmed = document.getElementById("command-confirmed");
commandConfirmed.addEventListener("click", (e)=>{
    e.preventDefault();
    // récupérer object contact et tableau produits dans le localStorage

    const contact = JSON.parse(localStorage.getItem("contact"));
    let products = [];
    cart.forEach(product => {
        products.push(product._id);
    })

    // formater et envoyer le contact et la commande à l'API et récupérer le numéro de commande

    if (products.length > 0 && contact) {// Vérification si le panier est non vide et que les infos clients sont présentes
        const body = JSON.stringify({contact,  products});
        post("/order", body)
            .then(data => {
                console.log(data);
                // sauvegarder la réponse du back dans le localStorage
                localStorage.setItem("data", JSON.stringify(data));
                // Mise à zéro du panier 
                localStorage.removeItem("cart");
                window.location = "confirmation.html"; // Rediriger vers la page confirmation.html
            })    
    } else if (products.length==0){ // Si le panier est vide
        alert ("Y'a forcément quelque chose qui vous tente?")
    } else if (!contact) { // si le contact n'est pas renseigner
        alert ("Où est ce qu'on vous envoie tout ça ? :) ")
    }
});