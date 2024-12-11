# HireHub - Job Hunt Platform  

**HireHub** is a full-stack web application designed to bridge the gap between recruiters and job seekers. Built with the MERN stack and styled using Tailwind CSS, HireHub provides a dynamic and intuitive platform for managing job applications and postings.  

## Features  

### 1. Role-Based Signup and Login  
- **Recruiters**: Create accounts to post jobs, manage company profiles, and view applicants for their job openings.  
- **Users (Job Seekers)**: Sign up to explore job listings, manage personal profiles, and apply for relevant roles.  
- **Role-Based Authorization**: Restrict access to recruiter functionalities and job seeker functionalities based on user roles.  

### 2. Recruiter Functionality  
- **Company Profile Management**: Recruiters can add and update company details, including name, description, logo, and website link.  
- **Job Postings**: Easily create job listings with details like job title, location, technology stack, stipend/salary, and experience level.  
- **View Applicants**: Recruiters can view a list of applicants for each job posting, manage shortlisting, and track applicant status.  
- **Job Expiry Management**: Set job expiration dates for listings to automatically remove outdated job openings from the portal.  

### 3. User Functionality  
- **Job Listings**: Access all job openings posted by recruiters in a centralized view.  
- **Filters**: Narrow down job searches using filters for location, stipend/salary, required technologies, experience level, and job type (full-time, part-time, internship).  
- **Saved Jobs**: Users can save job listings for easy access and application later.  
- **Profile Management**:  
  - Upload and update personal details, required documents, and resumes.  
  - View and manage applied jobs in a dedicated section.  
  - Track application status (applied, under review, shortlisted, etc.).  
- **Job Applications**: Apply directly to relevant roles with just a few clicks.  

### 4. General Features  
- **Dynamic User Interface**: Built with React.js and styled with Tailwind CSS for a responsive and user-friendly experience.  
- **Secure Authentication**: Role-based authentication and session management using JSON Web Tokens (JWT).  
- **File Uploads**: Integration with **Multer** and **Cloudinary** for secure and efficient document storage (resumes, cover letters, etc.).  
- **Email Notifications**: Users and recruiters receive notifications for key actions such as job applications, new job postings, and application status updates.  
- **Job Recommendations**: Personalized job recommendations based on the user’s profile, previous applications, and saved job preferences.  

### 5. Admin Features  
- **Admin Dashboard**: A separate admin panel to monitor the overall activity on the platform, including job postings, applications, and user management.  
- **User Management**: Admins can manage users and recruiters, including banning or deleting accounts if necessary.  
- **Analytics**: Admins can view analytics such as the most applied jobs, most viewed jobs, and the number of active users.  

### 6. Performance and Security Features  
- **Real-Time Updates**: Job openings and applications are updated in real-time without page reloads, enhancing user experience.  
- **Data Encryption**: Sensitive user data is encrypted, ensuring privacy and security.  
- **Validation and Error Handling**: Comprehensive validation for user inputs and robust error handling across the application.  
- **Job Expiry Management**: Jobs automatically expire after a set duration, keeping the portal fresh and relevant.  
- **Mobile-Optimized**: The application is fully responsive, ensuring smooth access on both desktop and mobile devices.  

## Tech Stack  

### Frontend  
- **React.js**: For building the user interface and managing state.  
- **Tailwind CSS**: For modern, responsive, and customizable styling.  

### Backend  
- **Node.js**: For server-side logic and API development.  
- **Express.js**: For building RESTful APIs.  
- **MongoDB**: For storing user data, job listings, and applications.  

### Authentication and File Handling  
- **JWT**: For secure role-based authentication.  
- **Multer** and **Cloudinary**: For file uploads and media storage.  

### Email Notifications  
- **Nodemailer**: For sending email notifications related to job applications and recruiter updates.  


