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

    const existingProduct = cart.find(
        item => item._id === id
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(product.name + " added to cart");

    updateCartCount();
}

// Cart count
const cartCount =
    document.getElementById("cartCount");

updateCartCount();
// Search
const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  const filteredProducts = products.filter(product =>
    product.name
        .replace(/\s+/g, " ")
        .toLowerCase()
        .includes(searchText)
    );

    displayProducts(filteredProducts);
});

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

function updateCartCount() {

    if (!cartCount) return;

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity || 1;
    });

    cartCount.textContent = totalItems;
}

