window.addEventListener("DOMContentLoaded", function(){

let productData = JSON.parse(localStorage.getItem("inventory_products")) || [];
let salesHistory = JSON.parse(localStorage.getItem("inventory_sales")) || [];

let editId = null;
let deleteId = null;
let selected = null;
let qty = 1;

/* ---------- SAVE ---------- */
function save(){
localStorage.setItem("inventory_products", JSON.stringify(productData));
localStorage.setItem("inventory_sales", JSON.stringify(salesHistory));
}

/* ---------- NAVIGATION ---------- */
window.showSection = function(id,btn){
document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
document.getElementById(id).classList.add("active");
document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
render();
};

/* ---------- OPEN ADD MODAL ---------- */
document.getElementById("fabBtn").addEventListener("click", function(){
editId = null;
document.getElementById("modalTitle").innerText="Add Product";
document.getElementById("name").value="";
document.getElementById("buy").value="";
document.getElementById("sell").value="";
document.getElementById("stock").value="";
document.getElementById("productModal").style.display="flex";
});

/* ---------- CLOSE MODALS ---------- */
window.closeProductModal = function(){
document.getElementById("productModal").style.display="none";
};

window.closeDeleteModal = function(){
document.getElementById("deleteModal").style.display="none";
};

/* ---------- SAVE PRODUCT (FIXED) ---------- */
document.getElementById("saveBtn").addEventListener("click", function(){

let name = document.getElementById("name").value.trim();
let buy = +document.getElementById("buy").value;
let sell = +document.getElementById("sell").value;
let stock = +document.getElementById("stock").value;

if(!name) return;

if(editId){
let p = productData.find(x=>x.id===editId);
if(p){
p.name=name;
p.buy=buy;
p.sell=sell;
p.stock=stock;
}
}else{
productData.push({
id:Date.now(),
name,
buy,
sell,
stock
});
}

save();
closeProductModal();
render();
});

/* ---------- DELETE ---------- */
document.getElementById("confirmDeleteBtn").addEventListener("click", function(){
productData = productData.filter(p=>p.id!==deleteId);
save();
closeDeleteModal();
render();
});

window.openDelete=function(id){
deleteId=id;
document.getElementById("deleteModal").style.display="flex";
};

window.openEdit=function(id){
let p = productData.find(x=>x.id===id);
if(!p) return;
editId=id;
document.getElementById("modalTitle").innerText="Edit Product";
document.getElementById("name").value=p.name;
document.getElementById("buy").value=p.buy;
document.getElementById("sell").value=p.sell;
document.getElementById("stock").value=p.stock;
document.getElementById("productModal").style.display="flex";
};

/* ---------- RENDER (FIXED VARIABLE CONFLICT) ---------- */
function render(){

document.getElementById("totalProducts").innerText = productData.length;
document.getElementById("lowStock").innerText = productData.filter(p=>p.stock<20).length;

let container = document.getElementById("products");

container.innerHTML = productData.map(p=>{
let lowClass = p.stock<20 ? "stock-low" : "";
return `
<div class="product-card">
<div class="product-header">
<strong>📦 ${p.name}</strong>
<div class="icon-group">
<button class="icon-btn" onclick="openEdit(${p.id})">✏️</button>
<button class="icon-btn" onclick="openDelete(${p.id})">🗑</button>
</div>
</div>
Buy ₹${p.buy} | Sell ₹${p.sell}
<div class="stock-badge ${lowClass}">Stock: ${p.stock}</div>
</div>
`;
}).join("");

}

render();

});
