function loadCheckoutOrder() {
    const order = JSON.parse(localStorage.getItem('currentOrder')) || [];
    const tbody = document.getElementById('order-table-body');
    tbody.innerHTML = '';
    let total = 0;

    order.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.itemName}</td><td>${item.quantity}</td><td>$${(item.itemPrice * item.quantity).toFixed(2)}</td>`;
        tbody.appendChild(row);
        total += item.itemPrice * item.quantity;
    });

    document.getElementById('total-price').innerText = `$${total.toFixed(2)}`;
}

function toggleCardDetails(show) {
    const cardDetails = document.getElementById('card-details');
    const inputs = cardDetails.querySelectorAll('input');
    if (show) {
        cardDetails.style.display = 'block';
        inputs.forEach(input => input.setAttribute('required', 'true'));
    } else {
        cardDetails.style.display = 'none';
        inputs.forEach(input => input.removeAttribute('required'));
    }
}

function processPayment(event) {
    event.preventDefault();

    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    const paymentMethod = document.querySelector('input[name="pay"]:checked').value;
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        if (!cardNumber.match(/(\d{4}[- ]?){3}\d{4}/)) {
            alert('Invalid card number format.');
            return;
        }
    }

    alert('Thank you for your purchase! Your order will be delivered on ' +
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString());
}

document.addEventListener('DOMContentLoaded', loadCheckoutOrder);
