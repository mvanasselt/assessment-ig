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
        <span class="wishlist-icon"> ♡ </span>
        <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div>
          <button class="counter-minus no-active">-</button>
          <input class="counter-display value=0"></input>
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

productListContainer.addEventListener("click", function (event) {
  const clickedItem = event.target;
  const productTile = clickedItem.parentElement;
  const counterDisplayElem = productTile.querySelector(".counter-display");
  let count = counterDisplayElem.value;

  if (clickedItem.classList.contains("counter-plus")) {
    count++;
    counterDisplayElem.value = count;
  } else if (clickedItem.classList.contains("counter-minus")) {
    count--;
    counterDisplayElem.value = count;
  }

  if (clickedItem.classList.contains("wishlist-icon"))
    wishListContainer.appendChild(productTile.cloneNode(true));
});

wishListContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("wishlist-icon")) {
    event.target.parentElement.remove();
  }
});

wishListHeader.addEventListener("click", function () {
  sidePanel.classList.toggle("show");
});

sidePanelClose.addEventListener("click", function () {
  sidePanel.classList.remove("show");
});
