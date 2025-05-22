const dessertList = document.querySelector(".dessert-list");
const confirmSection = document.querySelector(".confirmation");

let desserts = [];
let carts = [];

fetch("data.json")
  .then((res) => res.json())
  .then((datas) => {
    desserts = datas.map((data) => ({ ...data, qty: 0 }));
    renderDesserts();
    renderCarts();
  });

function renderDesserts() {
  dessertList.innerHTML = "";

  desserts.forEach((data, index) => {
    const isInCart = data.qty > 0;
    const controls = isInCart
      ? `<div class="dessert-qty-controls btn-add-to-cart" data-index=${index}>
                    <button class="qty-decrease-btn" data-action="decrease">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="2"
                        fill="none"
                        viewBox="0 0 10 2"
                      >
                        <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
                      </svg>
                    </button>
                    <span class="qty-value">${data.qty}</span>
                    <button class="qty-increase-btn" data-action="increase">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        fill="none"
                        viewBox="0 0 10 10"
                      >
                        <path
                          fill="currentColor"
                          d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                        />
                      </svg>
                    </button>
                  </div>`
      : `<div class="dessert-add-btn btn-add-to-cart" data-action="add" data-index=${index}>
                    <span class="add-button-label">Add to Cart</span>
                  </div>`;

    dessertList.innerHTML += `
          <article class="dessert-item ${
            isInCart ? "active" : ""
          }" data-index="${index}">
            <div class="dessert-img-wrapper">
              <picture class="dessert-img">
                <source media="(min-width: 1024px)" srcset="${
                  data.image.desktop
                }">
                <source media="(min-width: 640px)" srcset="${
                  data.image.tablet
                }">
                <img src="${data.image.mobile}" alt="${
      data.category
    }" draggable="false">
              </picture>

              ${controls}
            </div>

            <div class="dessert-info">
              <p class="dessert-name">${data.category}</p>
              <p class="dessert-desc">${data.name}</p>
              <p class="dessert-price">$${data.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}</p>
            </div>
          </article>`;
  });

  setupButtons();
  renderCarts();
}

function setupButtons() {
  document.querySelectorAll("[data-action]").forEach((btn) => {
    const index = btn.closest("[data-index]")?.dataset.index;

    btn.addEventListener("click", () => {
      if (index === undefined) return;

      const dessert = desserts[index];

      switch (btn.dataset.action) {
        case "add":
          dessert.qty = 1;
          if (!carts.includes(dessert)) carts.push(dessert);
          break;

        case "increase":
          dessert.qty += 1;
          break;

        case "decrease":
          dessert.qty -= 1;
          if (dessert.qty <= 0) {
            dessert.qty = 0;
            carts = carts.filter((item) => item !== dessert);
          }
          break;
      }

      renderDesserts();
    });
  });
}

function renderCarts() {
  let cartFilledHTML = document.querySelector(".cart-details");
  let cartEmptyHTML = document.querySelector(".cart-empty");

  if (carts.length > 0) {
    cartEmptyHTML.innerHTML = "";
    cartEmptyHTML.style.display = "none";

    const cartItemsHTML = carts
      .map((item, index) => {
        const totalPrice = (item.qty * item.price).toFixed(2);

        return `<article class="cart-item" data-index=${index}>
              <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>

                <div class="cart-item-pricing">
                  <p class="cart-item-qty">${item.qty}x</p>
                  <p class="cart-item-unit-price">@ ${item.price.toFixed(2)}</p>
                  <p class="cart-item-total-price">$${totalPrice}</p>
                </div>
              </div>

              <button class="cart-remove-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                  <path fill="currentColor"
                    d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                </svg>
              </button>
            </article>`;
      })
      .join("");

    const totalAmount = carts.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    cartFilledHTML.innerHTML = `
          <div class="cart-items">
            ${cartItemsHTML}
          </div>

          <div class="cart-summary">
            <p class="cart-summary-label">Order Total</p>
            <h3 class="cart-summary-total">$${totalAmount.toFixed(2)}</h3>
          </div>

          <div class="cart-info">
            <p class="cart-info-msg">This is a <span>carbon-neutral</span> delivery</p>
          </div>

          <button class="cart-confirm-btn">Confirm Order</button>`;

    deleteItemCarts();
    showConfirmation();
  } else {
    cartFilledHTML.innerHTML = "";
    cartEmptyHTML.style.display = "flex";
    cartEmptyHTML.innerHTML = `<img src="assets/images/illustration-empty-cart.svg" alt="Empty Cart Illustration" draggable="false"
            class="cart-empty-img">
          <p class="cart-empty-msg">Your added items will appear here</p>`;
  }
}

function deleteItemCarts() {
  document.querySelectorAll(".cart-remove-button").forEach((btn) => {
    const index = btn.closest("[data-index]")?.dataset.index;

    btn.addEventListener("click", () => {
      carts[index].qty = 0;
      carts.splice(index, 1);

      renderDesserts();
      renderCarts();
    });
  });
}

function showConfirmation() {
  const cartConfirmBtn = document.querySelector(".cart-confirm-btn");

  cartConfirmBtn.addEventListener("click", () => {
    confirmSection.classList.add("open");
    renderConfirmationItem();
  });
}

function renderConfirmationItem() {
  const confirmItems = document.querySelector(".confirmation-items");
  const confirmTotalPrice = document.querySelector(".confirmation-total-price");

  if (carts.length > 0) {
    confirmItems.innerHTML = "";

    confirmItems.innerHTML = carts
      .map((item) => {
        const totalPrice = (item.qty * item.price).toFixed(2);

        return `<article class="confirmation-item">
                <img src="${item.image.thumbnail}" alt=${
          item.name
        } class="confirmation-item-thumb"
                  draggable="false">

                <div class="confirmation-item-info">
                  <p class="confirmation-item-name">${item.name}</p>
                  <div class="confirmation-item-qty-info">
                    <p class="confirmation-item-qty">${item.qty}x</p>
                    <p class="confirmation-item-unit-price">@ ${item.price.toFixed(
                      2
                    )}</p>
                  </div>
                </div>

                <p class="confirmation-item-price">$${totalPrice}</p>
              </article>`;
      })
      .join("");

    const totalAmount = carts.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    confirmTotalPrice.innerHTML = `$${totalAmount.toFixed(2)}`;
  }
}
