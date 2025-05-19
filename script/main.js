const dessertList = document.querySelector(".dessert-list");

let desserts = [];
let carts = [];

fetch("data.json")
  .then((res) => res.json())
  .then((datas) => {
    desserts = datas.map((data) => ({ ...data, qty: 0 }));
    renderDesserts();
  });

function renderDesserts() {
  dessertList.innerHTML = "";

  desserts.forEach((data, index) => {
    const controls =
      data.qty === 0
        ? `<div class="dessert-add-btn btn-add-to-cart" data-action="add" data-index=${index}>
                    <span class="add-button-label">Add to Cart</span>
                  </div>`
        : `<div class="dessert-qty-controls btn-add-to-cart" data-index=${index}>
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
                  </div>`;

    dessertList.innerHTML += `
          <article class="dessert-item" data-index="${index}">
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
}

function setupButtons() {
  const addButtons = document.querySelectorAll("[data-action='add']");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      desserts[index].qty = 1;
      carts = [...desserts[index]];
      console.log(carts);
      renderDesserts();
    });
  });

  const incButtons = document.querySelectorAll("[data-action='increase']");
  incButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.closest("[data-index]").dataset.index;
      desserts[index].qty += 1;
      renderDesserts();
    });
  });

  const decButtons = document.querySelectorAll("[data-action='decrease']");
  decButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.closest("[data-index]").dataset.index;
      desserts[index].qty -= 1;
      if (desserts[index].qty < 1) {
        desserts[index].qty = 0;
      }
      renderDesserts();
    });
  });
}
