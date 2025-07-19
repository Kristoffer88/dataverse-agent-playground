# Dataverse Agent Playground

Experimental repository for exploring AI-driven Power Platform development workflows.

This is an example folder and testing environment for [dataverse-utilities](https://github.com/Kristoffer88/dataverse-utilities) with Playwright automation to experiment with Claude Code on Dataverse development.

## Purpose

- **Example Implementation**: Demonstrates usage patterns for the dataverse-utilities library
- **AI Development Workflows**: Testing ground for Claude Code integration with Power Platform development
- **Playwright Automation**: End-to-end testing framework for Dataverse applications
- **Development Experimentation**: Safe environment to try new approaches and patterns

## Tech Stack

- **React 19** with TypeScript - Frontend framework
- **Vite** - Fast development and building
- **Console Forwarding** - Browser console logs forwarded to terminal for Claude Code integration
- **Playwright** - End-to-end testing and automation
- **Vitest** - Unit testing framework
- **ESLint** - Code quality and consistency

## Quickstart

### Prerequisites

1. **Azure CLI**: Install and configure the Azure CLI
   ```bash
   # Install Azure CLI (if not already installed)
   # On macOS: brew install azure-cli
   # On Windows: winget install Microsoft.AzureCLI
   # On Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Login to Azure
   az login
   ```

2. **Dataverse Environment Access**: You need access to a Dataverse environment (Power Platform/Dynamics 365)
   - Ensure you have the appropriate permissions in your Dataverse environment
   - Note your environment URL (e.g., `https://yourorg.crm.dynamics.com/`)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Kristoffer88/dataverse-agent-playground
   cd dataverse-agent-playground
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your Dataverse environment details
   # At minimum, set DATAVERSE_URL to your environment URL
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to `http://localhost:5173`**

## Available Scripts

- `npm run dev` - Start development server with console forwarding and smart process management (prevents duplicate servers)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI mode
- `npm run test:e2e:headed` - Run Playwright tests in headed mode

## Claude Code Integration

This playground is optimized for AI-assisted development with Claude Code:

- **Console Forwarding**: Browser console logs are automatically forwarded to the terminal, enabling Claude Code to read and analyze frontend logs directly
- **Smart Dev Server Management**: The custom dev script prevents launching duplicate development servers, avoiding port conflicts during AI-assisted development sessions
- **Enhanced Debugging**: Real-time console output in terminal improves Claude Code's ability to diagnose and fix issues

## Testing & Automation

This project includes both unit tests (Vitest) and end-to-end tests (Playwright) for exploring automated testing patterns with Dataverse.

**Unit Tests:**
```bash
npm run test
```

**End-to-End Tests:**
```bash
npm run test:e2e
```

## Related Projects

- [dataverse-utilities](https://github.com/Kristoffer88/dataverse-utilities) - Main utility library for Power Platform development

## Contributing

This is an experimental playground - feel free to explore, break things, and try new approaches!
