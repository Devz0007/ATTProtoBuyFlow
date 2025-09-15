class GamifiedPlanBuilder {
    constructor() {
        this.numberOfLines = 1;
        this.budget = 100;
        this.dataUsage = 10;
        this.callMinutes = 500;
        this.textMessages = 'unlimited';
        this.userType = null;
        
        this.plans = {
            starter: { name: 'Unlimited Starter', price: 60, data: 'Unlimited*', features: ['Unlimited talk & text', '5GB hotspot', 'Basic security'] },
            extra: { name: 'Unlimited Extra', price: 65, data: '75GB', features: ['Unlimited talk & text', '30GB hotspot', 'Advanced security'] },
            premium: { name: 'Unlimited Premium', price: 85, data: 'Unlimited', features: ['Unlimited talk & text', '60GB hotspot', 'Premium security', 'HBO Max'] }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateRecommendation();
        this.updateLineConfigurator();
        this.addAnimations();
    }
    
    bindEvents() {
        // Lines slider
        const linesSlider = document.getElementById('linesSlider');
        if (linesSlider) {
            linesSlider.addEventListener('input', (e) => {
                this.numberOfLines = parseInt(e.target.value);
                this.updateLinesDisplay();
                this.updateSliderProgress(e.target);
                this.updateRecommendation();
                this.updateLineConfigurator();
            });
            // Initialize slider progress
            this.updateSliderProgress(linesSlider);
        }
        
        // Budget slider
        const budgetSlider = document.getElementById('budgetSlider');
        if (budgetSlider) {
            budgetSlider.addEventListener('input', (e) => {
                this.budget = parseInt(e.target.value);
                this.updateBudgetDisplay();
                this.updateSliderProgress(e.target);
                this.updateRecommendation();
            });
            // Initialize slider progress
            this.updateSliderProgress(budgetSlider);
        }
        
        // Data slider
        const dataSlider = document.getElementById('dataSlider');
        if (dataSlider) {
            dataSlider.addEventListener('input', (e) => {
                this.dataUsage = parseInt(e.target.value);
                this.updateDataDisplay();
                this.updateSliderProgress(e.target);
                this.updateRecommendation();
            });
            // Initialize slider progress
            this.updateSliderProgress(dataSlider);
        }
        
        // Call slider
        const callSlider = document.getElementById('callSlider');
        if (callSlider) {
            callSlider.addEventListener('input', (e) => {
                this.callMinutes = parseInt(e.target.value);
                this.updateCallDisplay();
                this.updateSliderProgress(e.target);
                this.updateRecommendation();
            });
            // Initialize slider progress
            this.updateSliderProgress(callSlider);
        }
        
        // Lines presets
        document.querySelectorAll('.lines-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lines = parseInt(e.currentTarget.dataset.lines);
                this.numberOfLines = lines;
                const linesSlider = document.getElementById('linesSlider');
                linesSlider.value = lines;
                this.updateSliderProgress(linesSlider);
                this.updateLinesDisplay();
                this.updateRecommendation();
                this.updateLineConfigurator();
                this.animateButton(e.currentTarget);
            });
        });
        
        // Budget presets
        document.querySelectorAll('.budget-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const budget = parseInt(e.currentTarget.dataset.budget);
                this.budget = budget;
                const budgetSlider = document.getElementById('budgetSlider');
                budgetSlider.value = budget;
                this.updateSliderProgress(budgetSlider);
                this.updateBudgetDisplay();
                this.updateRecommendation();
                this.animateButton(e.currentTarget);
            });
        });
        
        // Text options
        document.querySelectorAll('.text-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active state from all buttons
                document.querySelectorAll('.text-option').forEach(b => {
                    b.classList.remove('bg-att-blue', 'bg-opacity-20', 'border-att-blue');
                    b.classList.add('border-gray-300');
                });
                
                // Add active state to clicked button
                e.currentTarget.classList.add('bg-att-blue', 'bg-opacity-20', 'border-att-blue');
                e.currentTarget.classList.remove('border-gray-300');
                
                this.textMessages = e.currentTarget.dataset.text;
                this.updateTextDisplay();
                this.updateRecommendation();
                this.animateButton(e.currentTarget);
            });
        });
        
        // Quiz options
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active state from all quiz buttons
                document.querySelectorAll('.quiz-option').forEach(b => {
                    b.classList.remove('bg-opacity-20');
                });
                
                const type = e.currentTarget.dataset.type;
                this.userType = type;
                this.applyQuizPreset(type);
                this.animateButton(e.currentTarget);
                
                // Add active state
                e.currentTarget.classList.add('bg-opacity-20');
            });
        });
        
        // Alternative plans
        document.querySelectorAll('.alternative-plan').forEach(plan => {
            plan.addEventListener('click', (e) => {
                this.animateButton(e.currentTarget);
                // Add selection logic here
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
                this.animateButton(e.currentTarget);
            });
        });
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
    }
    
    updateLinesDisplay() {
        const display = document.getElementById('linesDisplay');
        if (display) {
            display.textContent = this.numberOfLines;
            this.animateValue(display);
        }
    }
    
    updateBudgetDisplay() {
        const display = document.getElementById('budgetDisplay');
        if (display) {
            display.textContent = `$${this.budget}`;
            this.animateValue(display);
        }
    }
    
    updateDataDisplay() {
        const display = document.getElementById('dataDisplay');
        if (display) {
            if (this.dataUsage >= 100) {
                display.textContent = 'Unlimited';
            } else {
                display.textContent = `${this.dataUsage} GB`;
            }
            this.animateValue(display);
        }
    }
    
    updateCallDisplay() {
        const display = document.getElementById('callDisplay');
        if (display) {
            if (this.callMinutes >= 2000) {
                display.textContent = 'Unlimited';
            } else {
                display.textContent = `${this.callMinutes} min`;
            }
            this.animateValue(display);
        }
    }
    
    updateTextDisplay() {
        const display = document.getElementById('textDisplay');
        if (display) {
            if (this.textMessages === 'unlimited') {
                display.textContent = 'Unlimited';
            } else {
                display.textContent = `${this.textMessages}/mo`;
            }
            this.animateValue(display);
        }
    }
    
    updateSliderProgress(slider) {
        const value = slider.value;
        const min = slider.min;
        const max = slider.max;
        const percentage = ((value - min) / (max - min)) * 100;
        
        slider.style.setProperty('--value', `${percentage}%`);
    }
    
    applyQuizPreset(type) {
        switch(type) {
            case 'student':
                this.numberOfLines = 1;
                this.budget = 75;
                this.dataUsage = 15;
                this.callMinutes = 300;
                break;
            case 'professional':
                this.numberOfLines = 1;
                this.budget = 150;
                this.dataUsage = 35;
                this.callMinutes = 800;
                break;
            case 'family':
                this.numberOfLines = 4;
                this.budget = 200;
                this.dataUsage = 50;
                this.callMinutes = 1200;
                break;
            case 'power':
                this.numberOfLines = 2;
                this.budget = 250;
                this.dataUsage = 100;
                this.callMinutes = 2000;
                break;
        }
        
        // Update sliders
        const linesSlider = document.getElementById('linesSlider');
        const budgetSlider = document.getElementById('budgetSlider');
        const dataSlider = document.getElementById('dataSlider');
        const callSlider = document.getElementById('callSlider');
        
        linesSlider.value = this.numberOfLines;
        budgetSlider.value = this.budget;
        dataSlider.value = this.dataUsage;
        callSlider.value = this.callMinutes;
        
        // Update slider progress
        this.updateSliderProgress(linesSlider);
        this.updateSliderProgress(budgetSlider);
        this.updateSliderProgress(dataSlider);
        this.updateSliderProgress(callSlider);
        
        // Update displays
        this.updateLinesDisplay();
        this.updateBudgetDisplay();
        this.updateDataDisplay();
        this.updateCallDisplay();
        this.updateRecommendation();
        this.updateLineConfigurator();
        
        // Add success animation
        this.showSuccessMessage(`Applied ${type} preset!`);
    }
    
    updateRecommendation() {
        const recommendedPlan = this.calculateBestPlan();
        const matchScore = this.calculateMatchScore(recommendedPlan);
        
        const card = document.getElementById('recommendationCard');
        if (card) {
            const plan = this.plans[recommendedPlan];
            const totalPrice = this.calculateTotalPrice(plan.price);
            const pricePerLine = this.numberOfLines > 1 ? ` ($${plan.price}/line)` : '';
            
            card.innerHTML = `
                <div class="bg-gradient-to-r from-att-blue to-att-blue-dark rounded-xl p-4 transform transition-all duration-500 text-white">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold text-lg">${plan.name}</h4>
                            <p class="text-sm opacity-90">Perfect for ${this.numberOfLines} line${this.numberOfLines > 1 ? 's' : ''}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold">$${totalPrice}</div>
                            <div class="text-sm opacity-90">/month${pricePerLine}</div>
                        </div>
                    </div>
                    <div class="space-y-2 text-sm">
                        ${plan.features.map(feature => `
                            <div class="flex items-center gap-2">
                                <span class="text-white">✓</span>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="text-center">
                    <div class="text-sm text-gray-600 mb-2">Match Score</div>
                    <div class="flex items-center justify-center gap-1">
                        ${this.generateMatchStars(matchScore)}
                    </div>
                    <div class="text-sm text-att-blue font-semibold">${matchScore}% Match</div>
                </div>

                <button class="w-full bg-gradient-to-r from-att-blue to-att-blue-dark py-3 rounded-lg font-semibold text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300" onclick="planBuilder.selectPlan('${recommendedPlan}')">
                    Select This Plan
                </button>
            `;
            
            // Animate the card update
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    calculateTotalPrice(pricePerLine) {
        // Apply multi-line discounts
        let totalPrice = pricePerLine * this.numberOfLines;
        if (this.numberOfLines >= 4) {
            totalPrice = totalPrice * 0.85; // 15% discount for 4+ lines
        } else if (this.numberOfLines >= 2) {
            totalPrice = totalPrice * 0.90; // 10% discount for 2-3 lines
        }
        return Math.round(totalPrice);
    }
    
    calculateBestPlan() {
        const totalBudget = this.budget * this.numberOfLines;
        
        // Simple logic based on total budget and usage
        if (totalBudget <= 70 * this.numberOfLines || this.userType === 'student') {
            return 'starter';
        } else if (totalBudget <= 120 * this.numberOfLines || this.dataUsage <= 30) {
            return 'extra';
        } else {
            return 'premium';
        }
    }
    
    calculateMatchScore(planKey) {
        const plan = this.plans[planKey];
        const totalPrice = this.calculateTotalPrice(plan.price);
        const totalBudget = this.budget * this.numberOfLines;
        let score = 70; // Base score
        
        // Budget match
        if (totalPrice <= totalBudget) {
            score += 15;
        } else {
            score -= Math.min(20, (totalPrice - totalBudget) / 10);
        }
        
        // Usage match
        if (this.dataUsage >= 50 && planKey === 'premium') score += 10;
        if (this.dataUsage <= 20 && planKey === 'starter') score += 10;
        if (this.dataUsage > 20 && this.dataUsage < 50 && planKey === 'extra') score += 15;
        
        // User type bonus
        if (this.userType === 'power' && planKey === 'premium') score += 10;
        if (this.userType === 'student' && planKey === 'starter') score += 10;
        
        return Math.min(95, Math.max(45, score));
    }
    
    generateMatchStars(score) {
        const stars = Math.floor(score / 20);
        let html = '';
        for (let i = 0; i < 5; i++) {
            if (i < stars) {
                html += '<span class="text-att-blue text-2xl">●</span>';
            } else {
                html += '<span class="text-gray-400 text-2xl">●</span>';
            }
        }
        return html;
    }
    
    selectPlan(planKey) {
        const plan = this.plans[planKey];
        const totalPrice = this.calculateTotalPrice(plan.price);
        const lineText = this.numberOfLines > 1 ? ` for ${this.numberOfLines} lines` : '';
        this.showSuccessMessage(`Great choice! ${plan.name} selected for $${totalPrice}/month${lineText}`);
        
        // Add celebration animation
        this.celebrateSelection();
        
        // Could redirect to checkout or next step
        setTimeout(() => {
            // window.location.href = 'checkout.html';
        }, 2000);
    }
    
    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('absolute', 'inset-0', 'bg-white', 'bg-opacity-20', 'rounded-lg', 'animate-ping');
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    animateValue(element) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#0073e7';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }
    
    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-att-blue to-att-blue-dark text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(full)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    celebrateSelection() {
        // Add confetti-like animation
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#0073e7', '#005bb5', '#ff6900', '#5a5a5a'][Math.floor(Math.random() * 4)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    toggleDarkMode() {
        // This would toggle between dark and light themes
        document.body.classList.toggle('light-mode');
        this.showSuccessMessage('Theme toggled!');
    }
    
    addAnimations() {
        // Add CSS for falling confetti
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    updateLineConfigurator() {
        const section = document.getElementById('lineConfiguratorSection');
        const container = document.getElementById('lineConfigurationsContainer');
        
        if (!section || !container) return;
        
        // Show/hide configurator based on number of lines
        if (this.numberOfLines > 1) {
            section.style.display = 'block';
            this.generateLineConfigurations();
        } else {
            section.style.display = 'none';
        }
    }
    
    generateLineConfigurations() {
        const container = document.getElementById('lineConfigurationsContainer');
        if (!container) return;
        
        // Clear existing configurations
        container.innerHTML = '';
        
        // Generate configurations for each line
        for (let i = 1; i <= this.numberOfLines; i++) {
            const lineConfig = this.createLineConfiguration(i);
            container.appendChild(lineConfig);
        }
    }
    
    createLineConfiguration(lineNumber) {
        const isPrimary = lineNumber === 1;
        const recommendedPlan = this.calculateBestPlan();
        const plan = this.plans[recommendedPlan];
        
        const lineConfig = document.createElement('div');
        lineConfig.className = 'border border-att-blue rounded-xl overflow-hidden bg-att-light-gray';
        lineConfig.dataset.line = lineNumber;
        
        lineConfig.innerHTML = `
            <div class="line-header bg-white p-4 border-b border-att-blue cursor-pointer hover:bg-att-light-gray transition-colors" onclick="this.parentElement.querySelector('.line-content').classList.toggle('hidden')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">📱</span>
                        <div>
                            <h3 class="font-semibold text-gray-900">Line ${lineNumber}${isPrimary ? ' (Primary)' : ''}</h3>
                            <p class="text-sm text-gray-600">${plan.name}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-att-blue">iPhone 15 Pro</p>
                        <p class="text-sm text-gray-600">$${plan.price}/mo</p>
                    </div>
                    <button class="text-att-blue hover:text-att-blue-dark">
                        <svg class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="line-content p-6 space-y-6 hidden">
                <!-- Device Options -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Device Option</h4>
                    <div class="flex gap-4">
                        <label class="flex-1 flex items-center gap-2 p-3 border border-att-blue bg-white rounded-lg cursor-pointer">
                            <input type="radio" name="device-line${lineNumber}" value="new" checked class="text-att-blue">
                            <span class="text-sm font-medium">Get new device</span>
                        </label>
                        <label class="flex-1 flex items-center gap-2 p-3 border border-gray-300 bg-white rounded-lg cursor-pointer hover:border-att-blue">
                            <input type="radio" name="device-line${lineNumber}" value="bring" class="text-att-blue">
                            <span class="text-sm font-medium">Bring your own</span>
                        </label>
                    </div>
                </div>

                <!-- Device Selection -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Device</h4>
                    <div class="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div class="w-12 h-12 bg-att-blue rounded-lg flex items-center justify-center text-white text-lg">📱</div>
                        <div class="flex-1">
                            <p class="font-semibold">iPhone 15 Pro</p>
                            <p class="text-sm text-gray-600">128GB, Natural Titanium • $33.33/mo</p>
                        </div>
                        <button class="px-4 py-2 text-att-blue border border-att-blue rounded-lg hover:bg-att-blue hover:text-white transition-colors">
                            Change
                        </button>
                    </div>
                </div>

                <!-- Plan -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Plan</h4>
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div>
                            <p class="font-semibold">${plan.name}</p>
                            <p class="text-sm text-gray-600">Unlimited data, 5G access</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-lg font-bold text-att-blue">$${plan.price}/mo</span>
                            <button class="px-4 py-2 text-att-blue border border-att-blue rounded-lg hover:bg-att-blue hover:text-white transition-colors">
                                Change
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Add-ons -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Add-ons</h4>
                    <div class="space-y-2">
                        <label class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div class="flex items-center gap-3">
                                <input type="checkbox" ${isPrimary ? 'checked' : ''} class="text-att-blue">
                                <span class="font-medium">Device Protection</span>
                            </div>
                            <span class="font-semibold text-att-blue">$15/mo</span>
                        </label>
                        <label class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div class="flex items-center gap-3">
                                <input type="checkbox" class="text-att-blue">
                                <span class="font-medium">Mobile Hotspot Extra</span>
                            </div>
                            <span class="font-semibold text-att-blue">$10/mo</span>
                        </label>
                        <label class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div class="flex items-center gap-3">
                                <input type="checkbox" class="text-att-blue">
                                <span class="font-medium">International Calling</span>
                            </div>
                            <span class="font-semibold text-att-blue">$5/mo</span>
                        </label>
                    </div>
                </div>

                <!-- Line Actions -->
                <div class="flex gap-3 pt-4 border-t border-gray-200">
                    <button class="flex-1 px-4 py-2 text-att-blue border border-att-blue rounded-lg hover:bg-att-blue hover:text-white transition-colors">
                        Duplicate Line
                    </button>
                    ${!isPrimary ? '<button class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">Remove Line</button>' : ''}
                </div>
            </div>
        `;
        
        return lineConfig;
    }
    
    handleQuickAction(action) {
        switch(action) {
            case 'copy-line-1':
                this.copyLine1Settings();
                break;
            case 'all-byod':
                this.makeAllLinesByod();
                break;
            case 'same-plan':
                this.applySamePlanToAll();
                break;
        }
    }
    
    copyLine1Settings() {
        this.showSuccessMessage('Line 1 settings copied to all lines!');
        // Logic to copy settings would go here
    }
    
    makeAllLinesByod() {
        const byodRadios = document.querySelectorAll('input[value="bring"]');
        byodRadios.forEach(radio => {
            radio.checked = true;
        });
        this.showSuccessMessage('All lines set to bring your own device!');
    }
    
    applySamePlanToAll() {
        this.showSuccessMessage('Same plan applied to all lines!');
        // Logic to apply same plan would go here
    }
}

// Initialize the gamified plan builder
document.addEventListener('DOMContentLoaded', () => {
    window.planBuilder = new GamifiedPlanBuilder();
    console.log('Gamified Plan Builder initialized!');
});
