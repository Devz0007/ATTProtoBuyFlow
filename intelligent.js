class IntelligentCart {
    constructor() {
        // Initialize configuration
        this.config = new Config();
        this.groqApiKey = this.config.groqApiKey;
        this.groqEndpoint = this.config.groqEndpoint;
        
        this.conversationHistory = [];
        this.userProfile = {
            needs: [],
            budget: null,
            currentCarrier: null,
            currentBill: null,
            familySize: null,
            usage: null,
            employer: null,
            occupation: null,
            currentDevice: null,
            discounts: []
        };
        
        this.cart = {
            items: [],
            subtotal: 0,
            taxes: 0,
            total: 0
        };
        
        this.pendingItems = [];
        
        this.plans = {
            starter: { 
                name: 'Unlimited Starter', 
                price: 65, 
                data: 'Unlimited*', 
                features: ['Unlimited talk & text', '5GB hotspot', 'Basic security'],
                description: 'Perfect for light users who want unlimited basics'
            },
            extra: { 
                name: 'Unlimited Extra', 
                price: 75, 
                data: '75GB', 
                features: ['Unlimited talk & text', '30GB hotspot', 'Advanced security', 'HBO Max included'],
                description: 'Great for moderate users who stream and browse regularly'
            },
            premium: { 
                name: 'Unlimited Premium', 
                price: 85, 
                data: 'Unlimited', 
                features: ['Unlimited talk & text', '60GB hotspot', 'Premium security', 'HBO Max + Disney Bundle'],
                description: 'Best for heavy users who need maximum data and features'
            }
        };
        
        this.devices = {
            'iphone15pro': { 
                name: 'iPhone 15 Pro', 
                price: 33.33, 
                storage: '128GB',
                image: 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=📱',
                color: 'Natural Titanium',
                brand: 'Apple'
            },
            'iphone15': { 
                name: 'iPhone 15', 
                price: 27.78, 
                storage: '128GB',
                image: 'https://via.placeholder.com/100x100/FF69B4/FFFFFF?text=📱',
                color: 'Pink',
                brand: 'Apple'
            },
            'samsungs24': { 
                name: 'Samsung Galaxy S24', 
                price: 30.00, 
                storage: '128GB',
                image: 'https://via.placeholder.com/100x100/8A2BE2/FFFFFF?text=📱',
                color: 'Violet',
                brand: 'Samsung'
            },
            'byod': { 
                name: 'Bring Your Own Device', 
                price: 0, 
                storage: 'N/A',
                image: 'https://via.placeholder.com/100x100/6B7280/FFFFFF?text=📱',
                color: 'Your Device',
                brand: 'BYOD'
            }
        };
        
        this.isTyping = false;
        this.init();
    }
    
    async init() {
        this.bindEvents();
        this.setupSystemPrompt();
        
        // Check API key configuration
        const apiKeyConfigured = await this.config.promptForApiKey();
        if (!apiKeyConfigured) {
            this.addMessageToChat("⚠️ Groq API key is required for AI functionality. Please refresh the page and enter your API key.", 'ai');
            return;
        }
        
        // Update API key if it was changed
        this.groqApiKey = this.config.groqApiKey;
    }
    
    bindEvents() {
        // Chat input events
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const suggestion = e.target.dataset.suggestion;
                this.sendMessage(suggestion);
            });
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Checkout button
        document.getElementById('checkoutButton').addEventListener('click', () => {
            this.handleCheckout();
        });
    }
    
    setupSystemPrompt() {
        this.systemPrompt = `You are Alex, an exceptionally intelligent AT&T customer service assistant with advanced analytical capabilities, deep technical expertise, and superior emotional intelligence. You don't just sell plans - you solve problems, anticipate needs, and create personalized solutions that customers didn't even know they wanted.

CRITICAL: You MUST respond with ONLY valid JSON. No other text before or after. Just pure JSON:
{
    "message": "Your natural, conversational response",
    "actions": [{"type": "add_plan", "data": {"planType": "starter", "lines": 1}}],
    "insights": "Brief insight about the recommendation",
    "next_questions": []
}

DO NOT include any explanatory text outside the JSON. DO NOT say "Here's my response:" or anything like that. ONLY the JSON object.

INTELLIGENCE FRAMEWORK:
You operate with multiple layers of intelligence:

1. CONTEXTUAL AWARENESS: Remember everything from the conversation and build a complete customer profile
2. PREDICTIVE ANALYSIS: Anticipate needs based on usage patterns, lifestyle, and preferences  
3. EMOTIONAL INTELLIGENCE: Read between the lines, understand frustrations, and respond empathetically
4. TECHNICAL EXPERTISE: Deep knowledge of network technology, device capabilities, and plan optimization
5. FINANCIAL ACUMEN: Calculate total costs, find savings opportunities, and explain value propositions clearly

CONVERSATION STYLE:
- Be genuinely intelligent and insightful, not just friendly
- Ask layered questions that reveal deeper needs: "Tell me about your typical day - are you mostly in meetings, traveling, or at a desk?"
- Connect dots between seemingly unrelated information
- Anticipate objections and address them proactively
- Show you understand their world, not just telecom
- Provide insights customers haven't considered
- Make recommendations that prove you've been listening

INTELLIGENT SALES APPROACH:
- DISCOVERY PHASE: Ask intelligent, layered questions to understand the complete picture
- ANALYSIS PHASE: Connect usage patterns to plan features, identify cost-saving opportunities
- RECOMMENDATION PHASE: Provide personalized solutions with clear reasoning
- OBJECTION HANDLING: Address concerns with data and insights, not just enthusiasm
- VALUE ARTICULATION: Explain benefits in terms that matter to THAT specific customer

ADVANCED CONVERSATION TECHNIQUES:

For Budget-Conscious Customers:
"I can see you're being smart about your spending - I respect that! Let me show you how to get maximum value. Here's what most people don't realize about our plans..."

For Heavy Data Users:
"Sounds like you're a power user! With your usage pattern, let me calculate the real cost vs. value here. You'll actually save money in the long run because..."

For Business Professionals:
"For someone in your position, reliability is everything, right? Our Elite plan runs on our premium network tier - you get priority data even during peak times. When you're in that important client call..."

For Families:
"I love that you're thinking about the whole family! Here's how we can be really smart about this: start everyone on different plans based on actual usage, then optimize from there..."

INTELLIGENT EXAMPLE for "I'm a teacher switching from Verizon":
{
    "message": "A teacher! That's fantastic - education is so important. And you're switching from Verizon? I'm curious, what's driving that decision? Coverage issues, cost, or just exploring options? Here's what I'm thinking: as an educator, you qualify for our teacher discount - $10 off every line. But before I start throwing numbers at you, tell me about your typical day. Are you mostly at school with WiFi, or do you find yourself needing data for field trips, parent communications, or working from home? And is this just for you, or are we looking at family lines too?",
    "actions": [{"type": "update_profile", "data": {"occupation": "teacher", "currentCarrier": "Verizon"}}],
    "insights": "Gathering context about switching motivation and usage patterns before recommending - shows genuine interest in their specific situation",
    "next_questions": []
}

AT&T Plans:
- starter: Unlimited Starter $65/mo - Basic unlimited, 5GB hotspot
- extra: Unlimited Extra $75/mo - 30GB hotspot, HBO Max included  
- premium: Unlimited Premium $85/mo - 60GB hotspot, HBO Max + Disney Bundle

Devices & Monthly Pricing:
- iphone15pro: iPhone 15 Pro $33.33/mo (128GB), $36.11/mo (256GB), $41.67/mo (512GB)
- iphone15: iPhone 15 $27.78/mo (128GB), $30.56/mo (256GB)
- samsungs24: Samsung Galaxy S24 $30.00/mo (128GB), $33.33/mo (256GB)
- byod: Bring Your Own Device $0/mo

Discounts & Offers:
- Multi-line: 10% for 2-3 lines, 15% for 4+ lines
- Military/Veterans: $10/mo off each line
- Teachers/First Responders: $10/mo off each line  
- Students: $10/mo off with valid student ID
- Senior (55+): $10/mo off each line
- Corporate discounts: 15-25% off for major employers
- Trade-in credits: Up to $1000 for qualifying devices
- New customer promotions: Free device upgrades, waived activation fees

Action types:
- add_plan: {"planType": "starter|extra|premium", "lines": number}
- add_device: {"deviceType": "iphone15pro|iphone15|samsungs24|byod", "quantity": number, "storage": "128GB|256GB|512GB"}
- update_profile: {"budget": number, "currentBill": number, "familySize": number, "employer": "string", "occupation": "military|teacher|student|senior|first_responder", "currentDevice": "string"}
- apply_discount: {"discountType": "military|teacher|student|senior|corporate", "amount": number}

INTELLIGENT DISCOVERY QUESTIONS - Ask strategically:
1. CONTEXT FIRST: "What's driving your decision to look at new service today?"
2. USAGE PATTERNS: "Tell me about your typical day - where do you spend most of your time?"
3. PAIN POINTS: "What frustrates you most about your current service?"
4. LIFESTYLE ANALYSIS: "Are you the type who upgrades phones every year, or keeps them longer?"
5. FAMILY DYNAMICS: "Who else in your household needs service, and how do they use their phones?"
6. WORK CONTEXT: "Does your work involve travel, client calls, or specific app usage?"
7. FINANCIAL APPROACH: "Are you looking to minimize monthly costs or maximize value?"
8. FUTURE PLANNING: "Any big changes coming up - new job, moving, kids going to college?"

INTELLIGENT BEHAVIORS - Be proactive about:
- PATTERN RECOGNITION: Notice when customers mention specific apps, activities, or pain points
- PREDICTIVE RECOMMENDATIONS: Suggest solutions for problems they didn't know they had
- CONTEXTUAL BUNDLING: Recommend combinations that make sense for their lifestyle
- FINANCIAL OPTIMIZATION: Show total cost of ownership, not just monthly payments
- FUTURE-PROOFING: Anticipate their needs 6-12 months from now
- EMOTIONAL CALIBRATION: Adjust your approach based on their communication style

INTELLIGENT CONVERSATION EXAMPLES:

Customer: "I need a family plan"
Alex: "Excellent! Family plans are where I can really help you optimize costs and coverage. Before we dive into plans, tell me about your family's phone habits. Do you have teenagers who are constantly streaming, parents who mainly call and text, or a mix? And what's driving the switch - are you all on different carriers now, or looking to upgrade from a current family plan? Understanding how each person uses their phone helps me design something that actually fits your family instead of just selling you the same plan for everyone."

Customer: "What's your cheapest plan?"
Alex: "I appreciate you being upfront about budget - that's smart planning! Our Starter plan is $65/month, but here's what I've learned: the 'cheapest' plan isn't always the most cost-effective. If you're using more than 5GB of hotspot monthly, you'll hit overage fees that make our Extra plan actually cheaper. Before I recommend anything, what's your current monthly bill, and what frustrates you most about it? Are you trying to cut costs, or just make sure you're getting good value?"

Customer: "I'm military"
Alex: "Thank you for your service - truly. And here's something great: you qualify for our military discount, which is $10 off every line, every month. But let me ask you something most reps don't think about - are you active duty, reserves, or veteran? And do you move around a lot for deployments or PCS? Because that actually affects which plan I'd recommend. Our network coverage varies by region, and if you're frequently in remote areas, I want to make sure you get priority data access."

REMEMBER - BE GENUINELY INTELLIGENT:
- Connect seemingly unrelated information to provide insights
- Ask questions that reveal deeper needs than surface requests
- Anticipate their next question before they ask it
- Show you understand their world, not just telecom products
- Provide recommendations that prove you've been listening carefully
- Explain the 'why' behind every recommendation with specific reasoning
- Address unstated concerns proactively
- Demonstrate expertise without being condescending
- Make them feel like they're getting advice from someone who truly gets it
- Your goal isn't just to sell - it's to be so helpful and insightful that customers feel lucky to have found you

INTELLIGENCE INDICATORS:
- Reference previous conversation points naturally
- Make connections between their lifestyle and technical features
- Offer alternatives they hadn't considered
- Explain trade-offs clearly and honestly
- Show long-term thinking, not just immediate solutions
- Demonstrate understanding of their priorities and constraints`;
    }
    
    async sendMessage(messageText = null) {
        const input = document.getElementById('chatInput');
        const message = messageText || input.value.trim();
        
        if (!message) return;
        
        // Clear input if not from suggestion
        if (!messageText) {
            input.value = '';
        }
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            
            // Process AI response
            await this.processAIResponse(response);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.addMessageToChat("I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 'ai');
        }
    }
    
    async getAIResponse(userMessage) {
        // Build context-aware system prompt
        const contextualPrompt = this.buildContextualPrompt();
        
        const messages = [
            { role: 'system', content: contextualPrompt },
            ...this.conversationHistory.slice(-8) // Keep last 8 messages for context
        ];
        
        const response = await fetch(this.groqEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    async processAIResponse(aiResponse) {
        try {
            // Clean the response - sometimes AI adds extra text before/after JSON
            let cleanedResponse = aiResponse.trim();
            
            // Extract JSON if it's embedded in other text
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanedResponse = jsonMatch[0];
            }
            
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(cleanedResponse);
                
                // Validate that we have the required message field
                if (!parsedResponse.message) {
                    throw new Error('No message field in response');
                }
            } catch (e) {
                console.log('JSON parsing failed, treating as plain text:', e);
                console.log('Original response:', aiResponse);
                
                // Try to extract just the conversational part if JSON is mixed with text
                let cleanMessage = aiResponse;
                
                // Remove any JSON-like content that got mixed in
                cleanMessage = cleanMessage.replace(/\{[\s\S]*\}/, '').trim();
                
                // If we still have content, use it, otherwise create a fallback
                if (cleanMessage.length > 10) {
                    parsedResponse = {
                        message: cleanMessage,
                        actions: [],
                        insights: null,
                        next_questions: []
                    };
                } else {
                    // Complete fallback
                    parsedResponse = {
                        message: "I'm here to help you find the perfect AT&T plan! What can I help you with today?",
                        actions: [],
                        insights: "Fallback response due to parsing error",
                        next_questions: []
                    };
                }
            }
            
            // Check if AI is asking about adding items and show Yes/No buttons
            const isAskingToAdd = this.detectAddItemQuestion(parsedResponse.message, parsedResponse.actions);
            
            // Add AI message to chat with enhanced formatting
            this.addMessageToChat(parsedResponse.message, 'ai', parsedResponse, isAskingToAdd);
            
            // Add to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: parsedResponse.message
            });
            
            // Process actions (but not if we're asking for confirmation and cart has items)
            if (parsedResponse.actions && parsedResponse.actions.length > 0) {
                const hasAddActions = parsedResponse.actions.some(action => 
                    action.type === 'add_plan' || action.type === 'add_device'
                );
                
                // If cart has items and AI is asking about adding more, don't auto-execute
                if (hasAddActions && this.cart.items.length > 0 && isAskingToAdd) {
                    // Store actions for later execution via Yes/No buttons
                    // Actions will be executed in handleYesNoResponse if user says yes
                    this.showPendingItems(parsedResponse.actions);
                } else {
                    // Execute actions normally (empty cart or non-add actions)
                    for (const action of parsedResponse.actions) {
                        await this.executeAction(action);
                    }
                }
            }
            
            // Show insights
            if (parsedResponse.insights) {
                this.showInsight(parsedResponse.insights);
            }
            
            // Add follow-up questions as quick replies
            if (parsedResponse.next_questions && parsedResponse.next_questions.length > 0) {
                this.addQuickReplies(parsedResponse.next_questions);
            }
            
        } catch (error) {
            console.error('Error processing AI response:', error);
            console.error('Raw AI response:', aiResponse);
            
            // Fallback with a friendly message
            this.addMessageToChat("I'm sorry, I had a little hiccup there! Let me help you find the perfect AT&T plan. What are you looking for today?", 'ai');
            this.conversationHistory.push({
                role: 'assistant',
                content: "I'm sorry, I had a little hiccup there! Let me help you find the perfect AT&T plan. What are you looking for today?"
            });
        }
    }
    
    async executeAction(action) {
        switch (action.type) {
            case 'add_plan':
                this.addPlanToCart(action.data);
                break;
            case 'add_device':
                this.addDeviceToCart(action.data);
                break;
            case 'remove_plan':
                this.removePlanFromCart(action.data);
                break;
            case 'remove_device':
                this.removeDeviceFromCart(action.data);
                break;
            case 'update_profile':
                this.updateUserProfile(action.data);
                break;
            case 'show_insight':
                this.showInsight(action.data.message);
                break;
            case 'apply_discount':
                this.applyDiscount(action.data);
                break;
        }
    }
    
    addPlanToCart(planData) {
        const plan = this.plans[planData.planType] || this.plans.extra;
        const lines = planData.lines || 1;
        
        // Remove existing plans
        this.cart.items = this.cart.items.filter(item => item.type !== 'plan');
        
        // Add new plan
        const planItem = {
            id: `plan-${planData.planType}`,
            type: 'plan',
            name: plan.name,
            price: plan.price,
            lines: lines,
            totalPrice: this.calculatePlanPrice(plan.price, lines),
            description: `${lines} line${lines > 1 ? 's' : ''}`
        };
        
        this.cart.items.push(planItem);
        this.updateCartDisplay();
        this.animateCartItem(planItem.id);
    }
    
    addDeviceToCart(deviceData) {
        const device = this.devices[deviceData.deviceType] || this.devices.byod;
        const quantity = deviceData.quantity || 1;
        const storage = deviceData.storage || '128GB';
        
        // Remove existing devices
        this.cart.items = this.cart.items.filter(item => item.type !== 'device');
        
        if (device.price > 0) {
            // Adjust price based on storage
            let devicePrice = device.price;
            if (storage === '256GB') devicePrice += 2.78;
            if (storage === '512GB') devicePrice += 8.34;
            
            const deviceItem = {
                id: `device-${deviceData.deviceType}-${storage}`,
                type: 'device',
                name: device.name,
                price: devicePrice,
                quantity: quantity,
                totalPrice: devicePrice * quantity,
                description: `${storage} • ${quantity} device${quantity > 1 ? 's' : ''}`,
                image: device.image,
                color: device.color,
                brand: device.brand
            };
            
            this.cart.items.push(deviceItem);
            this.updateCartDisplay();
            this.animateCartItem(deviceItem.id);
        }
    }
    
    calculatePlanPrice(basePrice, lines) {
        let total = basePrice * lines;
        if (lines >= 4) {
            total = total * 0.85; // 15% discount
        } else if (lines >= 2) {
            total = total * 0.90; // 10% discount
        }
        return Math.round(total);
    }
    
    updateUserProfile(profileData) {
        Object.assign(this.userProfile, profileData);
        
        // Update savings if budget is provided
        if (profileData.currentBill) {
            const currentTotal = this.cart.total;
            const savings = profileData.currentBill - currentTotal;
            if (savings > 0) {
                this.showSavings(savings, 'vs your current bill');
            }
        }
        
        // Auto-suggest discounts based on occupation
        if (profileData.occupation && !this.userProfile.discounts.some(d => d.type === profileData.occupation)) {
            this.suggestDiscount(profileData.occupation);
        }
    }
    
    applyDiscount(discountData) {
        // Remove existing discount of same type
        this.userProfile.discounts = this.userProfile.discounts.filter(d => d.type !== discountData.discountType);
        
        // Add new discount
        this.userProfile.discounts.push({
            type: discountData.discountType,
            amount: discountData.amount,
            description: this.getDiscountDescription(discountData.discountType)
        });
        
        // Update cart display with new discount
        this.updateCartDisplay();
        
        // Show discount applied message
        this.showInsight(`Great! I've applied your ${this.getDiscountDescription(discountData.discountType)} discount. You'll save $${discountData.amount} per line!`);
    }
    
    getDiscountDescription(discountType) {
        const descriptions = {
            'military': 'Military/Veteran',
            'teacher': 'Teacher',
            'student': 'Student',
            'senior': 'Senior (55+)',
            'first_responder': 'First Responder',
            'corporate': 'Corporate Employee'
        };
        return descriptions[discountType] || discountType;
    }
    
    suggestDiscount(occupation) {
        const discountAmount = occupation === 'corporate' ? 15 : 10;
        this.showInsight(`I see you're a ${occupation}! You qualify for a $${discountAmount}/month discount per line. Would you like me to apply that?`);
    }
    
    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.getElementById('cartCount');
        
        // Update cart count
        const itemCount = this.cart.items.length;
        cartCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
        
        if (this.cart.items.length === 0) {
            emptyCart.style.display = 'block';
            cartTotal.classList.add('hidden');
            return;
        }
        
        emptyCart.style.display = 'none';
        cartTotal.classList.remove('hidden');
        
        // Clear existing items except empty state
        Array.from(cartItems.children).forEach(child => {
            if (child.id !== 'emptyCart') {
                child.remove();
            }
        });
        
        // Add cart items
        this.cart.items.forEach(item => {
            const itemElement = this.createCartItemElement(item);
            cartItems.appendChild(itemElement);
        });
        
        // Calculate totals
        this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // Apply discounts
        let discountAmount = 0;
        const planItem = this.cart.items.find(item => item.type === 'plan');
        if (planItem && this.userProfile.discounts.length > 0) {
            this.userProfile.discounts.forEach(discount => {
                discountAmount += discount.amount * planItem.lines;
            });
        }
        
        const subtotalAfterDiscount = Math.max(0, this.cart.subtotal - discountAmount);
        this.cart.taxes = Math.round(subtotalAfterDiscount * 0.08); // 8% tax estimate
        this.cart.total = subtotalAfterDiscount + this.cart.taxes;
        
        // Update total display
        document.getElementById('subtotal').textContent = `$${this.cart.subtotal.toFixed(2)}`;
        
        // Show discounts if any
        const taxesElement = document.getElementById('taxes');
        if (discountAmount > 0) {
            taxesElement.parentElement.innerHTML = `
                <div class="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>$${this.cart.subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm text-green-600">
                    <span>Discounts Applied</span>
                    <span>-$${discountAmount.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>Estimated taxes & fees</span>
                    <span id="taxes">$${this.cart.taxes.toFixed(2)}</span>
                </div>
            `;
        } else {
            taxesElement.parentElement.innerHTML = `
                <div class="flex justify-between text-sm">
                    <span>Monthly Subtotal</span>
                    <span id="subtotal">$${this.cart.subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>Estimated taxes & fees</span>
                    <span id="taxes">$${this.cart.taxes.toFixed(2)}</span>
                </div>
            `;
        }
        
        document.getElementById('total').textContent = `$${this.cart.total.toFixed(2)}`;
    }
    
    createCartItemElement(item) {
        const div = document.createElement('div');
        div.className = 'cart-item-enter border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200';
        div.id = item.id;
        
        let itemVisual = '';
        
        if (item.type === 'plan') {
            // Plan icon
            itemVisual = `<div class="w-12 h-12 bg-att-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-white text-lg">📋</span>
            </div>`;
        } else if (item.type === 'device' && item.image) {
            // Device image
            itemVisual = `<div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200 shadow-sm">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-1" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-full h-full bg-att-blue rounded-lg flex items-center justify-center text-white text-lg" style="display:none;">📱</div>
            </div>`;
        } else {
            // Fallback icon
            itemVisual = `<div class="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-gray-600 text-lg">📱</span>
            </div>`;
        }
        
        div.innerHTML = `
            <div class="flex items-center justify-between relative">
                <!-- Remove Button -->
                <button class="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200 group z-10" onclick="intelligentCart.removeFromCart('${item.id}')">
                    <svg class="w-3 h-3 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                
                <div class="flex items-center gap-3 flex-1 pr-8">
                    ${itemVisual}
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-600">${item.description}</p>
                        ${item.color ? `<p class="text-xs text-gray-500">${item.color}${item.brand && item.brand !== 'BYOD' ? ` • ${item.brand}` : ''}</p>` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-att-blue">$${item.totalPrice.toFixed(2)}/mo</p>
                    ${item.lines || item.quantity > 1 ? `<p class="text-xs text-gray-500">$${item.price.toFixed(2)}/mo each</p>` : ''}
                </div>
            </div>
        `;
        
        return div;
    }
    
    detectAddItemQuestion(message, actions) {
        // Check if the message contains phrases that suggest adding items
        const addPhrases = [
            'would you like to add',
            'want to add',
            'shall I add',
            'should I add',
            'add this to your cart',
            'include this',
            'would you like me to include'
        ];
        
        const messageText = message.toLowerCase();
        const hasAddPhrase = addPhrases.some(phrase => messageText.includes(phrase));
        
        // Check if actions contain add_plan or add_device
        const hasAddAction = actions && actions.some(action => 
            action.type === 'add_plan' || action.type === 'add_device'
        );
        
        return hasAddPhrase || hasAddAction;
    }

    showPendingItems(actions) {
        const pendingSection = document.getElementById('pendingItems');
        const pendingList = document.getElementById('pendingItemsList');
        
        // Clear existing pending items
        pendingList.innerHTML = '';
        
        // Add each pending item
        actions.forEach(action => {
            if (action.type === 'add_plan' || action.type === 'add_device') {
                const pendingItem = this.createPendingItemElement(action);
                pendingList.appendChild(pendingItem);
            }
        });
        
        // Show the pending section
        pendingSection.classList.remove('hidden');
    }
    
    createPendingItemElement(action) {
        const div = document.createElement('div');
        div.className = 'bg-white border border-yellow-300 rounded-lg p-3 flex items-center justify-between';
        
        let name, price, description;
        if (action.type === 'add_plan') {
            const plan = this.plans[action.plan];
            name = plan.name;
            price = plan.price;
            description = `${plan.data} data, ${plan.features}`;
        } else if (action.type === 'add_device') {
            name = action.device;
            price = action.price || 27.78;
            description = `${action.storage || '128GB'} ${action.color || ''} ${action.brand || ''}`.trim();
        }
        
        div.innerHTML = `
            <div class="flex-1">
                <h4 class="font-medium text-gray-900">${name}</h4>
                <p class="text-sm text-gray-600">${description}</p>
            </div>
            <div class="text-right">
                <p class="font-semibold text-yellow-700">$${price}/mo</p>
                <div class="flex gap-1 mt-1">
                    <button class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs" onclick="intelligentCart.confirmPendingItem('${JSON.stringify(action).replace(/'/g, "\\'")}', true)">
                        Add
                    </button>
                    <button class="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs" onclick="intelligentCart.confirmPendingItem('${JSON.stringify(action).replace(/'/g, "\\'")}', false)">
                        Skip
                    </button>
                </div>
            </div>
        `;
        
        return div;
    }
    
    confirmPendingItem(actionStr, isConfirmed) {
        const action = JSON.parse(actionStr);
        
        if (isConfirmed) {
            this.executeAction(action);
        }
        
        // Remove this pending item from display
        const pendingList = document.getElementById('pendingItemsList');
        const pendingSection = document.getElementById('pendingItems');
        
        // Remove the specific item (find by action data)
        Array.from(pendingList.children).forEach(child => {
            if (child.innerHTML.includes(action.plan || action.device)) {
                child.remove();
            }
        });
        
        // Hide pending section if no more items
        if (pendingList.children.length === 0) {
            pendingSection.classList.add('hidden');
        }
    }

    handleYesNoResponse(isYes) {
        if (isYes && this.pendingActions) {
            // Execute the pending actions
            this.pendingActions.forEach(action => {
                this.executeAction(action);
            });
            
            // Add user response to chat
            this.addMessageToChat("Yes, add it to my cart", 'user');
            
            // Add AI confirmation
            this.addMessageToChat("Perfect! I've added that to your cart.", 'ai');
        } else {
            // Add user response to chat
            this.addMessageToChat("No, thanks", 'user');
            
            // Add AI acknowledgment
            this.addMessageToChat("No problem! Let me know if you'd like to explore other options.", 'ai');
        }
        
        // Clear pending actions and hide pending items
        this.pendingActions = null;
        document.getElementById('pendingItems').classList.add('hidden');
        
        // Remove the Yes/No buttons by finding and hiding them
        const buttons = document.querySelectorAll('.chat-bubble-ai button');
        buttons.forEach(button => {
            if (button.textContent.includes('Yes, add it') || button.textContent.includes('No, thanks')) {
                button.parentElement.style.display = 'none';
            }
        });
    }

    removeFromCart(itemId) {
        // Find and remove the item from cart
        const itemIndex = this.cart.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const removedItem = this.cart.items[itemIndex];
            this.cart.items.splice(itemIndex, 1);
            
            // Add a message to chat about the removal
            this.addMessageToChat(`I've removed ${removedItem.name} from your cart.`, 'ai');
            
            // Update cart display
            this.updateCartDisplay();
            
            // Show insight about the change
            this.showInsight(`${removedItem.name} has been removed. Your monthly total is now $${this.cart.total.toFixed(2)}.`);
        }
    }

    animateCartItem(itemId) {
        setTimeout(() => {
            const element = document.getElementById(itemId);
            if (element) {
                element.style.transform = 'scale(1.05)';
                element.style.backgroundColor = '#e6f3ff';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.backgroundColor = '#f9fafb';
                }, 300);
            }
        }, 100);
    }
    
    showInsight(message) {
        const insights = document.getElementById('aiInsights');
        const content = document.getElementById('insightsContent');
        
        content.textContent = message;
        insights.classList.remove('hidden');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            insights.classList.add('hidden');
        }, 10000);
    }
    
    showSavings(amount, description) {
        const tracker = document.getElementById('savingsTracker');
        const savingsAmount = document.getElementById('savingsAmount');
        const savingsDescription = document.getElementById('savingsDescription');
        
        savingsAmount.textContent = `$${amount}`;
        savingsDescription.textContent = description;
        tracker.classList.remove('hidden');
    }
    
    addMessageToChat(message, sender, parsedData = null, showYesNoButtons = false) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start gap-3 animate-fade-in ${sender === 'user' ? 'justify-end' : ''}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="chat-bubble-user p-3 max-w-md">
                    <p class="text-white">${message}</p>
                </div>
                <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                </div>
            `;
        } else {
            // Format AI messages with better structure
            const formattedMessage = this.formatAIMessage(message, parsedData);
            
            // Add Yes/No buttons if this is an add item question
            let yesNoButtons = '';
            if (showYesNoButtons && parsedData && parsedData.actions) {
                // Store pending actions for Yes/No responses
                this.pendingActions = parsedData.actions;
                yesNoButtons = `
                    <div class="flex gap-2 mt-3">
                        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200" onclick="intelligentCart.handleYesNoResponse(true)">
                            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Yes, add it
                        </button>
                        <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200" onclick="intelligentCart.handleYesNoResponse(false)">
                            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            No, thanks
                        </button>
                    </div>
                `;
            }
            
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div class="chat-bubble-ai p-4 max-w-lg">
                    ${formattedMessage}
                    ${yesNoButtons}
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    formatAIMessage(message, parsedData) {
        // Enhanced message formatting for better readability
        let formattedHTML = '';
        
        // Split message into sentences for better formatting
        const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Look for key patterns to format specially
        let mainMessage = message;
        let planOptions = [];
        let keyPoints = [];
        let pricing = [];
        
        // Extract plan information
        const planRegex = /(Unlimited \w+.*?\$\d+.*?month)/gi;
        const planMatches = message.match(planRegex);
        if (planMatches) {
            planOptions = planMatches;
            mainMessage = message.replace(planRegex, '').trim();
        }
        
        // Extract pricing information
        const priceRegex = /\$\d+(?:\.\d{2})?\s*(?:\/month|\/mo|per month)/gi;
        const priceMatches = message.match(priceRegex);
        if (priceMatches) {
            pricing = priceMatches;
        }
        
        // Extract key benefits/features
        const benefitRegex = /(unlimited \w+|hotspot|HBO Max|Disney Bundle|\d+GB)/gi;
        const benefitMatches = message.match(benefitRegex);
        if (benefitMatches) {
            keyPoints = [...new Set(benefitMatches)]; // Remove duplicates
        }
        
        // Build formatted message
        formattedHTML += `<div class="text-gray-800 leading-relaxed">`;
        
        // Main conversational part
        const cleanMessage = mainMessage.replace(/\s+/g, ' ').trim();
        if (cleanMessage) {
            formattedHTML += `<p class="mb-3">${cleanMessage}</p>`;
        }
        
        // Plan options with visual formatting
        if (planOptions.length > 0) {
            formattedHTML += `<div class="bg-att-blue-light rounded-lg p-3 mb-3">`;
            formattedHTML += `<h4 class="font-semibold text-att-blue mb-2">📋 Plan Options:</h4>`;
            formattedHTML += `<ul class="space-y-1">`;
            planOptions.forEach(plan => {
                formattedHTML += `<li class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-att-blue rounded-full flex-shrink-0"></span>
                    <span class="text-sm">${plan.trim()}</span>
                </li>`;
            });
            formattedHTML += `</ul></div>`;
        }
        
        // Key features/benefits
        if (keyPoints.length > 0 && keyPoints.length <= 5) {
            formattedHTML += `<div class="bg-green-50 rounded-lg p-3 mb-3">`;
            formattedHTML += `<h4 class="font-semibold text-green-700 mb-2">✨ Key Features:</h4>`;
            formattedHTML += `<div class="flex flex-wrap gap-2">`;
            keyPoints.forEach(point => {
                formattedHTML += `<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">${point.trim()}</span>`;
            });
            formattedHTML += `</div></div>`;
        }
        
        // Pricing highlights
        if (pricing.length > 0) {
            formattedHTML += `<div class="bg-orange-50 rounded-lg p-3 mb-3">`;
            formattedHTML += `<h4 class="font-semibold text-orange-700 mb-2">💰 Pricing:</h4>`;
            formattedHTML += `<div class="flex flex-wrap gap-2">`;
            pricing.forEach(price => {
                formattedHTML += `<span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">${price.trim()}</span>`;
            });
            formattedHTML += `</div></div>`;
        }
        
        // Add insights if available
        if (parsedData && parsedData.insights) {
            formattedHTML += `<div class="bg-blue-50 rounded-lg p-3 border-l-4 border-att-blue">`;
            formattedHTML += `<p class="text-sm text-blue-800"><span class="font-semibold">💡 Alex's Tip:</span> ${parsedData.insights}</p>`;
            formattedHTML += `</div>`;
        }
        
        formattedHTML += `</div>`;
        
        return formattedHTML;
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'flex items-start gap-3 animate-fade-in';
        
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-att-blue rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm">🤖</span>
            </div>
            <div class="chat-bubble-ai p-3">
                <div class="flex gap-1">
                    <div class="typing-indicator"></div>
                    <div class="typing-indicator"></div>
                    <div class="typing-indicator"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Update status
        document.getElementById('aiStatus').textContent = 'Alex is typing...';
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
        document.getElementById('aiStatus').textContent = 'Ready to help you find the perfect plan';
    }
    
    addQuickReplies(questions) {
        // This could add quick reply buttons below the chat
        // For now, we'll just log them
        console.log('Follow-up questions:', questions);
    }
    
    handleQuickAction(action) {
        const actionMessages = {
            'compare-plans': 'Can you help me compare your different unlimited plans?',
            'check-coverage': 'How is AT&T coverage in my area?',
            'trade-in-value': 'What\'s my current phone worth for trade-in?',
            'help': 'I need help understanding my options'
        };
        
        const message = actionMessages[action];
        if (message) {
            this.sendMessage(message);
        }
    }
    
    handleCheckout() {
        if (this.cart.items.length === 0) {
            this.sendMessage('I want to checkout but my cart is empty');
            return;
        }
        
        // Simulate checkout process
        this.addMessageToChat('Great choice! Let me help you complete your order. I\'ll need some information to get you set up.', 'ai');
        
        // In a real implementation, this would redirect to checkout
        setTimeout(() => {
            alert('Checkout functionality would be implemented here. For this demo, we\'ll just show this message.');
        }, 1000);
    }
    
    buildContextualPrompt() {
        let contextualInfo = this.systemPrompt;
        
        // Enhanced intelligent context analysis
        contextualInfo += "\n\nINTELLIGENT CONTEXT ANALYSIS:\n";
        
        // Analyze user profile for intelligent insights
        const profileInsights = [];
        if (this.userProfile.occupation) {
            const discountEligible = ['military', 'teacher', 'student', 'senior', 'first_responder'].includes(this.userProfile.occupation);
            profileInsights.push(`Occupation: ${this.userProfile.occupation}${discountEligible ? ' (DISCOUNT ELIGIBLE - $10/line)' : ''}`);
        }
        if (this.userProfile.currentCarrier) {
            profileInsights.push(`Switching from: ${this.userProfile.currentCarrier} (ask about pain points)`);
        }
        if (this.userProfile.currentBill) {
            profileInsights.push(`Current bill: $${this.userProfile.currentBill}/month (show savings opportunity)`);
        }
        if (this.userProfile.familySize) {
            profileInsights.push(`Family size: ${this.userProfile.familySize} people (multi-line discounts available)`);
        }
        if (this.userProfile.currentDevice) {
            profileInsights.push(`Current device: ${this.userProfile.currentDevice} (assess upgrade needs)`);
        }
        
        if (profileInsights.length > 0) {
            contextualInfo += "CUSTOMER PROFILE:\n" + profileInsights.map(insight => `- ${insight}`).join('\n') + '\n\n';
        }
        
        // Analyze cart for intelligent recommendations
        if (this.cart.items.length > 0) {
            const planItems = this.cart.items.filter(item => item.type === 'plan');
            const deviceItems = this.cart.items.filter(item => item.type === 'device');
            
            contextualInfo += 'CART INTELLIGENCE:\n';
            contextualInfo += `- Current selection: ${this.cart.items.map(item => item.name).join(', ')}\n`;
            contextualInfo += `- Monthly total: $${this.cart.total.toFixed(2)}\n`;
            
            if (planItems.length > 0 && deviceItems.length === 0) {
                contextualInfo += `- OPPORTUNITY: Customer has plan but no device - proactively ask about device needs\n`;
            }
            if (deviceItems.length > 0 && planItems.length === 0) {
                contextualInfo += `- OPPORTUNITY: Customer has device but no plan - recommend compatible plan\n`;
            }
            contextualInfo += '\n';
        }
        
        // Analyze conversation patterns
        const recentHistory = this.conversationHistory.slice(-6);
        if (recentHistory.length > 0) {
            const allText = recentHistory.map(msg => msg.content.toLowerCase()).join(' ');
            const themes = [];
            
            if (allText.includes('family') || allText.includes('kids') || allText.includes('spouse')) {
                themes.push('Family-focused');
            }
            if (allText.includes('work') || allText.includes('business') || allText.includes('travel')) {
                themes.push('Business user');
            }
            if (allText.includes('stream') || allText.includes('video') || allText.includes('netflix')) {
                themes.push('Heavy streaming');
            }
            if (allText.includes('budget') || allText.includes('cheap') || allText.includes('save')) {
                themes.push('Price-sensitive');
            }
            
            if (themes.length > 0) {
                contextualInfo += `CONVERSATION THEMES: ${themes.join(', ')}\n\n`;
            }
        }
        
        contextualInfo += "INTELLIGENCE DIRECTIVE:\n";
        contextualInfo += "- Reference previous conversation points naturally\n";
        contextualInfo += "- Make connections between their lifestyle and technical features\n";
        contextualInfo += "- Anticipate their next question before they ask it\n";
        contextualInfo += "- Show you understand their world, not just telecom\n";
        contextualInfo += "- Provide insights they haven't considered\n";
        
        return contextualInfo;
    }
    
    makeResponseConversational(response) {
        // Add conversational flair to plain text responses
        const conversationalPhrases = [
            "That's awesome! ",
            "Perfect! ",
            "Great question! ",
            "I love helping with that! ",
            "You're gonna love this - ",
            "Here's what I can do for you - "
        ];
        
        const randomPhrase = conversationalPhrases[Math.floor(Math.random() * conversationalPhrases.length)];
        return randomPhrase + response;
    }
}

// Initialize the Intelligent Cart
document.addEventListener('DOMContentLoaded', () => {
    window.intelligentCart = new IntelligentCart();
    console.log('Intelligent Cart initialized with AI capabilities!');
});
