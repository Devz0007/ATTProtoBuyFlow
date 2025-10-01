# AT&T Buy Flow Redesign

A modern, responsive prototype for AT&T's wireless plan selection and configuration experience.

## 🚀 Live Demo

Visit the live prototype: [https://yourusername.github.io/ATT-Buy-Flow-Redesign](https://yourusername.github.io/ATT-Buy-Flow-Redesign)

## ✨ Features

- **Dynamic Plan Selection**: Interactive +/- buttons to select multiple lines
- **Real-time Pricing**: Family discounts applied automatically
- **Order Summary**: Live updates as you configure your plans
- **Line Configuration**: Expandable sections for device, plan, and add-on selection
- **AT&T Branding**: Authentic AT&T design and color scheme
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠 Technology Stack

- **HTML5**: Semantic markup structure
- **Tailwind CSS**: Modern utility-first styling
- **Vanilla JavaScript**: Dynamic functionality and interactions
- **GitHub Pages**: Static site hosting

## 📱 Plan Options

- **AT&T Unlimited Premium® PL** - $85.99/mo per line
- **AT&T Unlimited Extra® EL** - $65.99/mo per line  
- **AT&T Unlimited Starter® SL** - $60.99/mo per line

## 🎯 Key Functionality

1. **Plan Selection**: Choose quantity for each plan type
2. **Family Discounts**: Automatic multi-line pricing
3. **Line Configuration**: Device selection, add-ons, phone numbers
4. **Order Summary**: Real-time pricing breakdown
5. **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Basic Setup
1. Clone this repository
2. Open `index.html` in your browser
3. Start selecting plans and configuring lines!

### AI Assistant Setup (for intelligent.html)
1. Copy `local.env.example` to `local.env`
2. Add your Groq API key to `local.env`:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```
3. Start a local server (required for environment file loading):
   ```bash
   python3 -m http.server 8000
   ```
4. Visit `http://localhost:8000/intelligent.html`

### Environment Variables
The AI-powered features require a Groq API key. Create a `local.env` file with:
- `GROQ_API_KEY`: Your Groq API key for AI functionality
- `GROQ_ENDPOINT`: API endpoint (defaults to Groq's OpenAI-compatible endpoint)

## 📄 Files

### Core Application
- `index.html` - Main application structure
- `script.js` - Interactive functionality  
- `styles.css` - Additional custom styles (using Tailwind CDN)
- `gamified.html` - Gamified plan selection experience
- `gamified.js` - Gamified functionality

### AI-Powered Experience
- `intelligent.html` - AI assistant interface
- `intelligent.js` - AI conversation and cart logic
- `env-loader.js` - Environment variable loader
- `local.env` - Environment configuration (not in git)
- `local.env.example` - Example environment file

### Configuration
- `.gitignore` - Git ignore rules (includes local.env)
- `README.md` - This documentation

---

*This is a prototype demonstration of modern UX/UI principles applied to AT&T's wireless plan selection flow.*
