# ShopGuard — E-Commerce QA Automation Platform

ShopGuard is a full-stack e-commerce web application built to demonstrate
web development, backend integration, database usage, and end-to-end QA
automation.

The project includes user authentication, product browsing, filtering,
sorting, shopping cart management, checkout, and order confirmation.

A complete automated regression suite was developed using Playwright and
Pytest to validate the major user workflows.

---

## 🚀 Key Features

### E-Commerce Application
- User registration
- User login and logout
- Product browsing
- Product search
- Category filtering
- Price sorting
- Shopping cart
- Add/remove products
- Cart quantity and total calculation
- Checkout workflow
- Required-field validation
- Order confirmation

### Backend
- FastAPI REST API
- PostgreSQL database
- Password hashing using bcrypt
- User registration and authentication
- API validation and error handling
- CORS configuration

### QA Automation
- Playwright end-to-end testing
- Pytest test framework
- Reusable Pytest fixtures
- Positive and negative test scenarios
- Functional testing
- Regression testing
- UI workflow validation
- Authentication testing
- Cart testing
- Checkout testing

---

## 🧪 Automated Test Coverage

The project contains **21 automated end-to-end test cases**.

| Module | Test Cases |
|---|---:|
| Authentication | 5 |
| Shopping Cart | 5 |
| Checkout | 5 |
| Products | 6 |
| **Total** | **21** |

### Authentication Tests
- Valid registration
- Duplicate registration
- Valid login
- Invalid login
- Logout

### Product Tests
- Products page loading
- Product search
- Category filtering
- Price sorting — low to high
- Price sorting — high to low
- Reset filters

### Cart Tests
- Add product to cart
- Add same product twice
- Cart displays selected product
- Remove product from cart
- Cart total calculation

### Checkout Tests
- Checkout page loading
- Checkout displays selected product
- Required-field validation
- Successful checkout
- Order total displayed

---

## 📊 Test Results

The complete regression suite currently passes:

**21 / 21 tests passed**

**Pass Rate: 100%**

Example:

```text
============================= test session starts =============================

tests/test_auth.py::test_valid_registration PASSED
tests/test_auth.py::test_duplicate_registration PASSED
tests/test_auth.py::test_valid_login PASSED
tests/test_auth.py::test_invalid_login PASSED
tests/test_auth.py::test_logout PASSED

tests/test_cart.py::test_add_product_to_cart PASSED
tests/test_cart.py::test_add_same_product_twice PASSED
tests/test_cart.py::test_cart_displays_product PASSED
tests/test_cart.py::test_remove_product_from_cart PASSED
tests/test_cart.py::test_cart_total_updates PASSED

tests/test_checkout.py::test_checkout_page_loads PASSED
tests/test_checkout.py::test_checkout_displays_product PASSED
tests/test_checkout.py::test_checkout_required_fields PASSED
tests/test_checkout.py::test_successful_checkout PASSED
tests/test_checkout.py::test_order_total_displayed PASSED

tests/test_products.py::test_products_page_loads PASSED
tests/test_products.py::test_search_products PASSED
tests/test_products.py::test_category_filter PASSED
tests/test_products.py::test_price_sort_low_to_high PASSED
tests/test_products.py::test_price_sort_high_to_low PASSED
tests/test_products.py::test_reset_filters PASSED

============================= 21 passed =============================
