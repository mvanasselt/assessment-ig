"use strict";

const productListContainer = document.querySelector(".product-list");
const wishListHeader = document.getElementById("wishlist-header");
const sidePanel = document.getElementById("sidepanel");
const wishListContainer = document.getElementById("wishlist-container");
const sidePanelClose = document.getElementById("sidepanel-close");
const clearThisWishList = document.getElementById("clear-wishlist");

const renderProductPage = function (product) {
  const html = `
    <div class="product-tile" data-product-id="${product.productid}">
    <img class="product-image" src="${product.image}" alt="product image">
    <div class="product-info">
    <h3 class="product-name">${product.name}</h3>
    <div class="product-detail">
    <span class="product-description">${product.detail}</span>
    <span class="product-price">€ ${product.price},-</span>
    </div>
    <button class="add-to-wishlist" type="button">Add to wishlist</button>
        </div>
    `;
  productListContainer.insertAdjacentHTML("beforeend", html);
};

const renderProductWishlist = function (product) {
  const html = `
    <div class="product-tile" data-product-id="${product.productid}">
        <img class="product-image" src="${product.image}" alt="product image">
        <div class="counter">
        <button class="counter-minus" type="button">-</button>
        <input class="counter-display" type="text" value="1">
        <button class="counter-plus" type="button">+</button>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-detail">
        <span class="product-price">€ ${product.price},-</span>
        </div>
        <button class="add-to-wishlist" type="button">Remove from wishlist</button>
        </div>
    `;
  wishListContainer.insertAdjacentHTML("beforeend", html);
};

let productData = null;

const fetchProductData = async () => {
  if (productData === null) {
    const response = await fetch("products.json");
    const data = await response.json();
    productData = data.products;
  }
};

const products = async () => {
  await fetchProductData();

  productData.forEach((product) => {
    renderProductPage(product);
  });
};

const displayWishlist = async () => {
  await fetchProductData();

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishListContainer.innerHTML = "";
  wishlist.forEach((item) => {
    renderProductWishlist(item);
  });
};

products();

const addToWishList = function (product) {
  const wishList = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!localStorage.getItem("wishlist")) {
    localStorage.setItem("wishlist", JSON.stringify([]));
  }

  let isProductInWishList = wishList.some((item) => product.productid === item.productid);
  if (!isProductInWishList) {
    wishList.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishList));
    displayWishlist();
  }
};

const removeFromWishlist = function (product) {
  const wishList = JSON.parse(localStorage.getItem("wishlist"));
  const wishListIndex = wishList.findIndex((item) => item.productid === product.productid);
  wishList.splice(wishListIndex, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishList));
  displayWishlist();
};

const clearWishList = function () {
  localStorage.clear();
};

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

productListContainer.addEventListener("click", function (event) {
  const productTile = event.target.closest(".product-tile");
  const productName = productTile.querySelector(".product-name").textContent;
  if (event.target.classList.contains("add-to-wishlist")) {
    const productIndex = productData.findIndex((product) => productName === product.name);
    addToWishList(productData[productIndex]);
  }
});

wishListContainer.addEventListener("click", function (event) {
  const productTile = event.target.closest(".product-tile");
  const productName = productTile.querySelector(".product-name").textContent;
  if (event.target.classList.contains("add-to-wishlist")) {
    const productIndex = productData.findIndex((product) => productName === product.name);
    removeFromWishlist(productData[productIndex]);
  }
  productCounter(event.target);
});

wishListHeader.addEventListener("click", function () {
  sidePanel.classList.toggle("show");
  displayWishlist();
});

clearThisWishList.addEventListener("click", function () {
  clearWishList();
  displayWishlist();
});

sidePanelClose.addEventListener("click", function () {
  sidePanel.classList.remove("show");
});
