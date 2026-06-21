# Installing Node.js for ReelLife

ReelLife backend requires Node.js (v18 or higher) to run. This guide will help you install it.

---

## 🍎 macOS Installation

### Option 1: Homebrew (Recommended)

Homebrew is the easiest way to install Node.js on macOS.

**Step 1: Install Homebrew (if not installed)**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install Node.js**
```bash
brew install node
```

**Step 3: Verify Installation**
```bash
node --version
npm --version
```

You should see version numbers like:
```
v20.11.0
10.2.4
```

---

### Option 2: Official Installer

**Step 1: Download**
- Visit: https://nodejs.org/
- Download the **LTS (Long Term Support)** version for macOS
- Look for the `.pkg` installer

**Step 2: Install**
- Open the downloaded `.pkg` file
- Follow the installation wizard
- Accept the license agreement
- Click "Install"

**Step 3: Verify**
Open Terminal and run:
```bash
node --version
npm --version
```

---

### Option 3: NVM (Node Version Manager)

NVM lets you install and switch between multiple Node.js versions.

**Step 1: Install NVM**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Step 2: Restart Terminal**
Close and reopen your terminal, or run:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

**Step 3: Install Node.js**
```bash
nvm install --lts
nvm use --lts
```

**Step 4: Verify**
```bash
node --version
npm --version
```

---

## 🐧 Linux Installation

### Ubuntu/Debian

```bash
# Update package index
sudo apt update

# Install Node.js from NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### CentOS/RHEL/Fedora

```bash
# Install Node.js from NodeSource
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs

# Verify
node --version
npm --version
```

---

## 🪟 Windows Installation

### Option 1: Official Installer

**Step 1: Download**
- Visit: https://nodejs.org/
- Download the **LTS** version for Windows
- Choose the `.msi` installer (64-bit)

**Step 2: Install**
- Run the downloaded installer
- Accept the license
- Use default settings
- Click "Install"

**Step 3: Verify**
Open Command Prompt or PowerShell:
```bash
node --version
npm --version
```

### Option 2: Chocolatey

If you have Chocolatey package manager:
```bash
choco install nodejs-lts
```

---

## ✅ Verify Installation

After installing Node.js, verify it works:

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Test Node.js
node -e "console.log('Node.js is working!')"
# Expected: Node.js is working!
```

---

## 🚀 After Installation

Once Node.js is installed, you can start the ReelLife backend:

```bash
# Navigate to project
cd /Users/rosie/Work/ReelLife

# Run the development script
./start-dev.sh
```

The script will:
1. ✅ Detect Node.js is installed
2. 📦 Install dependencies automatically
3. 🚀 Start the server at http://localhost:3000

---

## 🔧 Troubleshooting

### "node: command not found" after installation

**Cause:** Terminal hasn't picked up the new PATH

**Solution:**
```bash
# Close and reopen your terminal, or run:
source ~/.zshrc     # if using zsh
source ~/.bashrc    # if using bash

# Or restart your computer
```

---

### "npm: command not found" but Node.js is installed

**Cause:** npm wasn't included in the installation

**Solution:**
```bash
# Reinstall Node.js using one of the methods above
# npm is always included with official Node.js installers
```

---

### Permission errors when running npm

**Cause:** npm global directory has wrong permissions

**Solution (macOS/Linux):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
# See Option 3 in macOS section
```

---

### Check which Node.js you're using

```bash
# Show Node.js path
which node

# Show npm path
which npm

# Show Node.js version
node --version
```

---

## 📚 Additional Resources

**Official Documentation:**
- Node.js: https://nodejs.org/
- npm: https://www.npmjs.com/

**Version Managers:**
- nvm (Node Version Manager): https://github.com/nvm-sh/nvm
- fnm (Fast Node Manager): https://github.com/Schniz/fnm

**Package Managers:**
- Homebrew (macOS): https://brew.sh/
- Chocolatey (Windows): https://chocolatey.org/

---

## 🎯 Recommended Version

For ReelLife, we recommend:
- **Node.js**: v18 LTS or higher
- **npm**: v9 or higher

To check if your version is compatible:
```bash
node --version
# v18.0.0 or higher ✅
# v16.x.x ⚠️ might work but not recommended
# v14.x.x or lower ❌ too old
```

---

## 🔄 Updating Node.js

### If installed via Homebrew:
```bash
brew update
brew upgrade node
```

### If installed via nvm:
```bash
nvm install --lts
nvm use --lts
```

### If installed via installer:
Download and run the latest installer from https://nodejs.org/

---

**After installing Node.js, return to [API_SETUP.md](API_SETUP.md) to continue setup!**
