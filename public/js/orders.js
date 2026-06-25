const ordersContainer =
    document.getElementById("ordersContainer");
const userEmail =
    localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "login.html";
}
fetch("/api/orders")
    .then(res => res.json())
    .then(orders => {

        orders.reverse();

        orders.forEach(order => {

            ordersContainer.innerHTML += `

            <div class="order-card">

                <h3>Order ID:
                ${order._id}</h3>

                <p>Email:
                ${order.userEmail}</p>

                <p>Total:
                ₹${order.totalAmount}</p>

                <p>Date:
                ${new Date(order.createdAt)
                    .toLocaleString()}</p>

            </div>

            `;
        });

    })
    .catch(err => console.log(err));

    const email =
localStorage.getItem("userEmail");

fetch(`/api/orders/${email}`)
.then(res => res.json())
.then(data => {

    console.log(data);

});

ordersContainer.innerHTML += `

<div class="order-card">

    <h3>Order ID:
    ${order._id}</h3>

    <p>Total:
    ₹${order.totalAmount}</p>

    <p>Date:
    ${new Date(order.createdAt)
      .toLocaleString()}</p>

</div>

`;