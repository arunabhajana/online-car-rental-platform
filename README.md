# 🚗 BookCars - Car Rental Platform

BookCars is a modern car rental platform that allows users to list, browse, and book cars with ease. It features real-time search, user authentication, and an intuitive booking experience.



## 📌 Features

- ✅ Role Based User Authentication – Sign up, log in, and manage accounts.
- ✅ List Cars – Owners can create listings for their cars with details like price, fuel type, and availability.
- ✅ Booking System – Users can book cars based on flexible pricing (hourly, daily, weekly, monthly).
- ✅ Real-time Search – Find cars with a smart search bar (Cmd + K / Ctrl + K).
- ✅ Responsive UI – Optimized for mobile and desktop.
- ✅ Secure Payments – Integration with a payment gateway (future feature).
- ✅ Admin Dashboard - Monitor the users , listings & bookings.
- ✅ Email Notifications - Sends Booking Confirmation Emails.


## 🛠️ Tech Stack

- Frontend: React.js, Tailwind CSS, React Router, DaisyUI
- Backend: Firebase (Firestore, Auth)
- State Management: React Context API
- Icons: React Icons


## 📂 Project Structure

```
📦 bookcars
 ┣ 📂 public
 ┣ 📂 src
 ┃ ┣ 📂 components
 ┃ ┃ ┣ 📜 Header.js
 ┃ ┃ ┣ 📜 SearchModal.js
 ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📜 HomePage.js
 ┃ ┃ ┣ 📜 ListingDetailsPage.js
 ┃ ┃ ┣ 📜 EditListingsPage.js
 ┃ ┃ ┣ 📜 LoginPage.js
 ┃ ┃ ┣ 📜 RegistrationPage.js
 ┃ ┃ ┣ 📜 ProfilePage.js
 ┃ ┃ ┣ 📜 SettingsPage.js
 ┃ ┃ ┣ 📜 ListingsPage.js
 ┃ ┃ ┣ 📜 SearchResultsPage.js
 ┃ ┣ 📂 context
 ┃ ┃ ┣ 📜 AuthContext.js
 ┃ ┣ 📂 firebaseConfig.js
 ┃ ┣ 📜 App.js
 ┃ ┣ 📜 index.js
 ┣ 📜 App.css
 ┣ 📜 Index.css
 ┣ 📜 .gitignore
 ┣ 📜 README.md
 ┣ 📜 package.json
 ┣ 📜 tailwind.config.js
```
## 🚀 Getting Started

### Clone the Repository
```
git clone https://github.com/arunabhajana/online-car-rental-platform.git
```
```
cd online-car-rental-platform
```
Install Dependencies
```
npm install
```
- Configure Firebase
- Create a Firebase project.
- Add Firestore , Authentication , Storage.
- Replace the firebaseConfig.js file with your Firebase credentials.

### Run the Project
```
npm run dev
```

## 🙌 Contributing

Want to improve BookCars? Feel free to fork, create a branch, and submit a PR.

1. Fork the repository.
2. Create a new branch (feature-branch).
3. Commit changes and push to your fork.
4. Open a pull request.

## 📜 License

This project is open-source under the MIT License.