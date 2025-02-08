const menuData = {
    meal: [
        { name: "Grilled Chicken", price: 12, image: "images/grilled_chicken.jpg" },
        { name: "Pasta", price: 10, image: "images/pasta.jpg" }
    ],
    dinner: [
        { name: "Steak", price: 18, image: "images/steak.jpg" },
        { name: "Salmon", price: 15, image: "images/salmon.jpg" }
    ],
    breakfast: [
        { name: "Pancakes", price: 8, image: "images/pancakes.jpg" },
        { name: "Omelette", price: 7, image: "images/omelette.jpg" }
    ],
    snacks: [
        { name: "French Fries", price: 5, image: "images/fries.jpg" },
        { name: "Nachos", price: 6, image: "images/nachos.jpg" }
    ]
};

let selectedOrders = [];

document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
    loadTheme();
    loadOrdersFromLocalStorage();
});

function loadMenu() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category") || "meal";
    const menuTable = document.getElementById("menu");
    menuTable.innerHTML = "";

    if (menuData[category]) {
        menuData[category].forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>रु.${item.price}</td>
                <td><button class="add-btn" onclick="addToOrder('${item.name}', ${item.price})">Add</button></td>
            `;
            menuTable.appendChild(row);
        });
    }
}

function addToOrder(name, price) {
    const existingOrder = selectedOrders.find(order => order.name === name);
    if (existingOrder) {
        existingOrder.quantity += 1;  // Increase quantity if item already exists
    } else {
        selectedOrders.push({ name, price, quantity: 1 });  // Add new item with quantity 1
    }
    updateOrderList();
    updateTotalAmount();
    saveOrdersToLocalStorage();
}

function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = selectedOrders.map(item => `
        <div class="order-item">
            <img class="order-image" src="${menuData[item.name] ? menuData[item.name][0].image : ''}" alt="${item.name}">
            <div class="order-details">
                <p>${item.name} x${item.quantity} - रु.${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="cancel-btn" onclick="removeFromOrder('${item.name}')">Cancel</button>
        </div>
    `).join("");
}

function updateTotalAmount() {
    const totalAmount = selectedOrders.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById("totalAmount").textContent = `Total: रु.${totalAmount.toFixed(2)}`;
}

function removeFromOrder(name) {
    const index = selectedOrders.findIndex(order => order.name === name);
    if (index !== -1) {
        if (selectedOrders[index].quantity > 1) {
            selectedOrders[index].quantity -= 1;  // Decrease quantity if more than 1
        } else {
            selectedOrders.splice(index, 1);  // Remove item from the order if quantity is 1
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
        orderText += `- ${item.name} x${item.quantity} (रु.${(item.price * item.quantity).toFixed(2)})\n`;
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
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;  // 10 minutes from now
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
