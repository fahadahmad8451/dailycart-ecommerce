
const products = [
    { id: 1, name: "Everyday Tote", category: "Accessories", price: 1850, emoji: "👜", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85", color: "#f1d9c8", tag: "Popular", description: "A roomy bag for everyday use." },
    { id: 2, name: "Ceramic Mug", category: "Home", price: 950, emoji: "☕", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85", color: "#d9e5d0", tag: "Favourite", description: "A simple mug for your coffee break." },
    { id: 3, name: "Desk Lamp", category: "Home", price: 3250, emoji: "💡", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", color: "#e1ddf7", tag: "New", description: "A soft light for your workspace." },
    { id: 4, name: "Wireless Buds", category: "Tech", price: 4950, emoji: "🎧", image: "https://images.unsplash.com/photo-1753973169894-ba4ebd59aff7?auto=format&fit=crop&w=900&q=85", color: "#d6e6ed", tag: "Popular", description: "Compact audio for everyday listening." },
    { id: 5, name: "Travel Bottle", category: "Accessories", price: 1450, emoji: "🧴", image: "https://images.unsplash.com/photo-1633354557397-33ee5af54117?auto=format&fit=crop&w=900&q=85", color: "#f3e4ad", tag: "", description: "A reusable bottle for busy days." },
    { id: 6, name: "Notebook Set", category: "Stationery", price: 780, emoji: "📒", image: "https://images.unsplash.com/photo-1620275765334-4ed948bb4502?auto=format&fit=crop&w=900&q=85", color: "#f1d4dc", tag: "", description: "Notebooks for ideas and plans." },
    { id: 7, name: "Mini Speaker", category: "Tech", price: 2850, emoji: "🔊", image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=85", color: "#d8d9ed", tag: "New", description: "Small speaker for your favourite music." },
    { id: 8, name: "Phone Stand", category: "Tech", price: 650, emoji: "📱", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85", color: "#d6e5d8", tag: "", description: "Keep your phone upright on a desk." }
];

// These arrays keep track of cart items and wishlist items.
let cart = JSON.parse(localStorage.getItem("dailycart-cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("dailycart-wishlist")) || [];

// Select important HTML elements.
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const productCount = document.getElementById("product-count");
const noProducts = document.getElementById("no-products");
const cartPanel = document.getElementById("cart-panel");
const pageShade = document.getElementById("page-shade");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const emptyCart = document.getElementById("empty-cart");
const cartBottom = document.getElementById("cart-bottom");
const checkoutDialog = document.getElementById("checkout-dialog");

// Convert a number into a readable Pakistani Rupee price.
function formatPrice(price) {
    return "Rs. " + price.toLocaleString("en-PK");
}

// Display all products on the page.
function showProducts(productArray) {
    productList.innerHTML = "";

    productArray.forEach(function(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image" style="--product-bg: ${product.color}">
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
                <img class="product-photo" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false">
                <span class="product-emoji" hidden>${product.emoji}</span>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <div class="product-name-price">
                    <h3>${product.name}</h3>
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                <p class="product-description">${product.description}</p>
                <button class="add-button" data-id="${product.id}">+ Add to cart</button>
            </div>
        `;

        productList.appendChild(card);
    });

    productCount.textContent = productArray.length + " products";

    if (productArray.length === 0) {
        noProducts.style.display = "block";
    } else {
        noProducts.style.display = "none";
    }
}

// Search products by name and filter them by category.
function filterProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(function(product) {
        const matchesName = product.name.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

        return matchesName && matchesCategory;
    });

    showProducts(filteredProducts);
}

// Add one product to the shopping cart.
function addToCart(productId) {
    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveData();
    showCart();
    showToast("Product added to cart");
}

// Save cart and wishlist in this browser.
function saveData() {
    localStorage.setItem("dailycart-cart", JSON.stringify(cart));
    localStorage.setItem("dailycart-wishlist", JSON.stringify(wishlist));
}

// Display cart items and calculate the total price.
function showCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function(item) {
        const product = products.find(function(product) {
            return product.id === item.id;
        });

        if (product) {
            const itemTotal = product.price * item.quantity;
            total = total + itemTotal;
            totalQuantity = totalQuantity + item.quantity;

            const row = document.createElement("div");
            row.className = "cart-row";
            row.innerHTML = `
                <div class="cart-row-image" style="--product-bg: ${product.color}">
                    <img src="${product.image}" alt="" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false">
                    <span hidden>${product.emoji}</span>
                </div>
                <div>
                    <h3>${product.name}</h3>
                    <p>${formatPrice(product.price)} each</p>
                    <div class="quantity-buttons">
                        <button data-action="minus" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button data-action="plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                        <button class="remove-button" data-action="remove" data-id="${product.id}">Remove</button>
                    </div>
                </div>
                <div class="cart-row-total">${formatPrice(itemTotal)}</div>
            `;
            cartItems.appendChild(row);
        }
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(total);
    document.getElementById("checkout-total").textContent = formatPrice(total);

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        cartBottom.style.display = "none";
    } else {
        emptyCart.style.display = "none";
        cartBottom.style.display = "block";
    }
}

// Change quantity or remove an item from the cart.
function changeCartItem(productId, action) {
    const item = cart.find(function(cartItem) {
        return cartItem.id === productId;
    });

    if (!item) {
        return;
    }

    if (action === "plus") {
        item.quantity = item.quantity + 1;
    } else if (action === "minus") {
        item.quantity = item.quantity - 1;
    } else if (action === "remove") {
        cart = cart.filter(function(cartItem) {
            return cartItem.id !== productId;
        });
    }

    cart = cart.filter(function(cartItem) {
        return cartItem.quantity > 0;
    });

    saveData();
    showCart();
}

// Open and close the cart panel.
function openCart() {
    cartPanel.classList.add("open");
    pageShade.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    pageShade.classList.remove("show");
}

// Show a small message after a user action.
let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 2000);
}

// Product buttons use event delegation.
productList.addEventListener("click", function(event) {
    const button = event.target.closest(".add-button");

    if (button) {
        addToCart(Number(button.dataset.id));
    }
});

// Cart buttons also use event delegation.
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (button) {
        const productId = Number(button.dataset.id);
        const action = button.dataset.action;
        changeCartItem(productId, action);
    }
});

// Connect search and category filter to the page.
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Open and close cart.
document.getElementById("cart-button").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
pageShade.addEventListener("click", closeCart);

// Mobile navigation menu.
document.getElementById("menu-button").addEventListener("click", function() {
    document.getElementById("navbar").classList.toggle("show");
});

// Close mobile navigation after choosing a link.
document.querySelectorAll(".navbar a").forEach(function(link) {
    link.addEventListener("click", function() {
        document.getElementById("navbar").classList.remove("show");
    });
});

// Open checkout after checking that the cart is not empty.
document.getElementById("checkout-button").addEventListener("click", function() {
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }

    closeCart();
    document.getElementById("checkout-form").style.display = "flex";
    document.getElementById("order-success").classList.remove("show");
    checkoutDialog.showModal();
});

document.getElementById("close-checkout").addEventListener("click", function() {
    checkoutDialog.close();
});

// Validate checkout details and show a demo order message.
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const customerName = document.getElementById("customer-name").value.trim();
    const customerEmail = document.getElementById("customer-email").value.trim();
    const customerAddress = document.getElementById("customer-address").value.trim();

    if (customerName.length < 2 || customerEmail === "" || customerAddress.length < 8) {
        document.getElementById("checkout-feedback").textContent = "Please enter valid checkout details.";
        return;
    }

    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const total = cart.reduce(function(sum, item) {
        const product = products.find(function(product) {
            return product.id === item.id;
        });
        return sum + product.price * item.quantity;
    }, 0);

    document.getElementById("order-message").textContent =
        "Thank you, " + customerName + ". Your demo order #" + orderNumber +
        " has a total of " + formatPrice(total) + ".";

    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("order-success").classList.add("show");

    cart = [];
    saveData();
    showCart();
    this.reset();
});

// Close the order dialog and return to the products.
document.getElementById("finish-order").addEventListener("click", function() {
    checkoutDialog.close();
    showToast("Thank you for trying DailyCart");
});

// Contact form front-end validation.
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    document.getElementById("contact-feedback").textContent =
        "Thanks! This demo form does not send a message to a server.";
    this.reset();
});

// Set the current year in the footer.
document.getElementById("year").textContent = new Date().getFullYear();

// Display products and saved cart when the page first opens.
showProducts(products);
showCart();
