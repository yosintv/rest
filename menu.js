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

    // Load selected orders from localStorage if any and check expiration
    const savedOrders = localStorage.getItem("selectedOrders");
    const savedTime = localStorage.getItem("orderTimestamp");

    if (savedOrders && savedTime) {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - savedTime;

        // If the saved orders are older than 10 minutes (600,000 milliseconds), clear them
        if (elapsedTime < 600000) {
            selectedOrders = JSON.parse(savedOrders);
            updateOrderList();
            updateTotalAmount();
        } else {
            localStorage.removeItem("selectedOrders");
            localStorage.removeItem("orderTimestamp");
        }
    }
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
    // Add the item to the selectedOrders array
    selectedOrders.push({ name, price });
    
    // Save the selected orders to localStorage with a timestamp
    localStorage.setItem("selectedOrders", JSON.stringify(selectedOrders));
    localStorage.setItem("orderTimestamp", new Date().getTime().toString());

    // Update the order list and total amount
    updateOrderList();
    updateTotalAmount();
}

function removeFromOrder(index) {
    // Remove item from selectedOrders array
    selectedOrders.splice(index, 1);
    
    // Save the updated orders to localStorage
    localStorage.setItem("selectedOrders", JSON.stringify(selectedOrders));
    localStorage.setItem("orderTimestamp", new Date().getTime().toString());

    // Update the order list and total amount
    updateOrderList();
    updateTotalAmount();
}

function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = selectedOrders.map((item, index) => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-image">
            <div class="order-details">
                <p><strong>${item.name}</strong></p>
                <p>रु.${item.price}</p>
                <button class="cancel-btn" onclick="removeFromOrder(${index})">Cancel</button>
            </div>
        </div>
    `).join("");
}

function updateTotalAmount() {
    const totalAmount = selectedOrders.reduce((total, item) => total + item.price, 0);
    document.getElementById("totalAmount").textContent = `Total: रु.${totalAmount.toFixed(2)}`;
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
        orderText += `- ${item.name} (रु.${item.price})\n`;
    });

    const totalAmount = selectedOrders.reduce((total, item) => total + item.price, 0);
    orderText += `\nTotal: रु.${totalAmount.toFixed(2)}`;

    const whatsappURL = `https://wa.me/819068332943?text=${encodeURIComponent(orderText)}`;
    window.location.href = whatsappURL;

    // Clear the selected orders from memory and localStorage
    selectedOrders = [];
    localStorage.removeItem("selectedOrders");
    localStorage.removeItem("orderTimestamp");

    // Clear the order list and total amount on the page
    updateOrderList();
    updateTotalAmount();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}
