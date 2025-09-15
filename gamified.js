class GamifiedPlanBuilder {
    constructor() {
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
        this.addAnimations();
    }
    
    bindEvents() {
        // Budget slider
        const budgetSlider = document.getElementById('budgetSlider');
        if (budgetSlider) {
            budgetSlider.addEventListener('input', (e) => {
                this.budget = parseInt(e.target.value);
                this.updateBudgetDisplay();
                this.updateRecommendation();
            });
        }
        
        // Data slider
        const dataSlider = document.getElementById('dataSlider');
        if (dataSlider) {
            dataSlider.addEventListener('input', (e) => {
                this.dataUsage = parseInt(e.target.value);
                this.updateDataDisplay();
                this.updateRecommendation();
            });
        }
        
        // Call slider
        const callSlider = document.getElementById('callSlider');
        if (callSlider) {
            callSlider.addEventListener('input', (e) => {
                this.callMinutes = parseInt(e.target.value);
                this.updateCallDisplay();
                this.updateRecommendation();
            });
        }
        
        // Budget presets
        document.querySelectorAll('.budget-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const budget = parseInt(e.currentTarget.dataset.budget);
                this.budget = budget;
                document.getElementById('budgetSlider').value = budget;
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
                    b.classList.remove('bg-gaming-pink', 'bg-opacity-20', 'border-gaming-pink');
                    b.classList.add('border-gray-600');
                });
                
                // Add active state to clicked button
                e.currentTarget.classList.add('bg-gaming-pink', 'bg-opacity-20', 'border-gaming-pink');
                e.currentTarget.classList.remove('border-gray-600');
                
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
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
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
    
    applyQuizPreset(type) {
        switch(type) {
            case 'student':
                this.budget = 75;
                this.dataUsage = 15;
                this.callMinutes = 300;
                break;
            case 'professional':
                this.budget = 150;
                this.dataUsage = 35;
                this.callMinutes = 800;
                break;
            case 'family':
                this.budget = 200;
                this.dataUsage = 50;
                this.callMinutes = 1200;
                break;
            case 'power':
                this.budget = 250;
                this.dataUsage = 100;
                this.callMinutes = 2000;
                break;
        }
        
        // Update sliders
        document.getElementById('budgetSlider').value = this.budget;
        document.getElementById('dataSlider').value = this.dataUsage;
        document.getElementById('callSlider').value = this.callMinutes;
        
        // Update displays
        this.updateBudgetDisplay();
        this.updateDataDisplay();
        this.updateCallDisplay();
        this.updateRecommendation();
        
        // Add success animation
        this.showSuccessMessage(`Applied ${type} preset!`);
    }
    
    updateRecommendation() {
        const recommendedPlan = this.calculateBestPlan();
        const matchScore = this.calculateMatchScore(recommendedPlan);
        
        const card = document.getElementById('recommendationCard');
        if (card) {
            const plan = this.plans[recommendedPlan];
            
            card.innerHTML = `
                <div class="bg-gradient-to-r from-att-blue to-att-blue-dark rounded-xl p-4 transform transition-all duration-500 text-white">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold text-lg">${plan.name}</h4>
                            <p class="text-sm opacity-90">Perfect for your usage</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold">$${plan.price}</div>
                            <div class="text-sm opacity-90">/month</div>
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
    
    calculateBestPlan() {
        // Simple logic based on budget and usage
        if (this.budget <= 70 || this.userType === 'student') {
            return 'starter';
        } else if (this.budget <= 120 || this.dataUsage <= 30) {
            return 'extra';
        } else {
            return 'premium';
        }
    }
    
    calculateMatchScore(planKey) {
        const plan = this.plans[planKey];
        let score = 70; // Base score
        
        // Budget match
        if (plan.price <= this.budget) {
            score += 15;
        } else {
            score -= Math.min(20, (plan.price - this.budget) * 2);
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
        this.showSuccessMessage(`Great choice! ${plan.name} selected for $${plan.price}/month`);
        
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
        element.style.color = '#06b6d4';
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
}

// Initialize the gamified plan builder
document.addEventListener('DOMContentLoaded', () => {
    window.planBuilder = new GamifiedPlanBuilder();
    console.log('Gamified Plan Builder initialized!');
});
