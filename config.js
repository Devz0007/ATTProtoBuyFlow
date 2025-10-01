// Configuration file for API keys and settings
// This file handles different deployment environments

class Config {
    constructor() {
        // Try to get API key from different sources
        this.groqApiKey = this.getGroqApiKey();
        this.groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    }

    getGroqApiKey() {
        // Priority order for API key sources:
        // 1. Environment variable (for server deployments)
        // 2. Local storage (for client-side persistence)
        // 3. Prompt user to enter (fallback)
        
        // For Node.js/server environments
        if (typeof process !== 'undefined' && process.env && process.env.GROQ_API_KEY) {
            return process.env.GROQ_API_KEY;
        }
        
        // For client-side (browser) - check localStorage
        if (typeof localStorage !== 'undefined') {
            const storedKey = localStorage.getItem('groq_api_key');
            if (storedKey) {
                return storedKey;
            }
        }
        
        // No fallback API key - user must provide their own
        return null;
    }

    // Method to set API key at runtime
    setGroqApiKey(apiKey) {
        this.groqApiKey = apiKey;
        
        // Store in localStorage for persistence
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('groq_api_key', apiKey);
        }
    }

    // Method to check if API key is configured
    isApiKeyConfigured() {
        return this.groqApiKey && this.groqApiKey.trim() && this.groqApiKey.startsWith('gsk_');
    }

    // Method to prompt user for API key if needed
    async promptForApiKey() {
        if (!this.isApiKeyConfigured()) {
            const apiKey = prompt(
                'Please enter your Groq API key:\n\n' +
                '1. Get your free API key from: https://console.groq.com/keys\n' +
                '2. Create an account and generate a new API key\n' +
                '3. Paste it below:'
            );
            
            if (apiKey && apiKey.trim()) {
                this.setGroqApiKey(apiKey.trim());
                return true;
            }
            return false;
        }
        return true;
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
} else {
    window.Config = Config;
}
