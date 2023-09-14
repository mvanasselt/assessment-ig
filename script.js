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
        <button class="counter-minus" type="button">-</button>
        <input class="counter-display" type="text" value="1">
        <button class="counter-plus" type="button">+</button>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-detail">
        <span class="product-price">€ ${product.price},-</span>
        </div>
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

  const dataArray = Array.from(productData);

  wishlist.forEach((item) => {
    const productIndex = dataArray.findIndex((product) => product.name === item);
    renderProductWishlist(dataArray[productIndex]);
  });
};

products();

// const products = () =>
//   fetch("products.json")
//     .then((response) => response.json())
//     .then(function (data) {
//       for (let product of data.products) {
//         renderProductPage(product);
//       }
//     });

// products();

// const displayWishlist = function () {
//   const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//   wishListContainer.innerHTML = "";
//   fetch("products.json")
//     .then((response) => response.json())
//     .then(function (data) {
//       const dataArray = Array.from(data.products);
//       dataArray.forEach((product) => (product.quantity = 0));
//       wishlist.forEach((item) => {
//         const productIndex = dataArray.findIndex((product) => product.name === item);
//         renderProductWishlist(dataArray[productIndex]);
//       });
//       console.log(dataArray);
//     });
// };

const addToWishList = function (product) {
  if (!localStorage.getItem("wishlist")) {
    localStorage.setItem("wishlist", JSON.stringify([]));
  }

  if (!wishList.includes(product)) {
    wishList.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishList));
    displayWishlist();
  }
};

const removeFromWishlist = function (product) {
  const wishListIndex = wishList.indexOf(product);
  wishList.splice(wishListIndex, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishList));
  displayWishlist();
};

localStorage.setItem("count", JSON.stringify(0));
let totalAmount = JSON.parse(localStorage.getItem("count"));
const productCounter = function (product) {
  const counterDisplayElem = product.parentElement.querySelector(".counter-display");
  const counterMinus = product.parentElement.querySelector(".counter-minus");
  let count = counterDisplayElem.value;
  if (product.classList.contains("counter-plus")) {
    count++;
    counterDisplayElem.value = count;
  } else if (product.classList.contains("counter-minus")) {
    count--;
    counterDisplayElem.value = count;
  }
  counterMinus.disabled = counterDisplayElem.value > 0 ? false : true;
};

productListContainer.addEventListener("click", function (event) {
  const productTile = event.target.closest(".product-tile");
  const productName = productTile.querySelector(".product-name").textContent;
  if (event.target.classList.contains("add-to-wishlist")) {
    addToWishList(productName);
  }
});

wishListContainer.addEventListener("click", function (event) {
  const productTile = event.target.closest(".product-tile");
  const productName = productTile.querySelector(".product-name").textContent;
  if (event.target.classList.contains("add-to-wishlist")) {
    removeFromWishlist(productName);
  }
  productCounter(event.target);
});

wishListHeader.addEventListener("click", function () {
  sidePanel.classList.toggle("show");
  displayWishlist();
});

sidePanelClose.addEventListener("click", function () {
  sidePanel.classList.remove("show");
});
