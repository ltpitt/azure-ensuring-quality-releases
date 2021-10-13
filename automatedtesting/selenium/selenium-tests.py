#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By


def login(user, password):
    options = ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(options=options)
    driver.get('https://www.saucedemo.com/')
    driver.find_element_by_css_selector("input[id='user-name']").send_keys(user)
    driver.find_element_by_css_selector("input[id='password']").send_keys(password)
    driver.find_element_by_id("login-button").click()

    product_label = driver.find_element(By.XPATH, '//*[@id="header_container"]/div[2]/span').get_attribute('innerHTML')
    assert "Products" in product_label
    print("User " + user + " logged in successfully!")
    product_list = driver.find_elements_by_class_name("inventory_item")

    for product in product_list:
        inventory_item_text = product.find_elements_by_class_name("inventory_item_name")[0].get_attribute('innerHTML')
        print("Object added to the cart: " + inventory_item_text)
        product.find_elements_by_class_name("btn")[0].click()

    for product in product_list:
        inventory_item_text = product.find_elements_by_class_name("inventory_item_name")[0].get_attribute('innerHTML')
        print("Object removed from the cart: " + inventory_item_text)
        product.find_elements_by_class_name("btn")[0].click()


login('standard_user', 'secret_sauce')
