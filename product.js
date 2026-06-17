const params = new URLSearchParams(window.location.search);

const id = params.get("id");

console.log("Product ID:", id);

fetch(`/api/products/${id}`)
.then(res => {
    console.log("Response Status:", res.status);
    return res.json();
})
.then(product => {

    console.log("Product:", product);

    document.getElementById("productDetails")
    .innerHTML = `
        <img src="${product.image}" width="300">

        <h1>${product.name}</h1>

        <h2>₹${product.price}</h2>

        <p>${product.description}</p>

        <button>Add To Cart</button>
    `;
})
.catch(err => {
    console.log("ERROR:", err);
});