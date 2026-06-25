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

    if (!product.quantity) {
        product.quantity = 1;
    }

    total += Number(product.price) * product.quantity;

    cartItems.innerHTML += `
        <div class="cart-item">

            <img
                src="${product.image}"
                alt="${product.name}"
                width="120"
            >

            <h3>${product.name}</h3>

            <p>Price: ₹${product.price}</p>

            <p>
                Quantity:

                <button onclick="decreaseQty(${index})">-</button>

                ${product.quantity}

                <button onclick="increaseQty(${index})">+</button>
            </p>

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
function increaseQty(index) {

    cart[index].quantity++;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}

function decreaseQty(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

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

async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = 0;
    cart.forEach(product => {
        total += Number(product.price) * product.quantity;
    });

    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: localStorage.getItem("userEmail"),
                items: cart,
                totalAmount: total
            })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data from server:", data);

        // Display the message 
        if (data && data.message) {
            alert(data.message);
        } else {
            alert("Order placed successfully!");
        }

        // Clear the cart on success
        localStorage.removeItem("cart");
        cart = [];
        displayCart();

    } catch (error) {
        console.error("Error during checkout:", error);
        alert("An error occurred during checkout. Please try again.");
    }
}