#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
import datetime


# Create the timestamp
def date():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# Start the browser and login with standard_user
def login(user, password):
    print(date() + ' Starting the browser...')
    # --uncomment when running in Azure DevOps.
    options = ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(options=options)
    print(date() + ' Browser started successfully. Navigating to the demo page to login.')
    driver.get('https://www.saucedemo.com/')
    driver.find_element_by_css_selector("input[id='user-name']").send_keys(user)
    driver.find_element_by_css_selector("input[id='password']").send_keys(password)
    driver.find_element_by_id("login-button").click()

    # Check if login successful
    product_label = driver.find_element_by_css_selector("div[class='product_label']").text
    assert "Products" in product_label
    print(date() + " User " + user + " logged in successfully!")

    # Add 6 items to cart
    for i in range(5):
        element = "a[id='item_" + str(i) + "_title_link']" # Get the URL of the product
        driver.find_element_by_css_selector(element).click() # Click the URL
        driver.find_element_by_css_selector("button.btn_primary.btn_inventory").click() # Add the product to the cart
        product = driver.find_element_by_css_selector("div[class='inventory_details_name']").text # Get the name of the product from the page
        print(date() + " " + product + " added to shopping cart!") # Display message saying which product was added
        driver.find_element_by_css_selector("button.inventory_details_back_button").click() # Click the Back button

    # Remove 6 items from cart
    for i in range(5):
        element = "a[id='item_" + str(i) + "_title_link']"
        driver.find_element_by_css_selector(element).click()
        driver.find_element_by_css_selector("button.btn_secondary.btn_inventory").click()
        product = driver.find_element_by_css_selector("div[class='inventory_details_name']").text
        print(date() + " " + product + " removed from shopping cart!") # Display message saying which product was added
        driver.find_element_by_css_selector("button.inventory_details_back_button").click()


login('standard_user', 'secret_sauce')