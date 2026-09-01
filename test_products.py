from playwright.sync_api import Page, expect


FRONTEND_URL = "http://127.0.0.1:5500/frontend/index.html"


def open_products(page: Page):
    page.goto(FRONTEND_URL)

    page.get_by_role("link", name="Products").click()

    expect(
        page.locator("#productsPage")
    ).to_have_class("page-section active")


def test_products_page_loads(page: Page):
    open_products(page)

    expect(
        page.locator("#productsGrid")
    ).to_be_visible()

    product_cards = page.locator(".product-card")

    expect(product_cards).to_have_count(10)


def test_search_products(page: Page):
    open_products(page)

    search = page.locator("#searchInput")

    search.fill("Headphones")

    expect(
        page.locator(".product-card")
    ).to_have_count(1)

    expect(
        page.locator(".product-name")
    ).to_contain_text(
        "Premium Wireless Headphones"
    )


def test_category_filter(page: Page):
    open_products(page)

    page.locator(
        'input[name="category"][value="Electronics"]'
    ).check()

    product_cards = page.locator(".product-card")

    expect(product_cards).to_have_count(4)


def test_price_sort_low_to_high(page: Page):
    open_products(page)

    page.locator("#sortSelect").select_option(
        "price-low"
    )

    prices = page.locator(".product-price")

    expect(
        prices.first
    ).to_contain_text("$34.99")


def test_price_sort_high_to_low(page: Page):
    open_products(page)

    page.locator("#sortSelect").select_option(
        "price-high"
    )

    prices = page.locator(".product-price")

    expect(
        prices.first
    ).to_contain_text("$899.99")


def test_reset_filters(page: Page):
    open_products(page)

    page.locator(
        'input[name="category"][value="Electronics"]'
    ).check()

    expect(
        page.locator(".product-card")
    ).to_have_count(4)

    page.locator(".reset-filters").click()

    expect(
        page.locator(".product-card")
    ).to_have_count(10)