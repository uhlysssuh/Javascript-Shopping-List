//selectors
const addButtonEl = document.querySelector("#add-button");
const emptyListMsg = document.querySelector("#empty-list");
const inputFieldEl = document.querySelector("#input-field");
const clearListButton = document.querySelector("#clear-button");
const toastContainer = document.querySelector("#toast-container");
let shoppingListEl = document.querySelector("#shopping-list");

let isPageReload = false;

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  if (inputValue !== "") {
    addItemToShoppingList(inputValue); // Add item to shopping list
    clearInputField();
  }
});

// Load initial shopping list from localStorage
loadShoppingList();

function loadShoppingList() {
  isPageReload = true;
  const shoppingListFromLocalStorage = localStorage.getItem("shoppingList");
  if (shoppingListFromLocalStorage) {
    let itemsArr = JSON.parse(shoppingListFromLocalStorage);
    clearAddToShoppingList();

    if (itemsArr.length > 0) {
      for (let i = 0; i < itemsArr.length; i++) {
        let currentItem = itemsArr[i].value; // Access the value property of the item object
        addItemToShoppingList(currentItem);
      }
    }
  }

  isPageReload = false;
  clearInputField(); // Clear the input field on page load
  updateEmptyListState();
}

function clearAddToShoppingList() {
  shoppingListEl.innerHTML = "";
  updateEmptyListState();
  localStorage.removeItem("shoppingList");
}

function clearInputField() {
  inputFieldEl.value = "";
}

//Add item to shopping list
function addItemToShoppingList(itemValue) {
  let itemId = Date.now().toString(); // Generate a unique ID for the item

  let item = {
    id: itemId,
    value: itemValue,
  };

  let itemsArr = [];

  if (localStorage.getItem("shoppingList")) {
    itemsArr = JSON.parse(localStorage.getItem("shoppingList"));
  }

  // Check if the item already exists in the shopping list
  const existingItem = itemsArr.some(
    (existingItem) => existingItem.value === itemValue
  );

  if (existingItem) {
    showToast("Item already exists!", true); // Display a toast message indicating the item already exists
    return; // Exit the function to avoid adding the item again
  }

  itemsArr.push(item);
  localStorage.setItem("shoppingList", JSON.stringify(itemsArr));

  clearInputField(); // Clear the input field

  if (!isPageReload) {
    showToast("Item added successfully");
  }

  createItemElement(item);
  updateEmptyListState(); // Update the empty list state
}

//Display the shopping list
function createItemElement(item) {
  let itemEl = document.createElement("li");
  itemEl.textContent = item.value;
  itemEl.classList.add("transition"); // Add transition class for smooth effect

  itemEl.addEventListener("dblclick", function () {
    removeItemFromShoppingList(item.id);
    itemEl.remove();
    showToast("Item removed successfully!");
    updateEmptyListState(); // Update the empty list state
  });

  // Add fade-in animation when adding item
  setTimeout(() => {
    itemEl.classList.add("fadeIn");
  }, 0); // Add the fade-in class immediately after creating the element

  shoppingListEl.append(itemEl);
}

//Remove item from the shopping list
function removeItemFromShoppingList(itemId) {
  let itemsArr = [];

  if (localStorage.getItem("shoppingList")) {
    itemsArr = JSON.parse(localStorage.getItem("shoppingList"));
  }

  itemsArr = itemsArr.filter((item) => item.id !== itemId);
  localStorage.setItem("shoppingList", JSON.stringify(itemsArr));
  // Update the empty list state
  updateEmptyListState();
}

// show toast message
function showToast(message, isError = false) {
  //Array.from() search for an existing toast message with the same content
  const existingToast = Array.from(toastContainer.children).find(
    (toast) => toast.textContent === message
  );
  if (existingToast) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${isError ? " error" : ""}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      toast.remove();
    }, 300); // Remove the toast from the DOM after the animation duration
  }, 500); // Delay the toast display to ensure smooth animation
}

// mark an item as bought
function markItemAsBought(itemEl) {
  if (!itemEl.classList.contains("bought")) {
    itemEl.classList.add("bought");
  }
}

// Event listener for clicking on an item
shoppingListEl.addEventListener("click", function (event) {
  const clickedItem = event.target;

  if (clickedItem.tagName === "LI") {
    markItemAsBought(clickedItem);
  }
});

// Update the empty list state
function updateEmptyListState() {
  const shoppingListFromLocalStorage = localStorage.getItem("shoppingList");
  const itemsArr = shoppingListFromLocalStorage
    ? JSON.parse(shoppingListFromLocalStorage)
    : null;

  if (itemsArr?.length > 0) {
    emptyListMsg.style.display = "none";
  } else {
    emptyListMsg.style.display = "block";
  }
}

clearListButton.addEventListener("click", function () {
  localStorage.removeItem("shoppingList");
  clearAddToShoppingList();
  showToast("Cart cleared successfully!");
  updateEmptyListState();
});
