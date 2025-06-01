let order = [];
let savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];

// Function to load medications from JSON file
async function loadMedications() {
    try {
        const response = await fetch('med.json'); 

        Object.keys(data).forEach(category => {
            const section = document.getElementById(category.toLowerCase());
            if (section) {
                const selectElement = section.querySelector('select');
                data[category].forEach(item => {
                    const option = document.createElement('option');
                    option.value = `${item.name}|${item.price}`;
                    option.textContent = `${item.name} - $${item.price}`;
                    selectElement.appendChild(option);
                });
            }
        });
    } catch (error) {
        console.error('Error loading medications:', error);
    }
}

// Function to add an item to the order
function addItem(section) {
    const select = document.getElementById(`${section}-select`);
    const quantityInput = document.getElementById(`${section}-quantity`);
    const [itemName, itemPrice] = select.value.split('|');
    const quantity = parseInt(quantityInput.value);

    if (quantity > 0 && itemName) {
        const existingItemIndex = order.findIndex(item => item.itemName === itemName);
        if (existingItemIndex > -1) {
            order[existingItemIndex].quantity += quantity;
        } else {
            order.push({ itemName, quantity, itemPrice: parseFloat(itemPrice) });
        }
        updateTable();
        quantityInput.value = ''; 
    } else {
        alert("Please select a medication and enter a valid quantity.");
    }
}

// Function to update the order table
function updateTable() {
    const tbody = document.getElementById('order-table-body');
    tbody.innerHTML = '';
    let total = 0;

    order.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.itemName}</td>
            <td>
                <button onclick="decreaseQuantity(${index})">-</button>
                ${item.quantity}
                <button onclick="increaseQuantity(${index})">+</button>
            </td>
            <td>$${(item.itemPrice * item.quantity).toFixed(2)}</td>
            <td><button onclick="removeItem(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
        total += item.itemPrice * item.quantity;
    });

    document.getElementById('total-price').innerText = `$${total.toFixed(2)}`;
}

// Quantity controls
function increaseQuantity(index) {
    order[index].quantity += 1;
    updateTable();
}

function decreaseQuantity(index) {
    if (order[index].quantity > 1) {
        order[index].quantity -= 1;
        updateTable();
    } else {
        alert("Quantity cannot be less than 1.");
    }
}

// Remove an item
function removeItem(index) {
    order.splice(index, 1); 
    updateTable();
}

// Save and apply favorites
function saveFavourite() {
    if (order.length > 0) {
        localStorage.setItem('favouriteOrder', JSON.stringify(order));
        alert("Order saved to favorites!");
    } else {
        alert("Your order is empty. Nothing to save!");
    }
}

function applyFavourite() {
    const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder'));
    if (favouriteOrder && favouriteOrder.length > 0) {
        order = favouriteOrder;
        updateTable();
        alert("Favourite order applied!");
    } else {
        alert("No favorite order found!");
    }
}

// Save and load order history
function saveOrder() {
    if (order.length > 0) {
        savedOrders.push([...order]); // Save a copy of the current order
        localStorage.setItem('savedOrders', JSON.stringify(savedOrders));
        updateOrderHistoryDropdown();
        alert("Order saved to history!");
    } else {
        alert("Your order is empty. Nothing to save!");
    }
}

function updateOrderHistoryDropdown() {
    const dropdown = document.getElementById('order-history');
    dropdown.innerHTML = '<option value="">Select Saved Order</option>';
    savedOrders.forEach((savedOrder, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Order #${index + 1}`;
        dropdown.appendChild(option);
    });
}

function loadOrder(index) {
    if (index === '') return;
    order = [...savedOrders[index]]; // Load the selected order
    updateTable();
}

// Checkout
function checkout() {
    if (order.length === 0) {
        alert("Your order is empty!");
    } else {
        localStorage.setItem('currentOrder', JSON.stringify(order));
        alert("Proceeding to checkout!");
        window.location.href = './checkout.html';
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadMedications();
    updateTable();
    updateOrderHistoryDropdown();
});
