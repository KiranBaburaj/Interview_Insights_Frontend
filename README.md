# Interview_Insights_Frontend

# Interview Insights - Frontend

**Interview Insights** is a comprehensive job portal designed to empower job seekers and employers alike by offering a platform where users can share interview experiences, provide feedback, and engage in direct communication. This project includes real-time chat functionality and future enhancements like video calls and AI integration.

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Project Description

Interview Insights is a platform that enables job seekers to:
- Share their interview experiences, even if they don't land the job.
- Receive valuable feedback from employers on their previous interviews.
- Showcase feedback on their profile, making them more attractive to potential employers.

Employers can use the platform to:
- Share feedback on interviews with candidates.
- Review past performances of candidates when they reapply.

The platform also supports direct chat between job seekers and employers, with future features planned for video calls and AI-powered insights.

## Features

- **Authentication**: Secure login using Google OAuth2 ,JWT.
- **Job Listings**: Search and filter job opportunities.
- **Interview Feedback**: Post and view interview feedback from employers.
- **Chat**: Real-time chat functionality between job seekers and employers.
- **Notification System**: Real-time notifications for chat and interview feedback.
- **Profile Management**: Job seekers can showcase their feedback and experiences.
- **Responsive Design**: Optimized for both desktop and mobile use.
- **Search and Filter**: Advanced filtering for job listings to match skills and location.

## Tech Stack

### Frontend:
- **React.js**: Core library for building the user interface.
- **Material-UI (MUI)**: For responsive UI components and styling.
- **Axios**: For making HTTP requests to the backend API.
- **WebSockets**: Real-time chat functionality using Django Channels and WebSockets.
- **Redux Toolkit**: State management for handling complex UI interactions.

### Backend:
The backend for this project is handled by a separate repository built using **Django REST Framework** and **Django Channels**. You can find the backend repository [here](https://github.com/KiranBaburaj/Interview_Insights_Backend).

## Setup and Installation

To run this project locally, follow these steps:

### Prerequisites:
- **Node.js** and **npm** installed on your machine.
- The backend should be running on your local machine or deployed to a server.

### Clone the repository:

```bash
git clone https://github.com/KiranBaburaj/Interview_Insights_Frontend.git
cd Interview_Insights_Frontend




### Install dependencies:

```bash
npm install
```

### Environment Variables:

Create a `.env` file at the root of the project and add the following environment variables:

```env
REACT_APP_BACKEND_URL=http://localhost:8000 # or your deployed backend URL
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Run the application:

```bash
npm start
```

This will start the frontend on `http://localhost:3000`. Ensure that the backend is running on the configured URL.

## Usage

Once the app is running, you can:
1. Register or sign in using Google OAuth.
2. Search for jobs using the filter and search functionality.
3. Engage in chat with employers.
4. View interview feedback from employers and showcase it on your profile.

## Folder Structure

The folder structure of the frontend is organized as follows:

```
Interview_Insights_Frontend/
├── public/                     # Public assets
├── src/                        # Source code
│   ├── components/             # Reusable components
│   ├── pages/                  # Page components
│   ├── services/               # API and WebSocket services
│   ├── store/                  # Redux Toolkit store configuration
│   ├── utils/                  # Utility functions
│   ├── App.js                  # Main App component
│   └── index.js                # Entry point of the application
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## Future Enhancements

- **Video Call Integration**: Enable video calls between job seekers and employers.
- **AI-Powered Insights**: Provide AI-based suggestions for job seekers based on their profiles.
- **Skill Assessment Tests**: Implement tests for candidates to assess their skills directly on the platform.

## Contributing

We welcome contributions! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
