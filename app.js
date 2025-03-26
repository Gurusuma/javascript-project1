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
//search bar functionality

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-container input");
    const searchButton = document.querySelector(".search-container button");
    const categoriesContainer = document.getElementById("categories-section");
    
    searchButton.addEventListener("click", async () => {
        const foodName = searchInput.value.trim();
        if (foodName === "") return;

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`);
            const data = await response.json();
            displayMeals(data.meals);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    function displayMeals(meals) {
        if (!meals) {
            categoriesContainer.innerHTML = "<h2>No meals found</h2>";
            return;
        }
        
        let mealHtml = '<h2>MEALS</h2><div class="categories-grid">';
        meals.forEach(meal => {
            mealHtml += `
                <div class="category-card">
                    <h4>${meal.strCategory || "Unknown"}</h4>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p><strong>${meal.strArea || ""}</strong></p>
                    <p>${meal.strMeal}</p>
                </div>
            `;
        });
        mealHtml += '</div>';
        
        categoriesContainer.innerHTML = mealHtml;
    }
});


