console.log("script loaded");

let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Display products
function displayProducts(productList) {

    const productContainer =
        document.getElementById("productContainer");

    productContainer.innerHTML = "";

    productList.forEach(product => {

        productContainer.innerHTML += `
<div class="product-card"
     onclick="openProduct('${product._id}')">

    <div class="image-box">
        <img src="${product.image}" alt="${product.name}">
    </div>

    <h3>${product.name}</h3>

    <p>₹${product.price}</p>

    <button onclick="event.stopPropagation(); addToCart('${product._id}')"> Add To Cart
    </button>
</div>
`;

    });

}

// Load products from MongoDB
fetch("/api/products")
    .then(res => res.json())
    .then(data => {

        products = data;

        console.log(products);

        displayProducts(products);

    })
    .catch(err => console.log(err));

// Add to cart
function addToCart(id) {

    const product = products.find(
        item => item._id === id
    );

    if (!product) return;

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(product.name + " added to cart");

    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Cart count
const cartCount =
    document.getElementById("cartCount");

if (cartCount) {
    cartCount.textContent = cart.length;
}

// Search
const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const keyword =
            searchInput.value.toLowerCase();

        const filteredProducts =
            products.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(keyword)
            );

        displayProducts(filteredProducts);

    });

}

// Category filter
function filterProducts(category) {

    if (category === "all") {

        displayProducts(products);

    } else {

        const filteredProducts =
            products.filter(product =>
                product.category === category
            );

        displayProducts(filteredProducts);

    }

}

// Open product page
function openProduct(id) {
    console.log("Clicked product:", id);
    window.location.href = `product.html?id=${id}`;
}