document.addEventListener("DOMContentLoaded", function () {

let products = JSON.parse(localStorage.getItem("inventory_products")) || [];
let sales = JSON.parse(localStorage.getItem("inventory_sales")) || [];

let editId = null;
let deleteId = null;

/* ---------- SAVE ---------- */
function saveData() {
    localStorage.setItem("inventory_products", JSON.stringify(products));
    localStorage.setItem("inventory_sales", JSON.stringify(sales));
}

/* ---------- OPEN ADD MODAL ---------- */
const fabBtn = document.getElementById("fabBtn");
if (fabBtn) {
    fabBtn.addEventListener("click", function () {
        editId = null;
        document.getElementById("modalTitle").innerText = "Add Product";
        document.getElementById("name").value = "";
        document.getElementById("buy").value = "";
        document.getElementById("sell").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("productModal").style.display = "flex";
    });
}

/* ---------- CLOSE MODALS ---------- */
window.closeProductModal = function () {
    document.getElementById("productModal").style.display = "none";
};

window.closeDeleteModal = function () {
    document.getElementById("deleteModal").style.display = "none";
};

/* ---------- SAVE PRODUCT ---------- */
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", function () {

        const name = document.getElementById("name").value.trim();
        const buy = parseFloat(document.getElementById("buy").value) || 0;
        const sell = parseFloat(document.getElementById("sell").value) || 0;
        const stock = parseInt(document.getElementById("stock").value) || 0;

        if (!name) return;

        if (editId) {
            let product = products.find(p => p.id === editId);
            if (product) {
                product.name = name;
                product.buy = buy;
                product.sell = sell;
                product.stock = stock;
            }
        } else {
            products.push({
                id: Date.now(),
                name,
                buy,
                sell,
                stock
            });
        }

        saveData();
        closeProductModal();
        render();
    });
}

/* ---------- EDIT ---------- */
window.openEdit = function (id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editId = id;

    document.getElementById("modalTitle").innerText = "Edit Product";
    document.getElementById("name").value = product.name;
    document.getElementById("buy").value = product.buy;
    document.getElementById("sell").value = product.sell;
    document.getElementById("stock").value = product.stock;

    document.getElementById("productModal").style.display = "flex";
};

/* ---------- DELETE ---------- */
window.openDelete = function (id) {
    deleteId = id;
    document.getElementById("deleteModal").style.display = "flex";
};

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", function () {
        products = products.filter(p => p.id !== deleteId);
        saveData();
        closeDeleteModal();
        render();
    });
}

/* ---------- RENDER ---------- */
function render() {

    const list = document.getElementById("products");
    if (!list) return;

    list.innerHTML = "";

    products.forEach(p => {
        const stockClass = p.stock < 20 ? "stock-low" : "";

        list.innerHTML += `
        <div class="product-card">
            <div class="product-header">
                <strong>📦 ${p.name}</strong>
                <div class="icon-group">
                    <button class="icon-btn" onclick="openEdit(${p.id})">✏️</button>
                    <button class="icon-btn" onclick="openDelete(${p.id})">🗑</button>
                </div>
            </div>
            Buy ₹${p.buy} | Sell ₹${p.sell}
            <div class="stock-badge ${stockClass}">
                Stock: ${p.stock}
            </div>
        </div>
        `;
    });

    const totalEl = document.getElementById("totalProducts");
    const lowEl = document.getElementById("lowStock");

    if (totalEl) totalEl.innerText = products.length;
    if (lowEl) lowEl.innerText = products.filter(p => p.stock < 20).length;
}

/* ---------- INIT ---------- */
render();

});
