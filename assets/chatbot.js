document.addEventListener("DOMContentLoaded", function () { 
    let chatbotForm = document.querySelector(".ai-buying-guide");
    let chatbotToggle = document.querySelector(".chatbot-toggle");
    let closeChatbot = document.querySelector(".close-chatbot");
    let categorySelect = document.getElementById("category-select");
    let budgetInput = document.getElementById("total-budget");
    let selectedCategoriesContainer = document.querySelector(".selected-categories");
    let percentageContainer = document.querySelector(".category-percentages");
    let amountContainer = document.querySelector(".calculated-amounts");
    let submitBtn = document.querySelector(".submit-btn");
    let selectedCategories = [];

    submitBtn.disabled = true;
    
    chatbotToggle.addEventListener("click", () => chatbotForm.classList.add("visible"));
    closeChatbot.addEventListener("click", () => chatbotForm.classList.remove("visible"));

    categorySelect.addEventListener("change", function () {
        let category = this.value;
        if (category && !selectedCategories.includes(category)) {
            selectedCategories.push(category);
            updateCategoryUI();
        }
    });

    function updateCategoryUI() {
        selectedCategoriesContainer.innerHTML = selectedCategories.map(category => 
            `<span class="category-tag">${category} 
                <span class="remove-category" data-value="${category}">✖</span>
            </span>`
        ).join('');
        
        document.querySelectorAll(".remove-category").forEach(icon => {
            icon.addEventListener("click", function () {
                let categoryToRemove = this.dataset.value;
                selectedCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
                updateCategoryUI();
                updateBudgetAllocation();
            });
        });
        updateBudgetAllocation();
    }
    
    budgetInput.addEventListener("input", updateBudgetAllocation);

    function updateBudgetAllocation() {
        let totalBudget = parseFloat(budgetInput.value) || 0;
        percentageContainer.innerHTML = "";
        amountContainer.innerHTML = "";

        if (totalBudget > 0 && selectedCategories.length > 0) {
            selectedCategories.forEach(category => {
                let input = document.createElement("input");
                input.type = "number";
                input.placeholder = `Enter % for ${category}`;
                input.classList.add("category-percentage-input");
                input.dataset.category = category;
                percentageContainer.appendChild(input);
            });

            document.querySelectorAll(".category-percentage-input").forEach(input => {
                input.addEventListener("input", function () {
                    let totalPercentage = [...document.querySelectorAll(".category-percentage-input")]
                        .reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
                    
                    if (totalPercentage > 100) {
                        alert("Total percentage cannot exceed 100%");
                        this.value = "";
                        return;
                    }
                    
                    amountContainer.innerHTML = selectedCategories.map(category => {
                        let percent = parseFloat(document.querySelector(`input[data-category='${category}']`).value) || 0;
                        let amount = (totalBudget * percent) / 100;
                        return amount > 0 ? `<p>${category}: ₹${amount.toFixed(2)}</p>` : "";
                    }).join('');
                    
                    checkFormCompletion();
                });
            });
        }
        checkFormCompletion();
    }

    function checkFormCompletion() {
        let country = document.getElementById("country-select").value;
        let state = document.getElementById("province-select").value;
        let budget = document.getElementById("total-budget").value;
        let percentagesFilled = [...document.querySelectorAll(".category-percentage-input")]
            .every(input => input.value.trim() !== "");
        
        submitBtn.disabled = !(country && state && budget && selectedCategories.length > 0 && percentagesFilled);
    }
    
    submitBtn.addEventListener("click", async function () {
        let country = document.getElementById("country-select").value;
        let state = document.getElementById("province-select").value;
        let budget = document.getElementById("total-budget").value;
        let categoryData = [];
    
        for (let category of selectedCategories) {
            let percentageInput = document.querySelector(`input[data-category='${category}']`);
            let percentage = percentageInput ? parseFloat(percentageInput.value) || 0 : 0;
            let allocatedAmount = (budget * percentage) / 100;
            
            let filteredProducts = await getFilteredProducts(category, allocatedAmount);
            if (filteredProducts.length === 0) {
                alert(`No products available in ${category} within ₹${allocatedAmount.toFixed(2)} budget.`);
                return;
            }
            
            categoryData.push({ category, percentage, allocatedAmount, filteredProducts });
        }
    
        localStorage.setItem("buyingGuideData", JSON.stringify({ country, state, budget, categoryData }));
        window.location.href = "/pages/product-selected-by-user/";
    });
    
    async function getFilteredProducts(category, budget) {
        try {
            let response = await fetch(`/collections/${category}/products.json?limit=250`);
            
            if (!response.ok) throw new Error(`Failed to fetch products. Status: ${response.status}`);
            
            let data = await response.json();
            let filteredProducts = data.products.filter(product => 
                product.variants.some(variant => parseFloat(variant.price) <= budget)
            );
            
            console.log(`Filtered products for ${category} within budget ₹${budget}:`, filteredProducts);
            return filteredProducts;
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            return [];
        }
    }
});
