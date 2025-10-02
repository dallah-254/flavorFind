class RecipeFinder {
    constructor() {
        this.currentPage = 'home';
        this.currentRecipes = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.showPage('home');
    }

    bindEvents() {
        // Navigation
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar());
        
        // Page navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.showPage(page);
                this.toggleSidebar(false);
            });
        });

        // CTA buttons
        document.querySelectorAll('[data-page]').forEach(button => {
            if (button.classList.contains('nav-item')) return;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = button.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Search form
        document.getElementById('ingredient-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchRecipes();
        });

        // Popular ingredient tags
        document.querySelectorAll('.ingredient-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.addIngredient(tag.getAttribute('data-ingredient'));
            });
        });

        // Back to results
        document.getElementById('backToResults').addEventListener('click', () => {
            this.showPage('results');
        });
    }

    toggleSidebar(show) {
        const sidebar = document.getElementById('sidebar');
        if (show !== undefined) {
            sidebar.classList.toggle('active', show);
        } else {
            sidebar.classList.toggle('active');
        }
    }

    showPage(pageName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageName) {
                item.classList.add('active');
            }
        });

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    addIngredient(ingredient) {
        const input = document.getElementById('ingredients-input');
        const currentIngredients = input.value.split(',').map(i => i.trim()).filter(i => i);
        
        if (!currentIngredients.includes(ingredient)) {
            if (currentIngredients.length > 0) {
                input.value = [...currentIngredients, ingredient].join(', ');
            } else {
                input.value = ingredient;
            }
        }
        
        input.focus();
    }

    async searchRecipes() {
        const ingredientsInput = document.getElementById('ingredients-input');
        const ingredients = ingredientsInput.value.trim();
        
        if (!ingredients) {
            alert('Please enter at least one ingredient');
            return;
        }

        this.showLoading(true);
        this.showPage('results');

        try {
            const response = await fetch(`/api/recipes?ingredients=${encodeURIComponent(ingredients)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const recipes = await response.json();
            this.displayRecipes(recipes);
            
            // Update results subtitle
            document.getElementById('results-subtitle').textContent = 
                `Based on: ${ingredients}`;
                
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.showError('Failed to fetch recipes. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displayRecipes(recipes) {
        const container = document.getElementById('recipes-container');
        const noResults = document.getElementById('no-results');
        
        if (!recipes || recipes.length === 0) {
            container.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        this.currentRecipes = recipes;

        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" onclick="recipeFinder.showRecipeDetails(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes || 'N/A'} min</span>
                        <span><i class="fas fa-check-circle"></i> ${recipe.usedIngredientCount || 0} ingredients</span>
                    </div>
                    ${this.renderUsedIngredients(recipe.usedIngredients)}
                    ${this.renderMissingIngredients(recipe.missedIngredients)}
                </div>
            </div>
        `).join('');
    }

    renderUsedIngredients(ingredients) {
        if (!ingredients || ingredients.length === 0) return '';
        
        return `
            <div class="used-ingredients">
                <h4>Used Ingredients</h4>
                <div class="ingredient-list">
                    ${ingredients.slice(0, 3).map(ing => 
                        `<span class="ingredient-badge">${ing.name}</span>`
                    ).join('')}
                    ${ingredients.length > 3 ? `<span class="ingredient-badge">+${ingredients.length - 3} more</span>` : ''}
                </div>
            </div>
        `;
    }

    renderMissingIngredients(ingredients) {
        if (!ingredients || ingredients.length === 0) return '';
        
        return `
            <div class="missing-ingredients">
                <h4>Missing Ingredients</h4>
                <div class="ingredient-list">
                    ${ingredients.slice(0, 3).map(ing => 
                        `<span class="ingredient-badge" style="background: var(--primary-orange);">${ing.name}</span>`
                    ).join('')}
                    ${ingredients.length > 3 ? `<span class="ingredient-badge" style="background: var(--primary-orange);">+${ingredients.length - 3} more</span>` : ''}
                </div>
            </div>
        `;
    }

    async showRecipeDetails(recipeId) {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/recipes/${recipeId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const recipe = await response.json();
            this.displayRecipeDetails(recipe);
            this.showPage('details');
            
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            this.showError('Failed to fetch recipe details. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displayRecipeDetails(recipe) {
        const container = document.getElementById('recipe-details');
        
        container.innerHTML = `
            <div class="recipe-detail-card">
                <div class="detail-header">
                    <img src="${recipe.image}" alt="${recipe.title}" class="detail-image" onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
                    <div class="detail-overlay">
                        <h1 class="detail-title">${recipe.title}</h1>
                        <div class="detail-meta">
                            <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes || 'N/A'} minutes</span>
                            <span><i class="fas fa-utensils"></i> ${recipe.servings || 'N/A'} servings</span>
                            ${recipe.diets && recipe.diets.length > 0 ? 
                                `<span><i class="fas fa-leaf"></i> ${recipe.diets.join(', ')}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="detail-content">
                    ${recipe.summary ? `
                        <div class="detail-section">
                            <h3>About this recipe</h3>
                            <div>${this.cleanSummary(recipe.summary)}</div>
                        </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h3>Ingredients</h3>
                        <div class="ingredients-grid">
                            ${recipe.extendedIngredients ? recipe.extendedIngredients.map(ingredient => `
                                <div class="ingredient-item">
                                    <i class="fas fa-check-circle" style="color: var(--green-accent);"></i>
                                    <span>${ingredient.original}</span>
                                </div>
                            `).join('') : '<p>No ingredient information available.</p>'}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Instructions</h3>
                        ${recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? `
                            <ol class="instructions-list">
                                ${recipe.analyzedInstructions[0].steps.map(step => `
                                    <li class="instruction-step">
                                        <div class="step-number">${step.number}</div>
                                        <div class="step-text">${step.step}</div>
                                    </li>
                                `).join('')}
                            </ol>
                        ` : recipe.instructions ? `
                            <div>${this.cleanInstructions(recipe.instructions)}</div>
                        ` : '<p>No instructions available.</p>'}
                    </div>
                    
                    ${recipe.sourceUrl ? `
                        <div class="detail-section">
                            <a href="${recipe.sourceUrl}" target="_blank" rel="noopener" class="source-link">
                                <i class="fas fa-external-link-alt"></i>
                                View Original Recipe
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    cleanSummary(html) {
        // Remove HTML tags and limit length
        const text = html.replace(/<[^>]*>/g, '');
        return text.length > 300 ? text.substring(0, 300) + '...' : text;
    }

    cleanInstructions(html) {
        // Basic HTML cleaning for instructions
        return html.replace(/<[^>]*>/g, '').replace(/\n/g, '<br>');
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showError(message) {
        alert(message); // In a real app, you'd want a better error display
    }
}

// Initialize the application
const recipeFinder = new RecipeFinder();