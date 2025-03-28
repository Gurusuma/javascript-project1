document.addEventListener("DOMContentLoaded", () => {
    const mealFinderHeading = document.getElementById("mealFinderHeading");
    const header = document.querySelector(".header");
    const openSidebar = document.getElementById("openSidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");
    const categoryList = document.getElementById("categoryList");
    const categoriesContainer = document.getElementById("categories");
    const categoriesSection = document.getElementById("categories-section");
    const descriptionContainer = document.getElementById("category-description");
    const searchInput = document.querySelector(".search-container input");
    const searchButton = document.querySelector(".search-container button");
    const searchResultsContainer = document.getElementById("search-results"); 

    let categoryDescriptions = {}; // Store category descriptions dynamically

    // Open sidebar
    openSidebar.addEventListener("click", () => sidebar.classList.remove("hidden"));

    // Close sidebar
    closeSidebar.addEventListener("click", () => sidebar.classList.add("hidden"));

    // Fetch and display categories
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(category => {
                categoryDescriptions[category.strCategory] = category.strCategoryDescription; // Store descriptions

                // Sidebar List
                const li = document.createElement("li");
                li.textContent = category.strCategory;
                li.classList.add("sidebar-item"); // Styling
                li.addEventListener("click", () => loadCategory(category.strCategory));
                categoryList.appendChild(li);

                // Main Categories Section
                const categoryCard = document.createElement("div");
                categoryCard.classList.add("category-card");
                categoryCard.innerHTML = `
                    <h4>${category.strCategory}</h4>
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                `;
                categoryCard.addEventListener("click", () => loadCategory(category.strCategory));
                categoriesContainer.appendChild(categoryCard);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));

    // Function to load meals based on category
    function loadCategory(category) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                let description = categoryDescriptions[category] || "";
    
                categoriesSection.style.display = "none";
    
                // Show description only if available
                if (description.trim() !== "") {
                    descriptionContainer.innerHTML = `
                        <div class="category-description">
                            <h2>${category}</h2>
                            <p>${description}</p>
                        </div>
                    `;
                    descriptionContainer.style.display = "block";
                } else {
                    descriptionContainer.style.display = "none";
                }
    
                // Display meals
                let mealHtml = `<h2 class="meals-heading">MEALS</h2><div class="categories-grid">`;
                data.meals.forEach(meal => {
                    mealHtml += `
                        <div class="category-card">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <p>${meal.strMeal}</p>
                        </div>
                    `;
                });
                mealHtml += '</div>';
    
                searchResultsContainer.innerHTML = mealHtml;
            })
            .catch(error => console.error("Error fetching meals:", error));
    }
    


    // Search functionality
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
        descriptionContainer.innerHTML = "";
        descriptionContainer.style.display = "none"; 
        if (!meals) {
            searchResultsContainer.innerHTML = "<h2>No meals found</h2>";
            return;
        }

        let mealHtml = `
            <h2 class="meals-heading">MEALS</h2>
            <div class="categories-grid">
        `;
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

        searchResultsContainer.innerHTML = mealHtml;
    }
});

function showHomePage() {
    categoriesSection.style.display = "block"; 
    searchResultsContainer.innerHTML = ""; 
    descriptionContainer.innerHTML = ""; 
}

// Click event for heading
mealFinderHeading.addEventListener("click", showHomePage);
header.addEventListener("click", showHomePage);
  