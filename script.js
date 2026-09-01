// =============================================
// SHOPGUARD - E-COMMERCE APPLICATION
// =============================================

// =============================================
// PRODUCT DATA
// =============================================

const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        category: "Electronics",
        price: 129.99,
        rating: 4.8,
        image: "🎧",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "Electronics",
        price: 299.99,
        rating: 4.6,
        image: "⌚",
        description: "Feature-rich smartwatch with health monitoring"
    },
    {
        id: 3,
        name: "Casual Cotton T-Shirt",
        category: "Fashion",
        price: 34.99,
        rating: 4.4,
        image: "👕",
        description: "Comfortable everyday cotton t-shirt in various colors"
    },
    {
        id: 4,
        name: "Professional Camera",
        category: "Electronics",
        price: 899.99,
        rating: 4.9,
        image: "📷",
        description: "Full-frame DSLR camera with advanced features"
    },
    {
        id: 5,
        name: "Yoga Mat Premium",
        category: "Sports",
        price: 49.99,
        rating: 4.7,
        image: "🧘",
        description: "Non-slip premium yoga mat with carrying strap"
    },
    {
        id: 6,
        name: "Stainless Steel Cookware Set",
        category: "Home & Kitchen",
        price: 199.99,
        rating: 4.5,
        image: "🍳",
        description: "Complete cookware set with 10 pieces"
    },
    {
        id: 7,
        name: "Running Shoes Elite",
        category: "Sports",
        price: 139.99,
        rating: 4.8,
        image: "👟",
        description: "Professional-grade running shoes with cushioning"
    },
    {
        id: 8,
        name: "LED Desk Lamp",
        category: "Home & Kitchen",
        price: 59.99,
        rating: 4.6,
        image: "💡",
        description: "Adjustable LED lamp with USB charging port"
    },
    {
        id: 9,
        name: "Winter Wool Coat",
        category: "Fashion",
        price: 189.99,
        rating: 4.7,
        image: "🧥",
        description: "Elegant wool coat for winter season"
    },
    {
        id: 10,
        name: "Portable Bluetooth Speaker",
        category: "Electronics",
        price: 79.99,
        rating: 4.5,
        image: "🔊",
        description: "Waterproof portable speaker with 20-hour battery"
    }
];

// =============================================
// APPLICATION STATE
// =============================================

let cart = [];
let currentUser = null;
let currentPage = "home";
let filteredProducts = [...products];

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    restoreSession();
    renderProducts();
    updateCartCount();
});

// =============================================
// RESTORE LOGIN SESSION
// =============================================

function restoreSession() {
    const savedUser = sessionStorage.getItem("shopguard_user");

    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateAuthUI();
        } catch (error) {
            console.error("Unable to restore user session:", error);
            sessionStorage.removeItem("shopguard_user");
            currentUser = null;
            updateAuthUI();
        }
    }
}

// =============================================
// EVENT LISTENERS
// =============================================

function initializeEventListeners() {

    // ---------------------------------------------
    // Navigation
    // ---------------------------------------------

    document.querySelectorAll("[data-page]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const page = e.currentTarget.dataset.page;
            navigateTo(page);
        });
    });

    // ---------------------------------------------
    // Logo
    // ---------------------------------------------

    const logoLink = document.querySelector(".logo-link");

    if (logoLink) {
        logoLink.addEventListener("click", (e) => {
            e.preventDefault();
            navigateTo("home");
        });
    }

    // ---------------------------------------------
    // Hero CTA
    // ---------------------------------------------

    const heroCta = document.querySelector(".hero-cta");

    if (heroCta) {
        heroCta.addEventListener("click", () => {
            navigateTo("products");
        });
    }

    // ---------------------------------------------
    // Cart
    // ---------------------------------------------

    const cartIcon = document.getElementById("cartIcon");

    if (cartIcon) {
        cartIcon.addEventListener("click", toggleCart);
    }

    // ---------------------------------------------
    // Close cart buttons
    // ---------------------------------------------

    document.querySelectorAll("#cartModal .close-modal").forEach(btn => {
        btn.addEventListener("click", closeCart);
    });

    // ---------------------------------------------
    // Close cart when clicking outside
    // ---------------------------------------------

    const cartModal = document.getElementById("cartModal");

    if (cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target.id === "cartModal") {
                closeCart();
            }
        });
    }

    // ---------------------------------------------
    // Search
    // ---------------------------------------------

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    const searchButton = document.querySelector(".search-button");

    if (searchButton) {
        searchButton.addEventListener("click", handleSearch);
    }

    // ---------------------------------------------
    // Category filters
    // ---------------------------------------------

    document.querySelectorAll(".category-filter").forEach(radio => {
        radio.addEventListener("change", handleCategoryFilter);
    });

    // ---------------------------------------------
    // Sorting
    // ---------------------------------------------

    const sortSelect = document.getElementById("sortSelect");

    if (sortSelect) {
        sortSelect.addEventListener("change", handleSort);
    }

    // ---------------------------------------------
    // Reset filters
    // ---------------------------------------------

    const resetFiltersButton = document.querySelector(".reset-filters");

    if (resetFiltersButton) {
        resetFiltersButton.addEventListener("click", resetFilters);
    }

    // ---------------------------------------------
    // Checkout button
    // ---------------------------------------------

    const checkoutButton = document.getElementById("checkoutBtn");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            closeCart();
            navigateTo("checkout");
        });
    }

    // ---------------------------------------------
    // Checkout form
    // ---------------------------------------------

    const checkoutForm = document.getElementById("checkoutForm");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", handleCheckout);
    }

    // ---------------------------------------------
    // Continue shopping
    // ---------------------------------------------

    const continueShoppingButton =
        document.getElementById("continueShoppingBtn");

    if (continueShoppingButton) {
        continueShoppingButton.addEventListener("click", () => {
            navigateTo("home");
        });
    }

    // ---------------------------------------------
    // Mobile hamburger
    // ---------------------------------------------

    const hamburger = document.getElementById("hamburger");

    if (hamburger) {
        hamburger.addEventListener("click", toggleMobileMenu);
    }

    // =============================================
    // LOGIN
    // =============================================

    const loginButton = document.getElementById("loginBtn");

    if (loginButton) {
        loginButton.addEventListener("click", openLoginModal);
    }

    const closeLoginButton =
        document.getElementById("closeLoginModal");

    if (closeLoginButton) {
        closeLoginButton.addEventListener(
            "click",
            closeLoginModal
        );
    }

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const loginModal = document.getElementById("loginModal");

    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target.id === "loginModal") {
                closeLoginModal();
            }
        });
    }

    // =============================================
    // REGISTRATION
    // =============================================

    const registerButton =
        document.getElementById("registerBtn");

    if (registerButton) {
        registerButton.addEventListener(
            "click",
            openRegisterModal
        );
    }

    const closeRegisterButton =
        document.getElementById("closeRegisterModal");

    if (closeRegisterButton) {
        closeRegisterButton.addEventListener(
            "click",
            closeRegisterModal
        );
    }

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener(
            "submit",
            handleRegister
        );
    }

    const registerModal =
        document.getElementById("registerModal");

    if (registerModal) {
        registerModal.addEventListener("click", (e) => {
            if (e.target.id === "registerModal") {
                closeRegisterModal();
            }
        });
    }

    // ---------------------------------------------
    // Escape key
    // ---------------------------------------------

    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") {
            return;
        }

        const loginModal =
            document.getElementById("loginModal");

        const registerModal =
            document.getElementById("registerModal");

        const cartModal =
            document.getElementById("cartModal");

        if (
            loginModal &&
            loginModal.classList.contains("active")
        ) {
            closeLoginModal();
        }

        if (
            registerModal &&
            registerModal.classList.contains("active")
        ) {
            closeRegisterModal();
        }

        if (
            cartModal &&
            cartModal.classList.contains("active")
        ) {
            closeCart();
        }
    });

    // ---------------------------------------------
    // Close user dropdown when clicking outside
    // ---------------------------------------------

    document.addEventListener("click", (e) => {

        const userDropdown =
            document.querySelector(".user-dropdown");

        if (
            userDropdown &&
            !e.target.closest(".user-menu")
        ) {
            userDropdown.classList.remove("active");
        }
    });
}

// =============================================
// NAVIGATION
// =============================================

function navigateTo(page) {

    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active");
    });

    let pageId;

    if (page === "home") {
        pageId = "homePage";
    } else if (page === "products") {
        pageId = "productsPage";
    } else if (page === "checkout") {
        pageId = "checkoutPage";
    } else if (page === "confirmation") {
        pageId = "confirmationPage";
    } else {
        pageId = "homePage";
    }

    const targetPage =
        document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active");
    }

    currentPage = page;

    window.scrollTo(0, 0);

    if (page === "checkout") {
        updateCheckoutSummary();
    }
}

// =============================================
// PRODUCT DISPLAY
// =============================================

function renderProducts() {

    const grid =
        document.getElementById("productsGrid");

    const emptyState =
        document.getElementById("emptyState");

    if (!grid || !emptyState) {
        return;
    }

    if (filteredProducts.length === 0) {

        grid.innerHTML = "";

        emptyState.style.display = "block";

        const productCount =
            document.getElementById("productCount");

        if (productCount) {
            productCount.textContent = "No products found";
        }

        return;
    }

    emptyState.style.display = "none";

    const productCount =
        document.getElementById("productCount");

    if (productCount) {
        productCount.textContent =
            `Showing ${filteredProducts.length} product${
                filteredProducts.length !== 1 ? "s" : ""
            }`;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div
            class="product-card"
            data-testid="product-card"
            data-product-id="${product.id}"
        >
            <div class="product-image-container">
                ${product.image}
            </div>

            <div class="product-content">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-rating">

                    <span class="stars">
                        ${getStarRating(product.rating)}
                    </span>

                    <span class="rating-value">
                        ${product.rating}
                    </span>

                </div>

                <div class="product-price">
                    $${product.price.toFixed(2)}
                </div>

                <button
                    class="add-to-cart-btn"
                    data-testid="add-to-cart"
                    data-product-id="${product.id}"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>
        </div>
    `).join("");
}

// =============================================
// STAR RATING
// =============================================

function getStarRating(rating) {

    const fullStars =
        Math.floor(rating);

    const hasHalfStar =
        rating % 1 !== 0;

    let stars =
        "★".repeat(fullStars);

    if (hasHalfStar) {
        stars += "✯";
    }

    stars +=
        "☆".repeat(
            5 - Math.ceil(rating)
        );

    return stars;
}

// =============================================
// SEARCH
// =============================================

function handleSearch() {

    const searchInput =
        document.getElementById("searchInput");

    const searchTerm =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    applyFilters(searchTerm);
}

// =============================================
// CATEGORY FILTER
// =============================================

function handleCategoryFilter(e) {

    const category =
        e.target.value;

    applyFilters(null, category);
}

// =============================================
// SORTING
// =============================================

function handleSort(e) {

    const sortType =
        e.target.value;

    let sorted =
        [...filteredProducts];

    switch (sortType) {

        case "price-low":
            sorted.sort(
                (a, b) => a.price - b.price
            );
            break;

        case "price-high":
            sorted.sort(
                (a, b) => b.price - a.price
            );
            break;

        case "rating":
            sorted.sort(
                (a, b) => b.rating - a.rating
            );
            break;

        case "featured":
        default:
            sorted = [...filteredProducts];
            break;
    }

    filteredProducts = sorted;

    renderProducts();
}

// =============================================
// APPLY FILTERS
// =============================================

function applyFilters(
    searchTerm = null,
    category = null
) {

    const searchInput =
        document.getElementById("searchInput");

    const search =
        searchTerm !== null
            ? searchTerm
            : (
                searchInput
                    ? searchInput.value.toLowerCase().trim()
                    : ""
            );

    const selectedCategoryInput =
        document.querySelector(
            'input[name="category"]:checked'
        );

    const selectedCategory =
        category !== null
            ? category
            : (
                selectedCategoryInput
                    ? selectedCategoryInput.value
                    : "all"
            );

    filteredProducts =
        products.filter(product => {

            const matchesSearch =
                search === "" ||
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search) ||
                product.description
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    renderProducts();
}

// =============================================
// RESET FILTERS
// =============================================

function resetFilters() {

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = "";
    }

    const allCategory =
        document.querySelector(
            'input[name="category"][value="all"]'
        );

    if (allCategory) {
        allCategory.checked = true;
    }

    const sortSelect =
        document.getElementById("sortSelect");

    if (sortSelect) {
        sortSelect.value = "featured";
    }

    filteredProducts =
        [...products];

    renderProducts();
}

// =============================================
// SHOPPING CART
// =============================================

function addToCart(productId) {

    const product =
        products.find(
            p => p.id === productId
        );

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(
            item => item.id === productId
        );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();

    showCartNotification();
}

// =============================================
// REMOVE FROM CART
// =============================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    updateCart();
}

// =============================================
// UPDATE QUANTITY
// =============================================

function updateQuantity(
    productId,
    quantity
) {

    const item =
        cart.find(
            item => item.id === productId
        );

    if (item) {

        item.quantity =
            Math.max(1, quantity);
    }

    updateCart();
}

// =============================================
// UPDATE CART
// =============================================

function updateCart() {

    renderCart();
    updateCartCount();
}

// =============================================
// CART COUNT
// =============================================

function updateCartCount() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

// =============================================
// OPEN / CLOSE CART
// =============================================

function toggleCart() {

    const modal =
        document.getElementById("cartModal");

    if (!modal) {
        return;
    }

    modal.classList.toggle("active");

    renderCart();
}

function closeCart() {

    const modal =
        document.getElementById("cartModal");

    if (modal) {
        modal.classList.remove("active");
    }
}

// =============================================
// RENDER CART
// =============================================

function renderCart() {

    const cartItemsDiv =
        document.getElementById("cartItems");

    const emptyMsg =
        document.querySelector(
            ".empty-cart-message"
        );

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    const subtotalSpan =
        document.getElementById("subtotal");

    const shippingSpan =
        document.getElementById("shipping");

    const totalSpan =
        document.getElementById("cartTotal");

    if (
        !cartItemsDiv ||
        !emptyMsg ||
        !checkoutBtn ||
        !subtotalSpan ||
        !shippingSpan ||
        !totalSpan
    ) {
        return;
    }

    if (cart.length === 0) {

        cartItemsDiv.innerHTML = "";

        emptyMsg.style.display = "block";

        checkoutBtn.style.display = "none";

        subtotalSpan.textContent = "$0.00";
        shippingSpan.textContent = "$0.00";
        totalSpan.textContent = "$0.00";

        return;
    }

    emptyMsg.style.display = "none";

    checkoutBtn.style.display = "block";

    cartItemsDiv.innerHTML =
        cart.map(item => `
            <div
                class="cart-item"
                data-testid="cart-item"
            >

                <div class="cart-item-image">
                    ${item.image}
                </div>

                <div class="cart-item-details">

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="cart-item-price">
                        $${item.price.toFixed(2)}
                    </div>

                    <div class="quantity-control">

                        <button
                            class="qty-btn"
                            onclick="updateQuantity(
                                ${item.id},
                                ${item.quantity - 1}
                            )"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            class="qty-input"
                            value="${item.quantity}"
                            readonly
                        >

                        <button
                            class="qty-btn"
                            onclick="updateQuantity(
                                ${item.id},
                                ${item.quantity + 1}
                            )"
                        >
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeFromCart(${item.id})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </div>
        `).join("");

    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                (item.price * item.quantity),
            0
        );

    const shipping =
        subtotal > 0
            ? (subtotal > 100 ? 0 : 9.99)
            : 0;

    const total =
        subtotal + shipping;

    subtotalSpan.textContent =
        `$${subtotal.toFixed(2)}`;

    shippingSpan.textContent =
        shipping === 0
            ? "FREE"
            : `$${shipping.toFixed(2)}`;

    totalSpan.textContent =
        `$${total.toFixed(2)}`;
}

// =============================================
// CART NOTIFICATION
// =============================================

function showCartNotification() {

    console.log("Item added to cart!");
}

// =============================================
// CHECKOUT
// =============================================

function updateCheckoutSummary() {

    const checkoutItemsDiv =
        document.getElementById("checkoutItems");

    const subtotalSpan =
        document.getElementById("checkoutSubtotal");

    const shippingSpan =
        document.getElementById("checkoutShipping");

    const grandTotalSpan =
        document.getElementById("checkoutGrandTotal");

    if (
        !checkoutItemsDiv ||
        !subtotalSpan ||
        !shippingSpan ||
        !grandTotalSpan
    ) {
        return;
    }

    if (cart.length === 0) {

        checkoutItemsDiv.innerHTML =
            "<p>Your cart is empty</p>";

        subtotalSpan.textContent = "$0.00";
        shippingSpan.textContent = "$0.00";
        grandTotalSpan.textContent = "$0.00";

        return;
    }

    checkoutItemsDiv.innerHTML =
        cart.map(item => `
            <div class="checkout-item">

                <span class="checkout-item-name">
                    ${item.name}
                </span>

                <span class="checkout-item-qty">
                    x${item.quantity}
                </span>

                <span class="checkout-item-price">
                    $${(
                        item.price * item.quantity
                    ).toFixed(2)}
                </span>

            </div>
        `).join("");

    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                (item.price * item.quantity),
            0
        );

    const shipping =
        subtotal > 0
            ? (subtotal > 100 ? 0 : 9.99)
            : 0;

    const grandTotal =
        subtotal + shipping;

    subtotalSpan.textContent =
        `$${subtotal.toFixed(2)}`;

    shippingSpan.textContent =
        shipping === 0
            ? "FREE"
            : `$${shipping.toFixed(2)}`;

    grandTotalSpan.textContent =
        `$${grandTotal.toFixed(2)}`;
}

// =============================================
// CHECKOUT FORM
// =============================================

function handleCheckout(e) {

    e.preventDefault();

    const formInputs =
        document.querySelectorAll(
            "#checkoutForm .form-input"
        );

    let isValid = true;

    formInputs.forEach(input => {

        input.classList.remove("error");

        const errorMsg =
            input.nextElementSibling;

        if (
            errorMsg &&
            errorMsg.classList.contains(
                "error-message"
            )
        ) {
            errorMsg.textContent = "";
        }

        if (!input.value.trim()) {

            input.classList.add("error");

            if (errorMsg) {
                errorMsg.textContent =
                    "This field is required";
            }

            isValid = false;
        }

        // -----------------------------------------
        // Email validation
        // -----------------------------------------

        if (input.id === "email") {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(
                    input.value
                )
            ) {

                input.classList.add("error");

                if (errorMsg) {
                    errorMsg.textContent =
                        "Please enter a valid email";
                }

                isValid = false;
            }
        }

        // -----------------------------------------
        // Phone validation
        // -----------------------------------------

        if (input.id === "phone") {

            const cleanPhone =
                input.value.replace(
                    /\D/g,
                    ""
                );

            if (cleanPhone.length < 10) {

                input.classList.add("error");

                if (errorMsg) {
                    errorMsg.textContent =
                        "Please enter a valid phone number";
                }

                isValid = false;
            }
        }

        // -----------------------------------------
        // Postal code validation
        // -----------------------------------------

        if (input.id === "postalCode") {

            const cleanPostal =
                input.value.replace(
                    /\D/g,
                    ""
                );

            if (cleanPostal.length < 5) {

                input.classList.add("error");

                if (errorMsg) {
                    errorMsg.textContent =
                        "Please enter a valid postal code";
                }

                isValid = false;
            }
        }
    });

    if (!isValid) {
        return;
    }

    processOrder();
}

// =============================================
// PROCESS ORDER
// =============================================

function processOrder() {

    const orderId =
        `SG-${String(
            Math.floor(
                Math.random() * 1000000
            )
        ).padStart(6, "0")}`;

    const orderTotal =
        cart.reduce(
            (sum, item) =>
                sum +
                (item.price * item.quantity),
            0
        );

    const shipping =
        orderTotal > 100
            ? 0
            : 9.99;

    const grandTotal =
        orderTotal + shipping;

    const orderIdElement =
        document.getElementById("orderId");

    const orderTotalElement =
        document.getElementById("orderTotal");

    if (orderIdElement) {
        orderIdElement.textContent =
            `#${orderId}`;
    }

    if (orderTotalElement) {
        orderTotalElement.textContent =
            `$${grandTotal.toFixed(2)}`;
    }

    cart = [];

    updateCartCount();

    navigateTo("confirmation");
}

// =============================================
// MOBILE MENU
// =============================================

function toggleMobileMenu() {

    const hamburger =
        document.getElementById("hamburger");

    if (!hamburger) {
        return;
    }

    hamburger.classList.toggle("active");
}

// =============================================
// AUTHENTICATION
// =============================================

// =============================================
// LOGIN MODAL
// =============================================

function openLoginModal() {

    const loginModal =
        document.getElementById("loginModal");

    if (!loginModal) {
        return;
    }

    loginModal.classList.add("active");

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {
        loginForm.reset();
    }

    const errorMsg =
        document.getElementById("loginError");

    if (errorMsg) {
        errorMsg.textContent = "";
        errorMsg.classList.remove("show");
        errorMsg.style.display = "none";
    }
}

// =============================================
// CLOSE LOGIN MODAL
// =============================================

function closeLoginModal() {

    const loginModal =
        document.getElementById("loginModal");

    if (loginModal) {
        loginModal.classList.remove("active");
    }

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {
        loginForm.reset();
    }

    const errorMsg =
        document.getElementById("loginError");

    if (errorMsg) {
        errorMsg.textContent = "";
        errorMsg.classList.remove("show");
        errorMsg.style.display = "none";
    }
}

// =============================================
// LOGIN USING FASTAPI + POSTGRESQL
// =============================================

async function handleLogin(e) {

    e.preventDefault();

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const errorMsg =
        document.getElementById("loginError");

    if (
        !emailInput ||
        !passwordInput ||
        !errorMsg
    ) {
        console.error(
            "Login form elements not found."
        );
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    errorMsg.classList.remove("show");
    errorMsg.style.display = "none";
    errorMsg.textContent = "";

    // ---------------------------------------------
    // Basic validation
    // ---------------------------------------------

    if (!email || !password) {

        errorMsg.textContent =
            "Please enter your email and password.";

        errorMsg.classList.add("show");
        errorMsg.style.display = "block";

        return;
    }

    try {

        console.log(
            "Sending login request..."
        );

        // -----------------------------------------
        // Call FastAPI backend
        // -----------------------------------------

        const response =
            await fetch(
                "http://127.0.0.1:8000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

        // -----------------------------------------
        // Read backend response
        // -----------------------------------------

        const data =
            await response.json();

        console.log(
            "Backend response:",
            data
        );

        // -----------------------------------------
        // Login failed
        // -----------------------------------------

        if (!response.ok) {

            errorMsg.textContent =
                data.detail ||
                "Invalid email or password.";

            errorMsg.classList.add("show");
            errorMsg.style.display = "block";

            return;
        }

        // -----------------------------------------
        // Login successful
        // -----------------------------------------

        currentUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email
        };

        // -----------------------------------------
        // Save session
        // -----------------------------------------

        sessionStorage.setItem(
            "shopguard_user",
            JSON.stringify(currentUser)
        );

        // -----------------------------------------
        // Update UI
        // -----------------------------------------

        updateAuthUI();

        closeLoginModal();

        console.log(
            "Login successful:",
            currentUser
        );

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        errorMsg.textContent =
            "Unable to connect to ShopGuard server. " +
            "Make sure FastAPI is running.";

        errorMsg.classList.add("show");
        errorMsg.style.display = "block";
    }
}

// =============================================
// REGISTRATION
// =============================================

function openRegisterModal() {

    const registerModal =
        document.getElementById(
            "registerModal"
        );

    if (!registerModal) {
        console.error(
            "Register modal not found."
        );
        return;
    }

    registerModal.classList.add("active");

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    if (registerForm) {
        registerForm.reset();
    }

    const errorMsg =
        document.getElementById(
            "registerError"
        );

    const successMsg =
        document.getElementById(
            "registerSuccess"
        );

    if (errorMsg) {
        errorMsg.style.display = "none";
        errorMsg.textContent = "";
    }

    if (successMsg) {
        successMsg.style.display = "none";
        successMsg.textContent = "";
    }
}

// =============================================
// CLOSE REGISTRATION MODAL
// =============================================

function closeRegisterModal() {

    const registerModal =
        document.getElementById(
            "registerModal"
        );

    if (registerModal) {
        registerModal.classList.remove(
            "active"
        );
    }

    const form =
        document.getElementById(
            "registerForm"
        );

    if (form) {
        form.reset();
    }

    const errorMsg =
        document.getElementById(
            "registerError"
        );

    const successMsg =
        document.getElementById(
            "registerSuccess"
        );

    if (errorMsg) {
        errorMsg.style.display = "none";
        errorMsg.textContent = "";
    }

    if (successMsg) {
        successMsg.style.display = "none";
        successMsg.textContent = "";
    }
}

// =============================================
// HANDLE REGISTRATION
// =============================================

async function handleRegister(e) {

    e.preventDefault();

    const nameInput =
        document.getElementById(
            "registerName"
        );

    const emailInput =
        document.getElementById(
            "registerEmail"
        );

    const passwordInput =
        document.getElementById(
            "registerPassword"
        );

    const errorMsg =
        document.getElementById(
            "registerError"
        );

    const successMsg =
        document.getElementById(
            "registerSuccess"
        );

    if (
        !nameInput ||
        !emailInput ||
        !passwordInput ||
        !errorMsg ||
        !successMsg
    ) {
        console.error(
            "Registration form elements not found."
        );
        return;
    }

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    errorMsg.style.display = "none";
    errorMsg.textContent = "";

    successMsg.style.display = "none";
    successMsg.textContent = "";

    // ---------------------------------------------
    // Basic validation
    // ---------------------------------------------

    if (!name || !email || !password) {

        errorMsg.textContent =
            "Please fill in all fields.";

        errorMsg.style.display = "block";

        return;
    }

    // ---------------------------------------------
    // Email validation
    // ---------------------------------------------

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        errorMsg.textContent =
            "Please enter a valid email address.";

        errorMsg.style.display = "block";

        return;
    }

    // ---------------------------------------------
    // Password validation
    // ---------------------------------------------

    if (password.length < 6) {

        errorMsg.textContent =
            "Password must contain at least 6 characters.";

        errorMsg.style.display = "block";

        return;
    }

    try {

        console.log(
            "Sending registration request..."
        );

        // -----------------------------------------
        // Call FastAPI backend
        // -----------------------------------------

        const response =
            await fetch(
                "http://127.0.0.1:8000/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

        // -----------------------------------------
        // Read backend response
        // -----------------------------------------

        const data =
            await response.json();

        console.log(
            "Registration response:",
            data
        );

        // -----------------------------------------
        // Registration failed
        // -----------------------------------------

        if (!response.ok) {

            errorMsg.textContent =
                data.detail ||
                "Registration failed.";

            errorMsg.style.display =
                "block";

            return;
        }

        // -----------------------------------------
        // Registration successful
        // -----------------------------------------

        successMsg.textContent =
            "Registration successful! You can now login.";

        successMsg.style.display =
            "block";

        errorMsg.style.display =
            "none";

        console.log(
            "Registration successful:",
            data
        );

        // -----------------------------------------
        // Clear registration form
        // -----------------------------------------

        document
            .getElementById("registerForm")
            .reset();

        // -----------------------------------------
        // Open login after short delay
        // -----------------------------------------

        setTimeout(() => {

            closeRegisterModal();

            openLoginModal();

            // Put registered email into login form
            const loginEmail =
                document.getElementById(
                    "loginEmail"
                );

            if (loginEmail) {
                loginEmail.value = email;
            }

        }, 1500);

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        errorMsg.textContent =
            "Unable to connect to ShopGuard server. " +
            "Make sure FastAPI is running.";

        errorMsg.style.display =
            "block";
    }
}

// =============================================
// LOGOUT
// =============================================

function logout() {

    currentUser = null;

    sessionStorage.removeItem(
        "shopguard_user"
    );

    updateAuthUI();

    const userDropdown =
        document.querySelector(
            ".user-dropdown"
        );

    if (userDropdown) {
        userDropdown.classList.remove(
            "active"
        );
    }

    navigateTo("home");

    console.log(
        "User logged out."
    );
}

// =============================================
// UPDATE AUTHENTICATION UI
// =============================================

function updateAuthUI() {

    const authSection =
        document.getElementById(
            "authSection"
        );

    if (!authSection) {
        return;
    }

    if (currentUser) {

        // =========================================
        // LOGGED-IN USER
        // =========================================

        authSection.innerHTML = `
            <div class="user-menu">

                <button
                    class="user-button"
                    id="userButton"
                >
                    👤 Hi, ${currentUser.name}
                </button>

                <div
                    class="user-dropdown"
                    id="userDropdown"
                >

                    <button
                        class="dropdown-item"
                        id="profileBtn"
                    >
                        Profile
                    </button>

                    <button
                        class="dropdown-item logout-btn"
                        id="logoutBtn"
                        data-testid="logout-button"
                    >
                        Logout
                    </button>

                </div>

            </div>
        `;

        // -----------------------------------------
        // User dropdown
        // -----------------------------------------

        const userButton =
            document.getElementById(
                "userButton"
            );

        const userDropdown =
            document.getElementById(
                "userDropdown"
            );

        if (
            userButton &&
            userDropdown
        ) {

            userButton.addEventListener(
                "click",
                (e) => {

                    e.preventDefault();
                    e.stopPropagation();

                    userDropdown.classList.toggle(
                        "active"
                    );
                }
            );
        }

        // -----------------------------------------
        // Logout button
        // -----------------------------------------

        const logoutButton =
            document.getElementById(
                "logoutBtn"
            );

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                (e) => {

                    e.preventDefault();

                    logout();
                }
            );
        }

        // -----------------------------------------
        // Profile button
        // -----------------------------------------

        const profileButton =
            document.getElementById(
                "profileBtn"
            );

        if (profileButton) {

            profileButton.addEventListener(
                "click",
                (e) => {

                    e.preventDefault();

                    alert(
                        `Profile:\n\n` +
                        `Name: ${currentUser.name}\n` +
                        `Email: ${currentUser.email}`
                    );
                }
            );
        }

    } else {

        // =========================================
        // LOGGED-OUT USER
        // =========================================

        authSection.innerHTML = `
            <button
                class="nav-btn register-btn"
                id="registerBtn"
            >
                📝 Register
            </button>

            <button
                class="nav-btn login-btn"
                id="loginBtn"
                data-testid="login-button"
            >
                👤 Login
            </button>
        `;

        // -----------------------------------------
        // Reconnect Register button
        // -----------------------------------------

        const registerButton =
            document.getElementById(
                "registerBtn"
            );

        if (registerButton) {

            registerButton.addEventListener(
                "click",
                openRegisterModal
            );
        }

        // -----------------------------------------
        // Reconnect Login button
        // -----------------------------------------

        const loginButton =
            document.getElementById(
                "loginBtn"
            );

        if (loginButton) {

            loginButton.addEventListener(
                "click",
                openLoginModal
            );
        }
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function formatCurrency(amount) {

    return `$${amount.toFixed(2)}`;
}