# 🛒 E-Commerce Platform

## ✨ **Project Overview:**

This project is a comprehensive e-commerce platform, incorporating various features such as user authentication, product management, cart functionality, order processing, and more. It is structured into different modules including controllers, models, middlewares, routes, and utilities.

## 📂 **Repository Structure:**

- `.env`
- `.prettierrc`
- `package.json`
- `README.md`
- `src/`
  - `controllers/`
    - `auth.controller.js`
    - `cart.controller.js`
    - `category.controller.js`
    - `images.controller.js`
    - `order.controller.js`
    - `product.controller.js`
    - `subcategory.controller.js`
    - `user.controller.js`
    - `version.controller.js`
  - `middlewares/`
    - `checkPermission.js`
    - `uploadStorage.js`
  - `models/`
    - `cart.model.js`
    - `category.model.js`
    - `order.model.js`
    - `product.model.js`
    - `subcategory.model.js`
    - `user.model.js`
    - `version.model.js`
  - `routes/`
  - `server.js`
  - `uploads/`
  - `utils/`
  - `validation/`

## 🚀 **Getting Started:**

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites:**

- Node.js
- npm

### **Cloning the Repository:**

To clone the repository and run the application on your local machine, follow these steps:

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the directory of the project
cd <project-directory>

# Install the dependencies
npm install
```

### **Setting up the Environment Variables:**

Setting up the environment variables is crucial for the application to run successfully. Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
# Environment variables
APP_PORT = 3000
URL_CLIENT = 'http://localhost:5173'
URL_ADMIN = 'http://localhost:3001'

# Connection string to MongoDB
MONGO_ATLAS_URI = 'mongodb://localhost:27017/ecommerce'

# JWT secret key
JWT_ACCESS_TOKEN = 'myaccesstoken'
JWT_REFRESH_TOKEN = 'myrefreshtoken'
JWT_ACCOUNT_VERIFY = 'myaccountverify'

# Google and Facebook OAuth
GOOGLE_CLIENT_ID = '105013000000000000000'
GOOGLE_CLIENT_SECRET = '000000000000000000000000'
FACEBOOK_APP_ID = '000000000000000'
FACEBOOK_APP_SECRET = '000000000000000000000000'

# Email
NAME=smtp.gmail.com
HOST=smtp.gmail.com
SERVICE=gmail
USER=youremail
PASS=yourpassword
```

> **Note**: Replace the values of the environment variables with your own values. If you want to use my `.env` file for testing purposes, please contact me at gmail: longvan1173@gmail.com

### **Running the Application:**

To start the application, run the following command in your terminal:

```bash
npm run start
```

This will start the server and the application should be up and running on your local machine.
