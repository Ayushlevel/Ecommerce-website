document.getElementById("productForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const product = {

        name: document.getElementById("name").value,

        price: document.getElementById("price").value,

        image: document.getElementById("image").value,

        category: document.getElementById("category").value,

        description:
            document.getElementById("description").value
            

    };

    if (!name || !price || !image || !description) {
    alert("Please fill all fields");
    return;
    }

    const res = await fetch("/api/add-product", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    });

    const data = await res.json();

    alert(data.message);

});