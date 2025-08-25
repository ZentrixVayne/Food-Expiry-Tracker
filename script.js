const itemForm = document.getElementById("itemForm");
const itemList = document.getElementById("itemList");
const totalItems = document.getElementById("totalItems");
const expiringSoon = document.getElementById("expiringSoon");
const expired = document.getElementById("expired");
const safeItems = document.getElementById("safeItems");
const darkToggle = document.getElementById("darkToggle");

const suggestionsPanel = document.getElementById("suggestionsPanel");
const suggestionText = document.getElementById("suggestionText");
const closePanel = document.getElementById("closePanel");

let items = JSON.parse(localStorage.getItem("items")) || [];

// Recipe suggestions
const recipes = {
  milk: ["🥞 Pancakes", "🥤 Milkshake", "🍮 Custard"],
  bread: ["🍞 French Toast", "🍕 Bread Pizza", "🍮 Bread Pudding"],
  eggs: ["🍳 Omelette", "🥗 Egg Salad", "🥚 Deviled Eggs"],
  chicken: ["🍗 Grilled Chicken", "🍛 Chicken Curry", "🌯 Chicken Wrap"],
  rice: ["🍚 Fried Rice", "🍮 Rice Pudding", "🍲 Biryani"],
  default: ["🥤 Smoothie", "🥗 Salad", "🥪 Sandwich"]
};

// Dark mode toggle
darkToggle.addEventListener("click", () => document.body.classList.toggle("dark"));

// Add item
itemForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const expiry = document.getElementById("expiryDate").value;
  if(!name || !expiry) return;
  items.push({ name, expiry });
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
  itemForm.reset();
});

// Render items
function renderItems() {
  itemList.innerHTML = "";
  let total = items.length, soon=0, expiredCount=0, safe=0;
  const today = new Date();

  items.forEach((item,index)=>{
    const li = document.createElement("li");
    const expiryDate = new Date(item.expiry);
    const diffDays = Math.ceil((expiryDate - today)/(1000*60*60*24));
    li.textContent = `${item.name} - Expires: ${item.expiry}`;

    if(diffDays<0){ li.classList.add("expired"); expiredCount++; li.innerHTML += ` <button onclick="showSuggestions('${item.name}')">💡 Use Expired?</button>`; }
    else if(diffDays<=5){ li.classList.add("soon"); soon++; li.innerHTML += ` <button onclick="showSuggestions('${item.name}')">💡 Suggest Recipe</button>`; }
    else{ safe++; }

    li.innerHTML += ` <button onclick="deleteItem(${index})">❌ Delete</button>`;
    itemList.appendChild(li);
  });

  totalItems.textContent = `Total Items: ${total}`;
  expiringSoon.textContent = `Expiring Soon: ${soon}`;
  expired.textContent = `Expired: ${expiredCount}`;
  safeItems.textContent = `Safe Items: ${safe}`;
}

// Show suggestion panel
function showSuggestions(itemName){
  const key = Object.keys(recipes).find(r=>itemName.toLowerCase().includes(r));
  const ideas = recipes[key] || recipes.default;
  suggestionText.textContent = `You can make: ${ideas.join(", ")}`;
  suggestionsPanel.classList.add("show");
}

// Close panel
closePanel.addEventListener("click", ()=> suggestionsPanel.classList.remove("show"));

// Delete item
function deleteItem(index){ items.splice(index,1); localStorage.setItem("items", JSON.stringify(items)); renderItems(); }

renderItems();
