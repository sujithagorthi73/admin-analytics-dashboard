
let productsState = { all: [] };

function loadProducts() {
  productsState.all = DB.load("products", SEED_PRODUCTS);
}
function saveProducts() {
  DB.save("products", productsState.all);
}

function getFilteredProducts() {
  const term = qs("#product-search").value.trim().toLowerCase();
  const category = qs("#product-category-filter").value;
  return productsState.all.filter(p => {
    const matchesTerm = !term || p.name.toLowerCase().includes(term);
    const matchesCategory = !category || p.category === category;
    return matchesTerm && matchesCategory;
  });
}

/** Renders the product card grid based on current search/filter state */
function renderProductsGrid() {
  const filtered = getFilteredProducts();
  const grid = qs("#products-grid");
  const emptyState = qs("#products-empty");

  if (!filtered.length) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  grid.innerHTML = filtered.map(p => `
    <div class="card product-card">
      <div class="thumb">${p.icon || "🛍️"}</div>
      <div class="body">
        <span class="cat">${p.category}</span>
        <span class="name">${p.name}</span>
        <div class="price-row">
          <span class="price">${formatCurrency(p.price)}</span>
          <span class="stock">${p.stock > 0 ? p.stock + " in stock" : "Out of stock"}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-ghost btn-sm btn-block" data-edit-product="${p.id}">Edit</button>
        <button class="btn btn-danger btn-sm btn-block" data-delete-product="${p.id}">Delete</button>
      </div>
    </div>
  `).join("");

  qsa("[data-edit-product]").forEach(btn => btn.addEventListener("click", () => openProductModal(Number(btn.dataset.editProduct))));
  qsa("[data-delete-product]").forEach(btn => btn.addEventListener("click", () => openDeleteProductModal(Number(btn.dataset.deleteProduct))));
}

function openProductModal(productId) {
  const isEdit = typeof productId === "number";
  qs("#product-modal-title").textContent = isEdit ? "Edit Product" : "Add Product";
  const p = isEdit ? productsState.all.find(x => x.id === productId) : null;

  qs("#product-id").value = isEdit ? p.id : "";
  qs("#product-name").value = isEdit ? p.name : "";
  qs("#product-category").value = isEdit ? p.category : "Electronics";
  qs("#product-price").value = isEdit ? p.price : "";
  qs("#product-stock").value = isEdit ? p.stock : "";
  qs("#product-icon").value = isEdit ? p.icon : "🛍️";

  openModal("product-modal");
}

let productPendingDeleteId = null;
function openDeleteProductModal(productId) {
  const p = productsState.all.find(x => x.id === productId);
  productPendingDeleteId = productId;
  qs("#delete-product-name").textContent = p.name;
  openModal("delete-product-modal");
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = qs("#product-id").value;
  const payload = {
    name: qs("#product-name").value.trim(),
    category: qs("#product-category").value,
    price: parseFloat(qs("#product-price").value),
    stock: parseInt(qs("#product-stock").value, 10),
    icon: qs("#product-icon").value.trim() || "🛍️",
  };

  if (id) {
    Object.assign(productsState.all.find(p => p.id === Number(id)), payload);
    showToast("Product updated successfully");
  } else {
    const newId = Math.max(0, ...productsState.all.map(p => p.id)) + 1;
    productsState.all.unshift({ id: newId, ...payload });
    showToast("Product added successfully");
  }

  saveProducts();
  closeModal("product-modal");
  renderProductsGrid();
}

function handleConfirmDeleteProduct() {
  productsState.all = productsState.all.filter(p => p.id !== productPendingDeleteId);
  saveProducts();
  closeModal("delete-product-modal");
  showToast("Product deleted", "danger");
  renderProductsGrid();
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  loadProducts();
  renderProductsGrid();

  qs("#product-search").addEventListener("input", debounce(renderProductsGrid, 200));
  qs("#product-category-filter").addEventListener("change", renderProductsGrid);
  qs("#btn-add-product").addEventListener("click", () => openProductModal());
  qs("#product-form").addEventListener("submit", handleProductFormSubmit);
  qs("#confirm-delete-product").addEventListener("click", handleConfirmDeleteProduct);
  bindModalDismiss();
});
