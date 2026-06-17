const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

displayCart();

function displayCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <h2>Your Cart is Empty</h2>
        `;

        totalPrice.textContent = "Total: ₹0";
        return;
    }

    let total = 0;

    cart.forEach((product, index) => {

        total += Number(product.price);

        cartItems.innerHTML += `
            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="120"
                >

                <h3>${product.name}</h3>

                <p>Price: ₹${product.price}</p>

                <button onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

            <hr>
        `;
    });

    totalPrice.textContent = `Total: ₹${total}`;
}

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}

function clearCart() {

    localStorage.removeItem("cart");

    cart = [];

    displayCart();
}

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");
        return;
    }

    alert("Checkout feature coming next!");
}