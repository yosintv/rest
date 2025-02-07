const order = {};
let totalAmount = 0;

// WhatsApp Phone Number
const whatsappPhoneNumber = "+819068332943";  // Replace with the actual phone number

// Menu object
const menu = {
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

// Function to populate menu for each category
function displayMenu() {
    // Meal category
    const mealMenuContainer = document.getElementById('mealMenu');
    menu.meal.forEach(item => {
        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td><button class="add-btn" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button></td>
            </tr>
        `;
        mealMenuContainer.innerHTML += row;
    });

    // Dinner category
    const dinnerMenuContainer = document.getElementById('dinnerMenu');
    menu.dinner.forEach(item => {
        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td><button class="add-btn" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button></td>
            </tr>
        `;
        dinnerMenuContainer.innerHTML += row;
    });

    // Breakfast category
    const breakfastMenuContainer = document.getElementById('breakfastMenu');
    menu.breakfast.forEach(item => {
        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td><button class="add-btn" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button></td>
            </tr>
        `;
        breakfastMenuContainer.innerHTML += row;
    });

    // Snacks category
    const snacksMenuContainer = document.getElementById('snacksMenu');
    menu.snacks.forEach(item => {
        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td><button class="add-btn" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button></td>
            </tr>
        `;
        snacksMenuContainer.innerHTML += row;
    });
}

// Function to add items to the order
function addToOrder(name, price) {
    if (!order[name]) {
        order[name] = { quantity: 1, price };
    } else {
        order[name].quantity += 1;
    }
    updateOrderList();
}

// Function to update the order list
function updateOrderList() {
    const orderListContainer = document.getElementById('orderList');
    orderListContainer.innerHTML = '';
    totalAmount = 0;
    for (const item in order) {
        const itemTotal = order[item].price * order[item].quantity;
        totalAmount += itemTotal;
        orderListContainer.innerHTML += `
            <div>
                ${item} x ${order[item].quantity} = $${itemTotal.toFixed(2)}
            </div>
        `;
    }
    document.getElementById('totalAmount').textContent = `Total: $${totalAmount.toFixed(2)}`;
}

// Function to send the order (through WhatsApp)
function sendOrder() {
    const tableNumber = document.getElementById('tableNumber').value;
    const preferredTime = document.getElementById('preferredTime').value;

    if (tableNumber && Object.keys(order).length > 0) {
        const orderDetails = {
            tableNumber,
            items: order,
            totalAmount,
            preferredTime
        };

        const orderMessage = `Order Details:\nTable: ${orderDetails.tableNumber}\nItems: ${JSON.stringify(orderDetails.items)}\nTotal: $${orderDetails.totalAmount.toFixed(2)}\nPreferred Time: ${orderDetails.preferredTime}`;

        const whatsappUrl = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(orderMessage)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        alert("Please fill in your table number and order items.");
    }
}

displayMenu();
