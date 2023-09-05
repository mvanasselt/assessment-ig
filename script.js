"use strict";

const productListContainer = document.querySelector(".product-list");
const wishListHeader = document.getElementById("wishlist-header");
const sidePanel = document.getElementById("sidepanel");
const wishListContainer = document.getElementById("wishlist-container");
const sidePanelClose = document.getElementById("sidepanel-close");

const renderProduct = function (product) {
  const html = `
    <div class="product-tile" data-product-id="${product.productid}">
        <img class="product-image" src="${product.image}" alt="product image">
        <img class="wishlist-icon" src="images/heart.svg" alt="wishlist-icon">
        <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div>
          <button class="counter-minus" disabled>-</button>
          <input class="counter-display" value=0 placeholder="0"></input>
          <button class="counter-plus">+</button>
        </div>
        <div class="product-detail">
        <span class="product-description">${product.detail}</span>
        <span class="product-price">€ ${product.price},-</span>
        </div>
        </div>
    `;
  productListContainer.insertAdjacentHTML("beforeend", html);
};

const products = () =>
  fetch("products.json")
    .then((response) => response.json())
    .then(function (data) {
      for (let product of data.products) {
        renderProduct(product);
      }
    });

products();

const productCounter = function (clickedItem) {
  const counterDisplayElem = clickedItem.parentElement.querySelector(".counter-display");
  const counterMinus = clickedItem.parentElement.querySelector(".counter-minus");
  let count = counterDisplayElem.value;

  if (clickedItem.classList.contains("counter-plus")) {
    count++;
    counterDisplayElem.value = count;
  } else if (clickedItem.classList.contains("counter-minus")) {
    count--;
    counterDisplayElem.value = count;
  }
  counterMinus.disabled = counterDisplayElem.value > 0 ? false : true;
};


const checkProductInWishlist = function (existingElements, productID) {
  for (const existingElement of existingElements) {
    let elementExists = existingElement.getAttribute("data-product-id") === productID ? true : false;
  }
};

const updateCounterWishlist = function (clickedItem, existingElements, productID) {
  for (const existingElement of existingElements) {
    if (existingElement.getAttribute("data-product-id") === productID) {
      const wishListCounter = existingElement.querySelector(".counter-display");
      const productCounter = clickedItem.parentElement.querySelector(".counter-display");
      wishListCounter.value = Number(wishListCounter.value) + Number(productCounter.value);
    }
  }
};

productListContainer.addEventListener("click", function (event) {
  const clickedItem = event.target;
  const productTile = clickedItem.parentElement;
  const productID = productTile.getAttribute("data-product-id");
  const existingElements = wishListContainer.querySelectorAll("[data-product-id]");
  const wishListIcon = clickedItem.parentElement.querySelector(".wishlist-icon")

  productCounter(clickedItem);
  checkProductInWishlist(existingElements, productID);

  if (clickedItem.classList.contains("wishlist-icon")) {
    wishListIcon.classList.add("clicked");
    if (!elementExists) {
      wishListContainer.appendChild(productTile.cloneNode(true));
    } else if (elementExists) {
      updateCounterWishlist(clickedItem, existingElements, productID);
    }
    productTile.querySelector(".counter-display").value = 0;
  }
});

wishListContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("wishlist-icon")) {
    event.target.parentElement.remove();
  }
  productCounter(event.target);
});

wishListHeader.addEventListener("click", function () {
  sidePanel.classList.toggle("show");
});

sidePanelClose.addEventListener("click", function () {
  sidePanel.classList.remove("show");
});
