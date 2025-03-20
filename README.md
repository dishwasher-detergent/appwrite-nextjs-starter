# 🚀 Appwrite NextJS Starter

A starter template for building web applications with Next.js and Appwrite.

## 📚 Overview

This starter template provides everything you need to build a
modern web application with Next.js and Appwrite. It includes a
full authentication system, user profile management, and a clean,
responsive UI.

Perfect for quickly bootstrapping your next project without
spending time on repetitive setup tasks.

## ✨ Features

- 🔐 **Authentication Flows**
  - 📧 Email & Password Sign In/Sign Up
  - 🔄 Password Recovery Process
  - 🔑 OAuth Integration (GitHub, Google, etc.)
- 📊 **Data Management**
  - ✏️ Complete CRUD Operations Examples
  - 📁 File Storage Implementations
  - ⚡ Realtime Updates
  - 🔄 Cache Invalidation
- 👥 **Team Management**
  - 🏢 Create and Manage Teams
  - 👥 Invite Team Members
  - 👑 Role-based Permissions (Owner, Admin, Member)
  - 🚪 Join/Leave Teams
  - 🔒 Team-specific Content Access
- 👤 **User Management**
  - 👨‍💻 Profile Editing & Customization
  - 🔗 Team Affiliations
- 📋 **General**
  - 🛡️ Protected Routes
  - 🎨 TailwindCSS
  - 📱 Responsive Design

## 📋 Prerequisites

- 📦 [Node.js 22.x or later](https://nodejs.org/en/download)
- 🔧 [pnpm](https://pnpm.io/)
- ☁️ [Appwrite](https://cloud.appwrite.io)

## ⚙️ Installation

1. Clone this repository:

```bash
git clone https://github.com/diswasher-detergent/appwrite-nextjs-starter.git
```

2. Navigate to the project:

```bash
cd appwrite-nextjs-starter
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on the .`env.sample` file:

   - Create an API key in Appwrite, with the permissions `session.write` and upadte the `.env` with that key.

4. Start the development server:

```bash
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🚢 Deploying Project using the Appwrite CLI

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

### 🚀 Push to Appwrite

1. Deploy the project:

```bash
appwrite push settings
```

2. Deploy the database:

```bash
appwrite push collections
```

3. Deploy the bucket:

```bash
appwrite push buckets
```

## 🔑 Adding GitHub OAuth to Appwrite

1. 🔗 Go to your [GitHub Developer Settings](https://github.com/settings/apps) and create a new App.

2. 🔄 Set the **Authorization callback URL** to:

```
https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/appwrite-nextjs-starter
```

3. 🔐 After creating the OAuth App, you'll receive a **Client ID** and need to generate a **Client Secret**.

4. ⚙️ In your Appwrite Console, navigate to **Auth** → **Settings** → **OAuth2 Providers**.

5. ✅ Enable the GitHub provider and enter the **Client ID** and **Client Secret** from GitHub.

6. 💾 Save your changes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
