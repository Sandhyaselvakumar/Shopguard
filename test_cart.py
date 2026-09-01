from playwright.sync_api import Page, expect


FRONTEND_URL = "http://127.0.0.1:5500/frontend/index.html"


def open_products(page: Page):
    page.goto(FRONTEND_URL)
    page.get_by_role("link", name="Products").click()

    expect(page.locator("#productsPage")).to_have_class(
        "page-section active"
    )


def test_add_product_to_cart(page: Page):
    open_products(page)

    first_product = page.locator(".product-card").first

    first_product.locator(".add-to-cart-btn").click()

    expect(page.locator("#cartCount")).to_have_text("1")


def test_add_same_product_twice(page: Page):
    open_products(page)

    first_product = page.locator(".product-card").first

    first_product.locator(".add-to-cart-btn").click()
    first_product.locator(".add-to-cart-btn").click()

    expect(page.locator("#cartCount")).to_have_text("2")


def test_cart_displays_product(page: Page):
    open_products(page)

    first_product = page.locator(".product-card").first

    product_name = first_product.locator(
        ".product-name"
    ).inner_text()

    first_product.locator(".add-to-cart-btn").click()

    page.locator("#cartIcon").click()

    expect(page.locator("#cartModal")).to_have_class(
        "modal active"
    )

    expect(
        page.locator(".cart-item-name")
    ).to_contain_text(product_name)


def test_remove_product_from_cart(page: Page):
    open_products(page)

    page.locator(".product-card").first.locator(
        ".add-to-cart-btn"
    ).click()

    page.locator("#cartIcon").click()

    expect(page.locator("#cartCount")).to_have_text("1")

    page.locator(".remove-item").click()

    expect(page.locator("#cartCount")).to_have_text("0")

    expect(
        page.locator(".empty-cart-message")
    ).to_be_visible()


def test_cart_total_updates(page: Page):
    open_products(page)

    page.locator(".product-card").first.locator(
        ".add-to-cart-btn"
    ).click()

    page.locator("#cartIcon").click()

    expect(
        page.locator("#subtotal")
    ).not_to_have_text("$0.00")

    expect(
        page.locator("#cartTotal")
    ).not_to_have_text("$0.00")