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
    const mealDetailsContainer = document.getElementById("meal-details");

    let categoryDescriptions = {}; 

    openSidebar.addEventListener("click", () => sidebar.classList.remove("hidden"));
    closeSidebar.addEventListener("click", () => sidebar.classList.add("hidden"));

    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(category => {
                categoryDescriptions[category.strCategory] = category.strCategoryDescription;
                
                const li = document.createElement("li");
                li.textContent = category.strCategory;
                li.classList.add("sidebar-item");
                li.addEventListener("click", () => loadCategory(category.strCategory));
                categoryList.appendChild(li);

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

    function loadCategory(category) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                let description = categoryDescriptions[category] || "";
                categoriesSection.style.display = "none";
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

                let mealHtml = `<h2 class="meals-heading">MEALS</h2><div class="categories-grid">`;
                data.meals.forEach(meal => {
                    mealHtml += `
                        <div class="category-card" onclick="loadMealDetails(${meal.idMeal})">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <p>${meal.strMeal}</p>
                        </div>
                    `;
                });
                mealHtml += '</div>';

                searchResultsContainer.innerHTML = mealHtml;
                searchResultsContainer.style.display = "block"; 
                mealDetailsContainer.style.display = "none"; 
            })
            .catch(error => console.error("Error fetching meals:", error));
    }

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

        let mealHtml = `<h2 class="meals-heading">MEALS</h2><div class="categories-grid">`;
        meals.forEach(meal => {
            mealHtml += `
                <div class="category-card" onclick="loadMealDetails(${meal.idMeal})">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>${meal.strMeal}</p>
                </div>
            `;
        });
        mealHtml += '</div>';
        searchResultsContainer.innerHTML = mealHtml;
        searchResultsContainer.style.display = "block"; // Show search results
        mealDetailsContainer.style.display = "none"; // Hide meal details when searching again
    }
    window.loadMealDetails = function(mealId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                let ingredientsList = "";
                for (let i = 1; i <= 20; i++) {
                    if (meal[`strIngredient${i}`]) {
                        ingredientsList += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
                    }
                }

                // Hide search results and categories when showing meal details
                searchResultsContainer.style.display = "none";
                categoriesSection.style.display = "none";
                descriptionContainer.style.display = "none";
               

                mealDetailsContainer.innerHTML = `
                <h2 class="meals-heading">MEAL DETAILS</h2>
                <div class="meal-details">
                   
                    <!-- Image and Category/Area/Ingredients in side-by-side layout -->
                    <div class="meal-details-top">
                   
                        <div class="meal-image">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="meal-info">
                          <h2>${meal.strMeal}</h2>
                            <p><strong>Category:</strong> ${meal.strCategory}</p>
                            <p><strong>Source:</strong> ${meal.strSource}</p>
                            <p><strong>Tags:</strong><span> ${meal.strTags}<span></p>
                            <div>
                            <h3>Ingredients:</h3>
                            <ul>${ingredientsList}</ul>
                            </div>
                        </div>
                    </div>
                    <!-- Rest of the details remain the same -->
                    <h3>Instructions:</h3>
                     <ul class="instructions-list">
    ${meal.strInstructions
        .split(". ")
        .filter(step => step.trim() !== "")
        .map(step => `<li><span class="instruction-icon">✔</span> ${step.trim()}.</li>`)
        .join("")}
</ul>
                </div>
            `;
            mealDetailsContainer.style.display = "block"; 
            mealDetailsContainer.after(categoriesSection);
             categoriesSection.style.display = "block"; 
        })
        .catch(error => console.error("Error fetching meal details:", error));
};
    // Hide meal details when performing a new search
    searchButton.addEventListener("click", () => {
        mealDetailsContainer.style.display = "none"; 
        searchResultsContainer.style.display = "block"; 
        categoriesSection.style.display = "block"; 
    });

    // Hide meal details when selecting a new category
    categoryList.addEventListener("click", () => {
        mealDetailsContainer.style.display = "none"; 
        searchResultsContainer.style.display = "block"; 
        categoriesSection.style.display = "block"; 
    });
});

 










