# Laract: Blog Platform

## 🚀 About the Project
**Laract** is a modern and dynamic blogging platform built with:
- **Laravel 12** (Backend)
- **React** (Frontend) using Inertia.js
- **Tailwind CSS** (Styling)


## ✨ Features
- 📝 Create, edit, and delete blog posts
- 💬 Commenting And Like system
- 🔐 User authentication with Laravel Breeze & Inertia.js
- 🌙 Dark mode support
- 🏗️ Admin panel for managing blog posts

## 📌 Installation Guide

### Prerequisites
Ensure you have the following installed:
- PHP 8.2+
- Composer
- Node.js & npm
- MySQL or SQLite

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/DarshilNaliyapara/Laract.git
cd Laract
```

### 2️⃣ Install Dependencies
```sh
composer install
npm install
```

### 3️⃣ Set Up Environment
```sh
cp .env.example .env
```
Configure your database & Pusher credentials in the `.env` file.

### 4️⃣ Generate Application Key
```sh
php artisan key:generate
```

### 5️⃣ Run Migrations 
```sh
php artisan migrate 
```

### 6️⃣ Start the Development Server
```sh
php artisan serve
npm run dev
```

## 🔧 Configuration
- Update `.env` with your **Database credentials**.
- ensure it's running: `php artisan queue:work`.

## 🖥️ Frontend Setup
The frontend is built with **React** and **Inertia.js**. To run it separately:
```sh
cd resources/js
npm install
npm run dev
```

## 📷 Screenshots
![Homepage Screenshot](Screenshots/Home.png)
![Commenting System](Screenshots/Blog_Comment.png)

## 📜 License
This project is licensed under the [MIT License](LICENSE).

## 🙌 Contributing
Pull requests are welcome! Please follow the standard contribution guidelines.

## 📧 Contact
For any inquiries, reach out to [your-email@example.com](mailto:your-email@example.com).

