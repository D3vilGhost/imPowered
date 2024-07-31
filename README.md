# imPowered

Welcome to imPowered, a web platform designed to assist disabled individuals by providing essential information on accessibility features at various locations. This second version of imPowered offers a better user interface and faster response times.

## Features

### 1. Search Bar
- **Functionality**: Users can search by location and destination type.
- **Purpose**: To get information about the accessibility features available at the places they intend to visit.

### 2. Registration Form
- **Functionality**: Users can register themselves on the platform.
- **Purpose**: To create a profile that can be searched by others.

### 3. Login Page
- **Functionality**: Allows users to log in and access their dashboard.
- **Dashboard Capabilities**:
  - **Update Details**: Users can update their personal and accessibility feature details.
  - **Delete Account**: Users can permanently delete their account if they wish.

## Improvements in Version 2
- Enhanced user interface for a more intuitive and user-friendly experience.
- Optimized backend for faster response times and improved performance.
- OTP-based email verification during registration to ensure genuine registered entities.

## How To Run Locally:
1. Clone the repository:  
    git clone https://github.com/D3vilGhost/imPowered

2. Install dependencies:
   - npm install
   - set environmental variables

3. Start the development server: 
    - npm run dev

4. Open your web browser and navigate to: localhost:3000.

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
MONGODB_URI=your_mongodb_uri
PORT=3000
JWT_SECRET=your_jwt_secret
MAIL_ID=your_email@gmail.com 
MAIL_PASSWORD=your_appliction_password_for_same_mail
```

## Contributing

We welcome contributions to improve imPowered! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

---

Thank you for using imPowered, and we hope it makes a positive impact on your journey!


