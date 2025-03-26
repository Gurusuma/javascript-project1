document.addEventListener("DOMContentLoaded", () => {
    const openSidebar = document.getElementById("openSidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");
    const categoryList = document.getElementById("categoryList");

    openSidebar.addEventListener("click", () => {
        sidebar.classList.remove("hidden");
    });

    closeSidebar.addEventListener("click", () => {
        sidebar.classList.add("hidden");
    });

    // Fetch meal categories from API
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(response => response.json())
        .then(data => {
            data.categories.map(category => {
                const li = document.createElement("li");
                li.textContent = category.strCategory;
                categoryList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));
});
//catogories 
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
});

// Function to fetch categories from the API
function fetchCategories() {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(response => response.json())
        .then(data => {
            displayCategories(data.categories);
        })
        .catch(error => console.error("Error fetching categories:", error));
}

// Function to display categories dynamically
function displayCategories(categories) {
    const categoriesContainer = document.getElementById("categories");
    categoriesContainer.innerHTML = ""; 

    categories.forEach(category => {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category-card");
        categoryCard.innerHTML = `
            <h4>${category.strCategory}</h4>
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
        `;
        categoriesContainer.appendChild(categoryCard);
    });
}

