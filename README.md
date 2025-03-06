# 🚀 Appwrite NextJS Starter

A starter template for building web applications with Next.js and Appwrite.

## ✨ Features

- 🔐 **Authentication Flows**
  - 📧 Email & Password Sign In/Sign Up
  - 🔄 Password Recovery Process
  - 🔑 OAuth Integration (GitHub, Google, etc.)
- 📊 **Data Management**
  - ✏️ Complete CRUD Operations Examples
  - 🗄️ Database Integration with Appwrite
  - 📁 File Storage Implementations
- 👤 **User Management**
  - 👨‍💻 Profile Editing & Customization
  - 🔒 User Preferences & Settings
- 🛡️ Protected Routes
- 🏗️ Next.js 15 App Router
- 🎨 Tailwind CSS for Styling
- 📱 Responsive Design
- 🧩 Modular Component Architecture

## 🏁 Getting Started

### 📋 Prerequisites

- 📦 [Node.js 22.x or later](https://nodejs.org/en/download)
- 🔧 [pnpm](https://pnpm.io/)
- ☁️ [Appwrite](https://cloud.appwrite.io)

### 🛠️ Installation

1. Clone this repository:

```bash
git clone https://github.com/diswasher-detergent/appwrite-nextjs-starter.git
cd appwrite-nextjs-starter
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

4. Start the development server:

```bash
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔑 Adding GitHub OAuth to Appwrite

To enable GitHub authentication in your Appwrite project:

1. 🔗 Go to your [GitHub Developer Settings](https://github.com/settings/apps) and create a new App.

2. 🔄 Set the **Authorization callback URL** to:

```
https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/appwrite-nextjs-starter
```

3. 🔐 After creating the OAuth App, you'll receive a **Client ID** and need to generate a **Client Secret**.

4. ⚙️ In your Appwrite Console, navigate to **Auth** → **Settings** → **OAuth2 Providers**.

5. ✅ Enable the GitHub provider and enter the **Client ID** and **Client Secret** from GitHub.

6. 💾 Save your changes.

## 🚢 Deploying Using the Appwrite CLI

[Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation) allows you to automate and streamline your Appwrite workflows.

### 📥 Installation

Install the Appwrite CLI globally:

```bash
npm install -g appwrite-cli
```

### 🔧 Setup

1. Login to your Appwrite account:

```bash
appwrite login
```

### 🚀 Deploy

```bash
appwrite push settings
appwrite push collections
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
