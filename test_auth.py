from playwright.sync_api import sync_playwright
import uuid


# =============================================
# TEST CONFIGURATION
# =============================================


FRONTEND_URL = "http://127.0.0.1:5500/frontend/index.html"

TEST_EMAIL = "sandhya123@gmail.com"
TEST_PASSWORD = "test123"


# =============================================
# VALID REGISTRATION
# =============================================

def test_valid_registration():
    """Verify that a new user can successfully register."""

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(FRONTEND_URL)

        # Open registration modal
        page.locator("#registerBtn").click()

        # Generate a unique email so the test can run repeatedly
        unique_email = (
            f"test_{uuid.uuid4().hex[:8]}@example.com"
        )

        # Fill registration form
        page.locator("#registerName").fill("QA Test User")
        page.locator("#registerEmail").fill(unique_email)
        page.locator("#registerPassword").fill(TEST_PASSWORD)

        # Submit registration
        page.locator("#submitRegister").click()

        # Wait for backend response
        page.wait_for_timeout(1000)

        # Verify successful registration
        success_message = page.locator("#registerSuccess")

        assert success_message.is_visible()
        assert "successful" in success_message.inner_text().lower()

        browser.close()


# =============================================
# DUPLICATE REGISTRATION
# =============================================

def test_duplicate_registration():
    """Verify that an existing email cannot be registered again."""

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(FRONTEND_URL)

        # Open registration modal
        page.locator("#registerBtn").click()

        # Use existing registered account
        page.locator("#registerName").fill("Existing User")
        page.locator("#registerEmail").fill(TEST_EMAIL)
        page.locator("#registerPassword").fill(TEST_PASSWORD)

        # Submit registration
        page.locator("#submitRegister").click()

        # Wait for backend response
        page.wait_for_timeout(1000)

        # Verify registration was rejected
        error_message = page.locator("#registerError")

        assert error_message.is_visible()
        assert "already registered" in error_message.inner_text().lower()

        browser.close()


# =============================================
# VALID LOGIN
# =============================================

def test_valid_login():
    """Verify that a registered user can successfully log in."""

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(FRONTEND_URL)

        # Open login modal
        page.locator("#loginBtn").click()

        # Enter valid credentials
        page.locator("#loginEmail").fill(TEST_EMAIL)
        page.locator("#loginPassword").fill(TEST_PASSWORD)

        # Submit login
        page.locator("#submitLogin").click()

        # Wait for backend response
        page.wait_for_timeout(1000)

        # Verify user is logged in
        auth_section = page.locator("#authSection")

        assert "Hi," in auth_section.inner_text()

        browser.close()


# =============================================
# INVALID LOGIN
# =============================================

def test_invalid_login():
    """Verify that invalid credentials are rejected."""

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(FRONTEND_URL)

        # Open login modal
        page.locator("#loginBtn").click()

        # Enter incorrect credentials
        page.locator("#loginEmail").fill("wrong@example.com")
        page.locator("#loginPassword").fill("WrongPassword123")

        # Submit login
        page.locator("#submitLogin").click()

        # Wait for backend response
        page.wait_for_timeout(1000)

        # Verify error message
        error_message = page.locator("#loginError")

        assert error_message.is_visible()
        assert "invalid" in error_message.inner_text().lower()

        browser.close()


# =============================================
# LOGOUT
# =============================================

def test_logout():
    """Verify that a logged-in user can successfully log out."""

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(FRONTEND_URL)

        # Open login modal
        page.locator("#loginBtn").click()

        # Login with valid credentials
        page.locator("#loginEmail").fill(TEST_EMAIL)
        page.locator("#loginPassword").fill(TEST_PASSWORD)

        page.locator("#submitLogin").click()

        # Wait for login
        page.wait_for_timeout(1000)

        # Verify login succeeded
        assert "Hi," in page.locator("#authSection").inner_text()

        # Open user dropdown
        page.locator("#userButton").click()

        # Click logout
        page.locator("#logoutBtn").click()

        # Wait for UI update
        page.wait_for_timeout(500)

        # Verify Login button is visible again
        assert page.locator("#loginBtn").is_visible()

        browser.close()