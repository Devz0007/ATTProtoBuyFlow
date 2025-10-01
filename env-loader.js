// Simple environment variable loader for client-side JavaScript
class EnvLoader {
    constructor() {
        this.env = {};
        this.loaded = false;
    }

    async loadEnv() {
        if (this.loaded) return this.env;
        
        try {
            const response = await fetch('./local.env');
            if (!response.ok) {
                throw new Error(`Failed to load environment file: ${response.status}`);
            }
            
            const envText = await response.text();
            this.parseEnvFile(envText);
            this.loaded = true;
            return this.env;
        } catch (error) {
            console.warn('Could not load local.env file:', error.message);
            console.warn('Make sure local.env exists and contains GROQ_API_KEY');
            return {};
        }
    }

    parseEnvFile(envText) {
        const lines = envText.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }
            
            // Parse KEY=VALUE format
            const equalIndex = trimmedLine.indexOf('=');
            if (equalIndex > 0) {
                const key = trimmedLine.substring(0, equalIndex).trim();
                let value = trimmedLine.substring(equalIndex + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                this.env[key] = value;
            }
        }
    }

    get(key, defaultValue = null) {
        return this.env[key] || defaultValue;
    }

    getRequired(key) {
        const value = this.env[key];
        if (!value) {
            throw new Error(`Required environment variable ${key} is not set`);
        }
        return value;
    }
}

// Export for use in other files
window.EnvLoader = EnvLoader;
