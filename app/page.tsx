import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/auth";

export default async function Home() {
  const user = await getLoggedInUser();

  return (
    <>
      <header className="w-full border-b">
        <nav className="max-w-4xl mx-auto flex justify-between items-center py-2 px-4">
          <h1 className="font-bold">
            <Link href="/app">Appwrite NextJS Starter</Link>
          </h1>
          {user ? (
            <Button asChild>
              <Link href="/app">Go to App</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          )}
        </nav>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            🚀 Appwrite NextJS Starter
          </h1>
          <p className="text-lg text-slate-600">
            A Next.js starter template pre-configured with Appwrite,
            authentication flows, and Tailwind CSS.
          </p>
        </header>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">📚</span> Overview
          </h2>
          <div className="space-y-4">
            <p className="text-slate-600">
              This starter template provides everything you need to build a
              modern web application with Next.js and Appwrite. It includes a
              full authentication system, user profile management, and a clean,
              responsive UI.
            </p>
            <p className="text-slate-600">
              Perfect for quickly bootstrapping your next project without
              spending time on repetitive setup tasks.
            </p>
          </div>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">✨</span> Features
          </h2>
          <ul className="space-y-6">
            <li>
              <div className="flex items-start">
                <span className="mr-2 text-xl">🔐</span>
                <div className="flex-1">
                  <h3 className="font-bold">Authentication Flows</h3>
                  <ul className="mt-2 ml-6 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">📧</span>
                      Email & Password Sign In/Sign Up
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🔄</span>
                      Password Recovery Process
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🔑</span>
                      OAuth Integration (GitHub, Google, etc.)
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-start">
                <span className="mr-2 text-xl">📊</span>
                <div className="flex-1">
                  <h3 className="font-bold">Data Management</h3>
                  <ul className="mt-2 ml-6 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">✏️</span>
                      Complete CRUD Operations Examples
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🗄️</span>
                      Database Integration with Appwrite
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📁</span>
                      File Storage Implementations
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-start">
                <span className="mr-2 text-xl">👤</span>
                <div className="flex-1">
                  <h3 className="font-bold">User Management</h3>
                  <ul className="mt-2 ml-6 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">👨‍💻</span>
                      Profile Editing & Customization
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-start">
                <span className="mr-2 text-xl">📋</span>
                <div className="flex-1">
                  <h3 className="font-bold">General</h3>
                  <ul className="mt-2 ml-6 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">🛡️</span>
                      Protected Routes
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🏗️</span>
                      Next.js 15 App Router
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🎨</span>
                      Tailwind CSS for Styling
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📱</span>
                      Responsive Design
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🧩</span>
                      Modular Component Architecture
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">📋</span> Prerequisites
          </h2>

          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <span className="text-xl">📦</span>
              <a
                href="https://nodejs.org/en/download"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Node.js 22.x or later
              </a>
            </li>

            <li className="flex items-center space-x-3">
              <span className="text-xl">🔧</span>
              <a
                href="https://pnpm.io/"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                pnpm
              </a>
            </li>

            <li className="flex items-center space-x-3">
              <span className="text-xl">☁️</span>
              <a
                href="https://cloud.appwrite.io"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Appwrite
              </a>
            </li>
          </ul>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">⚙️</span> Installation
          </h2>
          <ol className="list-decimal space-y-6">
            <li className="flex flex-col">
              <p className="mb-2">Clone this repository:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono">
                  git clone
                  https://github.com/diswasher-detergent/appwrite-nextjs-starter.git
                </code>
              </div>
            </li>
            <li className="flex flex-col">
              <p className="mb-2">Navigate to the project:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono">
                  cd appwrite-nextjs-starter
                </code>
              </div>
            </li>
            <li className="flex flex-col">
              <p className="mb-2">Install dependencies:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono">pnpm install</code>
              </div>
            </li>
            <li className="flex flex-col">
              <p className="mb-2">
                Create a{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code>{" "}
                file based on the{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  .env.sample
                </code>{" "}
                file:
              </p>
              <div className=" mt-2">
                <p className="flex items-center">
                  <span className="mr-2">•</span>
                  Create an API key in Appwrite, with the permissions{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    session.write
                  </code>{" "}
                  and update the{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code>{" "}
                  with that key.
                </p>
              </div>
            </li>
            <li className="flex flex-col">
              <p className="mb-2">Start the development server:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 font-mono">pnpm run dev</code>
              </div>
            </li>
            <li className="flex flex-col">
              <p className="mb-2">
                Open{" "}
                <a
                  href="http://localhost:3000"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  http://localhost:3000
                </a>{" "}
                in your browser to see the application.
              </p>
            </li>
          </ol>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">🚢</span> Deploying Project using the
            Appwrite CLI
          </h2>
          <p className="mb-4">
            <a
              href="https://appwrite.io/docs/tooling/command-line/installation"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Appwrite CLI
            </a>{" "}
            allows you to automate and streamline your Appwrite workflows.
          </p>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📥</span> Installation
              </h3>
              <ol className="list-decimal space-y-2">
                <li>
                  <p className="mb-2">Install the Appwrite CLI globally:</p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400">
                      npm install -g appwrite-cli
                    </code>
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🔧</span> Setup
              </h3>
              <ol className="list-decimal space-y-2">
                <li>
                  <p className="mb-2">Login to your Appwrite account:</p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400">appwrite login</code>
                  </div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🚀</span> Push to Appwrite
              </h3>
              <ol className="list-decimal space-y-4">
                <li>
                  <p className="mb-2">Deploy the project:</p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400">
                      appwrite push settings
                    </code>
                  </div>
                </li>
                <li>
                  <p className="mb-2">Deploy the database:</p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400">
                      appwrite push collections
                    </code>
                  </div>
                </li>
                <li>
                  <p className="mb-2">Deploy the bucket:</p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400">
                      appwrite push buckets
                    </code>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">🔑</span> Adding GitHub OAuth to Appwrite
          </h2>
          <p className="mb-4">
            To enable GitHub authentication in your Appwrite project:
          </p>
          <ol className="list-decimal space-y-6 ">
            <li className="flex items-start">
              <span className="mr-2">🔗</span>
              <span>
                Go to your
                <a
                  href="https://github.com/settings/apps"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  GitHub Developer Settings
                </a>
                and create a new App.
              </span>
            </li>
            <li className="flex items-start">
              <div>
                <p className="mb-2">
                  Set the{" "}
                  <strong className="font-semibold">
                    Authorization callback URL
                  </strong>{" "}
                  to:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                  https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/appwrite-nextjs-starter
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span>
                After creating the OAuth App, you'll receive a{" "}
                <strong className="font-semibold">Client ID</strong> and need to
                generate a{" "}
                <strong className="font-semibold">Client Secret</strong>.
              </span>
            </li>
            <li className="flex items-start">
              <span>
                In your Appwrite Console, navigate to{" "}
                <strong className="font-semibold">Auth</strong> →{" "}
                <strong className="font-semibold">Settings</strong> →{" "}
                <strong className="font-semibold">OAuth2 Providers</strong>.
              </span>
            </li>
            <li className="flex items-start">
              <span>
                Enable the GitHub provider and enter the{" "}
                <strong className="font-semibold">Client ID</strong> and{" "}
                <strong className="font-semibold">Client Secret</strong> from
                GitHub.
              </span>
            </li>
            <li className="flex items-start">
              <span>Save your changes.</span>
            </li>
          </ol>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">🧠</span> Learn More
          </h2>
          <div className="space-y-6">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border hover:border-blue-500 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">
                Next.js Documentation
              </h3>
              <p className="text-slate-600">
                Learn about Next.js features and API.
              </p>
            </a>
            <a
              href="https://appwrite.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border hover:border-blue-500 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">
                Appwrite Documentation
              </h3>
              <p className="text-slate-600">
                Learn about Appwrite services and SDKs.
              </p>
            </a>
          </div>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">🤝</span> Contributing
          </h2>
          <p className="text-slate-600">
            Contributions are welcome! Feel free to open issues and submit pull
            requests.
          </p>
        </section>
        <section className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">📃</span> License
          </h2>
          <p className="text-slate-600">
            This project is licensed under the MIT License - see the LICENSE
            file for details.
          </p>
        </section>
        <footer className="text-center text-sm text-slate-600 pt-6 border-t">
          <p>© 2025 Appwrite NextJS Starter - MIT License</p>
        </footer>
      </div>
    </>
  );
}
