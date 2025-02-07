// Sample menu data
const menuData = {
    meal: [
        { name: "Burger", price: 10, image: "burger.jpg" },
        { name: "Pizza", price: 15, image: "pizza.jpg" },
        { name: "Pasta", price: 12, image: "pasta.jpg" }
    ],
    dinner: [
        { name: "Steak", price: 20, image: "steak.jpg" },
        { name: "Salmon", price: 18, image: "salmon.jpg" }
    ],
    breakfast: [
        { name: "Pancakes", price: 8, image: "pancakes.jpg" },
        { name: "Omelette", price: 7, image: "omelette.jpg" }
    ],
    snacks: [
        { name: "Fries", price: 5, image: "fries.jpg" },
        { name: "Nachos", price: 6, image: "nachos.jpg" }
    ]
};

// Get URL parameters to determine the category
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || 'meal';

// Populate the menu table
function populateMenu() {
    const menuTable = document.getElementById('menu');
    menuTable.innerHTML = ''; // Clear existing rows

    const items = menuData[category] || [];
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="images/${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td><button onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button></td>
        `;
        menuTable.appendChild(row);
    });
}

// Add item to the order list
let orderItems = [];
function addToOrder(name, price) {
    orderItems.push({ name, price });
    updateOrderList();
}

// Update the order list display
function updateOrderList() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '<h3>Your Order</h3>';
    let total = 0;

    orderItems.forEach((item, index) => {
        orderList.innerHTML += `
            <div>
                ${item.name} - $${item.price}
                <button onclick="removeFromOrder(${index})">Remove</button>
            </div>
        `;
        total += item.price;
    });

    orderList.innerHTML += `<strong>Total: $${total}</strong>`;
}

// Remove item from the order list
function removeFromOrder(index) {
    orderItems.splice(index, 1);
    updateOrderList();
}

// Confirm order and show WhatsApp button
function confirmOrder() {
    const tableNumber = document.getElementById('tableNumber').value;
    if (!tableNumber) {
        alert('Please enter a table number.');
        return;
    }
    if (orderItems.length === 0) {
        alert('Your order is empty.');
        return;
    }
    document.getElementById('sendOrderBtn').style.display = 'block';
}

// Send order to WhatsApp
function sendOrder() {
    const tableNumber = document.getElementById('tableNumber').value;
    let message = `Order for Table ${tableNumber}:\n`;
    orderItems.forEach(item => {
        message += `${item.name} - $${item.price}\n`;
    });
    const total = orderItems.reduce((sum, item) => sum + item.price, 0);
    message += `Total: $${total}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Initialize the page
populateMenu();
