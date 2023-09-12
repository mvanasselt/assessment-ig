"use strict";

const productListContainer = document.querySelector(".product-list");
const wishListHeader = document.getElementById("wishlist-header");
const sidePanel = document.getElementById("sidepanel");
const wishListContainer = document.getElementById("wishlist-container");
const sidePanelClose = document.getElementById("sidepanel-close");
const wishList = JSON.parse(localStorage.getItem("wishlist"));

const renderProductPage = function (product) {
  const html = `
    <div class="product-tile" data-product-id="${product.productid}">
        <img class="product-image" src="${product.image}" alt="product image">
        <button class="add-to-wishlist" type="button">Add to wishlist</button>
        <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-detail">
        <span class="product-description">${product.detail}</span>
        <span class="product-price">€ ${product.price},-</span>
        </div>
        </div>
    `;
  productListContainer.insertAdjacentHTML("beforeend", html);
};

const renderProductWishlist = function (product) {
  const html = `
    <div class="product-tile" data-product-id="${product.productid}">
        <img class="product-image" src="${product.image}" alt="product image">
        <button class="add-to-wishlist" type="button">Remove from wishlist</button>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-detail">
        <span class="product-price">€ ${product.price},-</span>
        </div>
        </div>
    `;
  wishListContainer.insertAdjacentHTML("beforeend", html);
};

const products = () =>
  fetch("products.json")
    .then((response) => response.json())
    .then(function (data) {
      for (let product of data.products) {
        renderProductPage(product);
      }
    });

products();

const addToWishList = function (product) {
  if (!localStorage.getItem("wishlist")) {
    localStorage.setItem("wishlist", JSON.stringify([]));
  }

  if (!wishList.includes(product)) {
    wishList.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }
};

const removeFromWishlist = function (product) {
  const wishListIndex = wishList.indexOf(product);
  wishList.splice(wishListIndex, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishList));
  displayWishlist();
};

const displayWishlist = function () {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishListContainer.innerHTML = "";
  wishlist.forEach((item) => {
    fetch("products.json")
      .then((response) => response.json())
      .then(function (data) {
        const dataArray = Array.from(data.products);
        const productIndex = dataArray.findIndex((product) => product.name === item);
        renderProductWishlist(dataArray[productIndex]);
      });
  });
};

productListContainer.addEventListener("click", function (event) {
  const productTile = event.target.closest(".product-tile");
  const productName = productTile.querySelector(".product-name").textContent;

  if (event.target.classList.contains("add-to-wishlist")) {
    addToWishList(productName);
    displayWishlist();
  }
});

wishListContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-wishlist")) {
    const productTile = event.target.closest(".product-tile");
    const productName = productTile.querySelector(".product-name").textContent;

    removeFromWishlist(productName);
  }
});

wishListHeader.addEventListener("click", function () {
  sidePanel.classList.toggle("show");
  displayWishlist();
});

sidePanelClose.addEventListener("click", function () {
  sidePanel.classList.remove("show");
});

// const productCounter = function (clickedItem) {
//   const counterDisplayElem = clickedItem.parentElement.querySelector(".counter-display");
//   const counterMinus = clickedItem.parentElement.querySelector(".counter-minus");
//   let count = counterDisplayElem.value;

//   if (clickedItem.classList.contains("counter-plus")) {
//     count++;
//     counterDisplayElem.value = count;
//   } else if (clickedItem.classList.contains("counter-minus")) {
//     count--;
//     counterDisplayElem.value = count;
//   }
//   counterMinus.disabled = counterDisplayElem.value > 0 ? false : true;
// };
