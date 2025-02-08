let selectedOrders = [];

document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
    loadTheme();
    loadOrdersFromLocalStorage();
});

function loadMenu() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category") || "meal";  // Default category is meal
    const menuTable = document.querySelector(".order-section");  // Changed to use class instead of id
    menuTable.innerHTML = "";

    // Fetch the data dynamically based on category
    fetch(`data/${category}.json`)
        .then(response => response.json())
        .then(menuItems => {
            if (Array.isArray(menuItems)) {
                // If the data is a list of items
                const table = createTable(menuItems);
                menuTable.appendChild(table);
            } else {
                // If the data is structured by category (e.g., Drinks have subcategories like Soft Drinks and Hard Drinks)
                for (const [categoryName, items] of Object.entries(menuItems)) {
                    const section = document.createElement("div");
                    section.classList.add("category-section");
                    section.innerHTML = `<h3>${categoryName}</h3>`;
                    const table = createTable(items);
                    section.appendChild(table);
                    menuTable.appendChild(section);
                }
            }
        })
        .catch(error => {
            console.error('Error loading menu:', error);
        });
}

function createTable(items) {
    const table = document.createElement("table");
    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML = `
        <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Order</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
            <td>${item.name}</td>
            <td>रु.${item.price}</td>
            <td><button class="add-btn" onclick="addToOrder('${item.name}', ${item.price}, '${item.image}')">Add</button></td>
        `;
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);

    return table;
}

function addToOrder(name, price, image) {
    const existingOrder = selectedOrders.find(order => order.name === name);
    if (existingOrder) {
        existingOrder.quantity += 1;
    } else {
        selectedOrders.push({ name, price, quantity: 1, image });
    }
    updateOrderList();
    updateTotalAmount();
    saveOrdersToLocalStorage();
}

function updateOrderList() {
    const orderList = document.getElementById("orderList");

    // Clear previous orders
    orderList.innerHTML = '';

    // Add "Your Order" header
    const orderHeader = document.createElement("div");
    orderHeader.classList.add("order-header");
    orderHeader.innerHTML = "<strong>Your Order</strong>";
    orderList.appendChild(orderHeader);

    // Add order items
    selectedOrders.forEach(item => {
        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
            <img class="order-image" src="${item.image}" alt="${item.name}">
            <div class="order-details">
                <p>${item.name} <span class="quantity">(${item.quantity})</span> - रु.${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="cancel-btn" onclick="removeFromOrder('${item.name}')">Cancel</button>
        `;
        orderList.appendChild(orderItem);
    });
}

function updateTotalAmount() {
    const totalAmount = selectedOrders.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById("totalAmount").textContent = `Total: रु.${totalAmount.toFixed(2)}`;
}

function removeFromOrder(name) {
    const index = selectedOrders.findIndex(order => order.name === name);
    if (index !== -1) {
        if (selectedOrders[index].quantity > 1) {
            selectedOrders[index].quantity -= 1;
        } else {
            selectedOrders.splice(index, 1);
        }
        updateOrderList();
        updateTotalAmount();
        saveOrdersToLocalStorage();
    }
}

function sendOrder() {
    const roomNumber = document.getElementById("roomNumber").value;
    const desiredTime = document.getElementById("desiredTime").value;

    if (!roomNumber) {
        alert("Please enter your room number.");
        return;
    }

    if (!desiredTime) {
        alert("Please enter your desired time.");
        return;
    }

    let orderText = `Room No: ${roomNumber}\nDesired Time: ${desiredTime}\nOrder:\n`;
    selectedOrders.forEach(item => {
        orderText += `- ${item.name} (${item.quantity}) (रु.${(item.price * item.quantity).toFixed(2)})\n`;
    });

    const totalAmount = selectedOrders.reduce((total, item) => total + (item.price * item.quantity), 0);
    orderText += `\nTotal: रु.${totalAmount.toFixed(2)}`;

    const whatsappURL = `https://wa.me/819068332943?text=${encodeURIComponent(orderText)}`;
    window.location.href = whatsappURL;

    clearOrders();
}

function clearOrders() {
    selectedOrders = [];
    updateOrderList();
    updateTotalAmount();
    localStorage.removeItem("selectedOrders");
}

function saveOrdersToLocalStorage() {
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;
    localStorage.setItem("selectedOrders", JSON.stringify({ orders: selectedOrders, expiration: expirationTime }));
}

function loadOrdersFromLocalStorage() {
    const storedData = JSON.parse(localStorage.getItem("selectedOrders"));
    if (storedData && storedData.expiration > new Date().getTime()) {
        selectedOrders = storedData.orders;
        updateOrderList();
        updateTotalAmount();
    } else {
        clearOrders();
    }
}

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}
