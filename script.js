class WirelessPlanBuilder {
    constructor() {
        this.planQuantities = {
            premium: 0,
            extra: 0,
            starter: 0
        };
        
        this.planPricing = {
            premium: 85.99,
            extra: 65.99,
            starter: 60.99
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing WirelessPlanBuilder...');
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.bindEvents();
            this.initMobileMenu();
            this.updateOrderSummary(); // Initialize the order summary
        }, 100);
        
        console.log('WirelessPlanBuilder initialized');
    }

    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('.nav');
        
        if (hamburger && nav) {
            hamburger.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
            });
        }
    }

    bindEvents() {
        // Quantity selector buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                this.handleQuantityChange(e.target);
            }
        });

        // Line configuration interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.line-header')) {
                this.toggleLineExpansion(e.target.closest('.line-config'));
            }
        });
    }

    handleQuantityChange(button) {
        const planType = button.dataset.plan;
        const isPlus = button.classList.contains('plus');
        const isMinus = button.classList.contains('minus');
        
        console.log('Quantity change:', { planType, isPlus, isMinus });
        
        if (isPlus) {
            this.planQuantities[planType]++;
        } else if (isMinus && this.planQuantities[planType] > 0) {
            this.planQuantities[planType]--;
        }
        
        console.log('New quantities:', this.planQuantities);
        
        this.updateQuantityDisplays();
        this.updateEstimatedCost();
        this.updateButtonStates();
        this.generateLineConfigs();
    }

    updateQuantityDisplays() {
        Object.keys(this.planQuantities).forEach(planType => {
            const display = document.querySelector(`[data-plan="${planType}"].quantity-display`);
            const quantity = this.planQuantities[planType];
            if (display) {
                display.textContent = `${quantity} line${quantity !== 1 ? 's' : ''}`;
            }
        });
    }

    updateButtonStates() {
        Object.keys(this.planQuantities).forEach(planType => {
            const minusBtn = document.querySelector(`[data-plan="${planType}"].minus`);
            const quantity = this.planQuantities[planType];
            
            if (minusBtn) {
                minusBtn.disabled = quantity === 0;
            }
        });
    }

    updateEstimatedCost() {
        let totalCost = 0;
        let totalLines = 0;
        
        Object.keys(this.planQuantities).forEach(planType => {
            const quantity = this.planQuantities[planType];
            const pricePerLine = this.calculatePricePerLine(planType, quantity);
            totalCost += pricePerLine * quantity;
            totalLines += quantity;
        });
        
        // Update main cost display
        const totalLinesSpan = document.querySelector('.total-lines');
        const costAmount = document.querySelector('.cost-amount');
        
        if (totalLinesSpan) {
            totalLinesSpan.textContent = totalLines;
        }
        
        if (costAmount) {
            costAmount.textContent = `$${totalCost.toFixed(2)}`;
        }
        
        // Update order summary
        this.updateOrderSummary(totalLines, totalCost);
    }

    updateOrderSummary(totalLines = null, totalCost = null) {
        if (totalLines === null) {
            totalLines = Object.values(this.planQuantities).reduce((sum, qty) => sum + qty, 0);
        }
        if (totalCost === null) {
            totalCost = 0;
            Object.keys(this.planQuantities).forEach(planType => {
                const quantity = this.planQuantities[planType];
                const pricePerLine = this.calculatePricePerLine(planType, quantity);
                totalCost += pricePerLine * quantity;
            });
        }
        
        console.log('Updating order summary for', totalLines, 'lines, cost:', totalCost);
        
        const statusText = document.querySelector('.pricing-status span.font-semibold');
        const statusDesc = document.querySelector('.pricing-status p.text-sm');
        const orderDetails = document.querySelector('.order-details');
        const emptyState = document.querySelector('.empty-state');
        const continueBtn = document.getElementById('continue-btn');
        
        // Update status text
        if (statusText && statusDesc) {
            if (totalLines === 0) {
                statusText.textContent = '0 Lines Selected';
                statusDesc.textContent = 'Add lines to see family discounts';
            } else {
                statusText.textContent = `${totalLines} Line${totalLines > 1 ? 's' : ''} Pricing`;
                statusDesc.textContent = totalLines > 1 ? 
                    `Family discount applied for ${totalLines} lines` : 
                    'Add more lines to save with family discounts';
            }
        }
        
        // Show/hide sections
        if (totalLines === 0) {
            if (orderDetails) orderDetails.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            if (orderDetails) orderDetails.style.display = 'block';
            
            // Update the static template with basic numbers
            const planPrice = document.querySelector('.plan-price');
            const subtotal = document.querySelector('.subtotal');
            const total = document.querySelector('.total');
            
            if (planPrice) planPrice.textContent = `$${totalCost.toFixed(2)}`;
            if (subtotal) subtotal.textContent = `$${(totalCost + 56.67).toFixed(2)}`; // Add device + protection
            if (total) total.textContent = `$${(totalCost + 65.17).toFixed(2)}`; // Add taxes
        }
        
        // Update continue button
        if (continueBtn) {
            continueBtn.disabled = totalLines === 0;
        }
    }

    calculatePricePerLine(planType, quantity) {
        const basePrice = this.planPricing[planType];
        
        // Apply multi-line discounts
        if (quantity >= 4) {
            return basePrice - 20; // $20 off for 4+ lines
        } else if (quantity >= 2) {
            return basePrice - 10; // $10 off for 2-3 lines
        }
        
        return basePrice;
    }

    generateLineConfigs() {
        const container = document.getElementById('line-configurations-container');
        if (!container) return;
        
        // Clear existing configurations
        container.innerHTML = '';
        
        let lineNumber = 1;
        
        // Generate configs for each plan type
        Object.keys(this.planQuantities).forEach(planType => {
            const quantity = this.planQuantities[planType];
            for (let i = 0; i < quantity; i++) {
                const lineConfig = this.createLineConfig(lineNumber, planType);
                container.appendChild(lineConfig);
                lineNumber++;
            }
        });
    }

    createLineConfig(lineNumber, planType = 'premium') {
        const isPrimary = lineNumber === 1;
        const planName = this.getPlanDisplayName(planType);
        const lineConfig = document.createElement('div');
        lineConfig.className = 'border border-att-blue rounded-xl overflow-hidden bg-blue-50';
        lineConfig.dataset.line = lineNumber;
        lineConfig.dataset.planType = planType;
        
        lineConfig.innerHTML = `
            <div class="line-header bg-white p-4 border-b border-att-blue cursor-pointer hover:bg-blue-50 transition-colors" onclick="this.parentElement.querySelector('.line-content').classList.toggle('hidden')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">📱</span>
                        <div>
                            <h3 class="font-semibold text-gray-900">Line ${lineNumber}${isPrimary ? ' (Primary)' : ''}</h3>
                            <p class="text-sm text-gray-600">${planName}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-att-blue">iPhone 15 Pro Max</p>
                        <p class="text-sm text-gray-600">$141.67/mo</p>
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
                        <label class="flex-1 flex items-center gap-2 p-3 border border-att-blue bg-blue-50 rounded-lg cursor-pointer">
                            <input type="radio" name="device-line${lineNumber}" value="new" checked class="text-att-blue">
                            <span class="text-sm font-medium">Get new device</span>
                        </label>
                        <label class="flex-1 flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-att-blue">
                            <input type="radio" name="device-line${lineNumber}" value="bring" class="text-att-blue">
                            <span class="text-sm font-medium">Bring your own</span>
                        </label>
                    </div>
                </div>

                <!-- Device Selection -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Device</h4>
                    <div class="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <img src="https://via.placeholder.com/48x48/0073e7/ffffff?text=📱" alt="iPhone" class="w-12 h-12 rounded">
                        <div class="flex-1">
                            <p class="font-semibold">iPhone 15 Pro Max</p>
                            <p class="text-sm text-gray-600">256GB, Natural Titanium • $41.67/mo</p>
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
                            <p class="font-semibold">${planName}</p>
                            <p class="text-sm text-gray-600">Unlimited data, 5G access</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-lg font-bold text-att-blue">$${this.planPricing[planType]}/mo</span>
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
                                <input type="checkbox" checked class="text-att-blue">
                                <span class="font-medium">Device Protection</span>
                            </div>
                            <span class="font-semibold text-att-blue">$15/mo</span>
                        </label>
                        <label class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <div class="flex items-center gap-3">
                                <input type="checkbox" class="text-att-blue">
                                <span class="font-medium">International Roaming</span>
                            </div>
                            <span class="font-semibold text-att-blue">$12/mo</span>
                        </label>
                    </div>
                </div>

                <!-- Phone Number -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Phone Number</h4>
                    <div class="flex gap-4">
                        <label class="flex-1 flex items-center gap-2 p-3 border border-att-blue bg-blue-50 rounded-lg cursor-pointer">
                            <input type="radio" name="phone-line${lineNumber}" value="new" checked class="text-att-blue">
                            <span class="text-sm font-medium">Get new number</span>
                        </label>
                        <label class="flex-1 flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-att-blue">
                            <input type="radio" name="phone-line${lineNumber}" value="transfer" class="text-att-blue">
                            <span class="text-sm font-medium">Transfer existing</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        return lineConfig;
    }

    getPlanDisplayName(planType) {
        const planNames = {
            premium: 'Unlimited Premium',
            extra: 'Unlimited Extra',
            starter: 'Unlimited Starter'
        };
        return planNames[planType] || 'Unlimited Premium';
    }

    toggleLineExpansion(lineConfig) {
        if (lineConfig) {
            const content = lineConfig.querySelector('.line-content');
            if (content) {
                content.classList.toggle('hidden');
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.planBuilder = new WirelessPlanBuilder();
    console.log('Plan builder initialized and attached to window');
});