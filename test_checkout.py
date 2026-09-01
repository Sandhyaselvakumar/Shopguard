from playwright.sync_api import Page, expect


FRONTEND_URL = "http://127.0.0.1:5500/frontend/index.html"


def add_product_and_open_checkout(page: Page):
    page.goto(FRONTEND_URL)

    page.get_by_role("link", name="Products").click()

    page.locator(".product-card").first.locator(
        ".add-to-cart-btn"
    ).click()

    page.locator("#cartIcon").click()

    page.locator("#checkoutBtn").click()

    expect(page.locator("#checkoutPage")).to_have_class(
        "page-section active"
    )


def fill_checkout_form(page: Page):
    page.locator("#fullName").fill("Sandhya Test")

    page.locator("#email").fill(
        "sandhya123@gmail.com"
    )

    page.locator("#phone").fill(
        "9876543210"
    )

    page.locator("#address").fill(
        "123 Test Street"
    )

    page.locator("#city").fill(
        "Coimbatore"
    )

    page.locator("#postalCode").fill(
        "641001"
    )


def test_checkout_page_loads(page: Page):
    add_product_and_open_checkout(page)

    expect(
        page.locator("#checkoutItems")
    ).to_be_visible()

    expect(
        page.locator("#checkoutGrandTotal")
    ).not_to_have_text("$0.00")


def test_checkout_displays_product(page: Page):
    add_product_and_open_checkout(page)

    expect(
        page.locator(".checkout-item")
    ).to_have_count(1)


def test_checkout_required_fields(page: Page):
    add_product_and_open_checkout(page)

    page.locator("#placeOrderBtn").click()

    expect(
        page.locator("#checkoutPage")
    ).to_have_class("page-section active")


def test_successful_checkout(page: Page):
    add_product_and_open_checkout(page)

    fill_checkout_form(page)

    page.locator("#placeOrderBtn").click()

    expect(
        page.locator("#confirmationPage")
    ).to_have_class("page-section active")

    expect(
        page.locator("#orderId")
    ).to_contain_text("#SG-")


def test_order_total_displayed(page: Page):
    add_product_and_open_checkout(page)

    fill_checkout_form(page)

    page.locator("#placeOrderBtn").click()

    expect(
        page.locator("#orderTotal")
    ).not_to_have_text("$0.00")