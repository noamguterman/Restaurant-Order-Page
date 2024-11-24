import menuArray from './data.js'

const itemsSection = document.getElementById('items-section')
const orderSection = document.getElementById('order-section')
const orderItems = document.getElementById('order--items')
const cartTotal = document.getElementById('cart--total')
const completeOrderBtn = document.getElementById('complete-order-btn')
const paymentSection = document.getElementById('payment-section')
const paymentForm = document.getElementById('payment-form')
const closeBtn = document.getElementById('close-btn')
const thankYouSection = document.getElementById('thank-you-section')
const formName = document.getElementById('form--name')
const formCard = document.getElementById('form--card')
const formCVV = document.getElementById('form--cvv')

function renderFooterText() {
    const currentYear = new Date().getFullYear()
    document.getElementById('footer--text').textContent = `© Noam Guterman ${currentYear}`
}
renderFooterText()

function renderMenuItems(arr) {
    return arr.forEach(item => {
        const { id, name, price, ingredients, image } = item
        
        return itemsSection.innerHTML += `
            <div class="item">
                <img class="item--image" src=${image}>
                <div class="item--details">
                    <h3 class="item--name">${name}</h3>
                    <p class="item--ingredients">${ingredients.join(', ')}</p>
                    <h4 class="item--price">$${price}</h4>
                </div>
                <button class="add-btn" id=${id}>+</button>
            </div>`
    })
}
renderMenuItems(menuArray)

const cart = {
    hasItems: false,
    total: 0
}

function updateCartTotal() {
    cartTotal.innerText = `$${cart.total}`
}

itemsSection.addEventListener('click', handleAddToCartClick)
function handleAddToCartClick(e) {
    if (e.target.classList.contains('add-btn')) {
        thankYouSection.innerHTML = ''
        if (!cart.hasItems) {
            orderSection.classList.remove('hidden')
            cart.hasItems = true
            addItemToCart(e)
        }
        else {
            addItemToCart(e)
        }
    }
}

function addItemToCart(e) {
    const item = menuArray.find(item => item.id === Number(e.target.id))
    cart.total += Number(item.price)
    orderItems.innerHTML += `
        <div class="order--item">
            <h3 class="order--item-name">${item.name}</h3>
            <button class="item--remove-btn" data-price="${item.price}">remove</button>
            <h4 class="order--item-price">$${item.price}</h4>
        </div>`
    updateCartTotal()
}

function resetCart() {
    if (cart.total === 0) {
        cart.hasItems = false
        orderSection.classList.add('hidden')
    }
}

orderSection.addEventListener('click', removeItemFromCart)
function removeItemFromCart(e) {
    if (e.target.classList.contains('item--remove-btn')) {
        cart.total -= Number(e.target.dataset.price)
        updateCartTotal()
        orderItems.removeChild(e.target.parentElement)
        resetCart()
    }
}

completeOrderBtn.addEventListener('click', openPaymentMenu)
function openPaymentMenu() {
    paymentSection.classList.remove('hidden')
}

formName.addEventListener('input', handleNameInput)
formCard.addEventListener('input', handleCardInput)
formCVV.addEventListener('input', handleCVVInput)
function handleNameInput(e) {
    const input = e.target;
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
}
function handleCardInput(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 16) {
        value = value.slice(0, 16);
    }
    input.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
}
function handleCVVInput(e) {
    const input = e.target
    input.value = input.value.replace(/\D/g, '')
    if (input.value.length > 3) {
        input.value = input.value.slice(0, 3)
    }
}

closeBtn.addEventListener('click', closePaymentMenu)
function closePaymentMenu() {
    paymentSection.classList.add('hidden')
    clearInputs()
}

paymentForm.addEventListener('submit', handlePayment)
function handlePayment(e) {
    e.preventDefault()
    const firstName = document.getElementById('form--name').value.split(' ')[0]
    
    paymentSection.classList.add('hidden')
    orderItems.innerHTML = ''
    cart.total = 0
    resetCart()
    thankYouSection.innerHTML = `
        <div id="thank-you">
            <h2 class="thank-you-text">Thanks, ${firstName}! Your order is on its way!</h2> 
        </div>`
        
    clearInputs()
}

function clearInputs() {
    document.getElementById('form--name').value = ''
    document.getElementById('form--card').value = ''
    document.getElementById('form--cvv').value = ''
}