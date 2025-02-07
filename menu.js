const menuData = {
    meal: [
        { name: "Grilled Chicken", price: "$12", image: "images/grilled_chicken.jpg" },
        { name: "Pasta", price: "$10", image: "images/pasta.jpg" }
    ],
    dinner: [
        { name: "Steak", price: "$18", image: "images/steak.jpg" },
        { name: "Salmon", price: "$15", image: "images/salmon.jpg" }
    ],
    breakfast: [
        { name: "Pancakes", price: "$8", image: "images/pancakes.jpg" },
        { name: "Omelette", price: "$7", image: "images/omelette.jpg" }
    ],
    snacks: [
        { name: "French Fries", price: "$5", image: "images/fries.jpg" },
        { name: "Nachos", price: "$6", image: "images/nachos.jpg" }
    ]
};

let selectedOrders = [];

document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
    loadTheme();
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
                <td>${item.price}</td>
                <td><button onclick="addToOrder('${item.name}', '${item.price}')">Add</button></td>
            `;
            menuTable.appendChild(row);
        });
    }
}

function addToOrder(name, price) {
    selectedOrders.push({ name, price });
    updateOrderList();
}

function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = selectedOrders.map(item => `<p>${item.name} - ${item.price}</p>`).join("");
}

function confirmOrder() {
    if (selectedOrders.length === 0) {
        alert("No items selected!");
        return;
    }
    document.getElementById("sendOrderBtn").style.display = "block";
}

function sendOrder() {
    const tableNumber = document.getElementById("tableNumber").value;
    if (!tableNumber) {
        alert("Please enter your table number.");
        return;
    }

    let orderText = `Table No: ${tableNumber}%0AOrder:%0A`;
    selectedOrders.forEach(item => {
        orderText += `- ${item.name} (${item.price})%0A`;
    });

    const whatsappURL = `https://wa.me/1234567890?text=${orderText}`;
    window.open(whatsappURL, "_blank");
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
