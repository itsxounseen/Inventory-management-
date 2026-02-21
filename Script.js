let products = JSON.parse(localStorage.getItem("products")) || [];
let revenue = JSON.parse(localStorage.getItem("revenue")) || 0;
let profit = JSON.parse(localStorage.getItem("profit")) || 0;

function saveData(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("revenue", JSON.stringify(revenue));
localStorage.setItem("profit", JSON.stringify(profit));
}

function showSection(id,btn){
document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
document.getElementById(id).classList.add("active");

document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

render();
}

function openModal(){
document.getElementById("modal").style.display="flex";
}

function closeModal(){
document.getElementById("modal").style.display="none";
}

function addProduct(){
let name=document.getElementById("name").value;
let buy=+document.getElementById("buy").value;
let sell=+document.getElementById("sell").value;
let stock=+document.getElementById("stock").value;

if(!name) return;

products.push({
id:Date.now(),
name,
buy,
sell,
stock
});

saveData();
closeModal();
render();
}

function deleteProduct(id){
products=products.filter(p=>p.id!==id);
saveData();
render();
}

function recordSale(){
let id=document.getElementById("saleProduct").value;
let qty=+document.getElementById("saleQty").value;
let product=products.find(p=>p.id==id);

if(!product||qty<=0||product.stock<qty){
alert("Invalid sale");
return;
}

product.stock-=qty;

let saleRevenue=product.sell*qty;
let saleProfit=(product.sell-product.buy)*qty;

revenue+=saleRevenue;
profit+=saleProfit;

saveData();
render();
alert("Sale recorded");
}

function render(){

document.getElementById("totalProducts").innerText=products.length;
document.getElementById("lowStock").innerText=products.filter(p=>p.stock<5).length;
document.getElementById("todayRevenue").innerText="₹"+revenue;
document.getElementById("totalProfit").innerText="₹"+profit;

let list=document.getElementById("productList");
list.innerHTML="";
products.forEach(p=>{
list.innerHTML+=`
<div class="product-card">
<strong>${p.name}</strong><br>
<span class="small">Stock: ${p.stock}</span><br>
<span class="small">Buy: ₹${p.buy} | Sell: ₹${p.sell}</span><br>
<button onclick="deleteProduct(${p.id})" style="background:#ef4444;margin-top:8px">Delete</button>
</div>`;
});

let select=document.getElementById("saleProduct");
select.innerHTML="";
products.forEach(p=>{
select.innerHTML+=`<option value="${p.id}">${p.name}</option>`;
});

document.getElementById("reportRevenue").innerText="₹"+revenue;
document.getElementById("reportProfit").innerText="₹"+profit;
}

render();
