const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("Product ID:", id);

let currentProduct = null;

fetch(`/api/products/${id}`)
    .then(res => {

        console.log("Response Status:", res.status);

        if (!res.ok) {
            throw new Error("Product not found");
        }

        return res.json();
    })
    .then(product => {

        console.log("Product:", product);

        currentProduct = product;

        document.getElementById("productDetails").innerHTML = `
            <div class="product-wrapper">

                <img src="${product.image}" alt="${product.name}" width="300">

                <div class="product-info">

                    <h1 class="glow-text">${product.name}</h1>

                    <h2 class="price">₹${product.price}</h2>

                    <p class="desc">${product.description}</p>

                    <button class="add-to-cart-btn" onclick="addToCart()">
                        Add To Cart
                    </button>

                </div>

            </div>
        `;
    })
    .catch(err => {

        console.log("ERROR:", err);

        document.getElementById("productDetails").innerHTML = `
            <h2 style="color:red;">Product not found 😢</h2>
        `;
    });

function addToCart() {

    if (!currentProduct) {
        alert("Product not loaded!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        item => item._id === currentProduct._id
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            ...currentProduct,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Product added to cart!");
}