# Dance School Management App

## Description

This is a web application for managing a dance school.
It allows a user with admin priveleges to create and manage:

- Users
- Students
  - Genders
- Courses
  - Disciplines
  - Levels
- Enrollments
- Progress Reports
- Placements
- Suggestion Rules
- Emails

## Installation

To install and run the project, follow these steps:

1. Clone the repository: `git clone https://github.com/mkennedyakgrown/dance-school-app`
2. Navigate to the project directory: `cd dance-school-app`
3. Install the dependencies: `pipenv install`
4. Activate the Virtual Environment: `pipenv shell`
5. Set up the database:
   - Navigate to the server directory: `cd server`
   - Initialize the SqlAlchemy database with `flask db init`
   - Migrate the database with `flask db migrate -m "Initial migration"`
   - Update the `DATABASE_URI` in the `.env` file with your database credentials
6. Run the migrations: `flask db upgrade`
7. Start the server: `python app.py`
8. Install the client side dependencies:
   - IN A NEW TAB, navigate to the client directory: `cd ..` || `cd client`
   - Install the dependencies: `npm install`
   - Activate the Virtual Environment: `npm start`

## Usage

Once the project is installed and running, you can access the web application by opening your web browser and navigating to `http://localhost:5173`.

Here are some key features and functionality of the application:

- **User Management**: Create and manage users. Each user can have multiple roles, courses, and reports.
- **Course Management**: Add and manage courses. Each course belongs to a discipline and a level, and can have multiple students and users (instructors).
- **Student Management**: Add and manage students.
- **Progress Report Management**: Create and manage progress reports. Instructors can view and write reports for their courses and students, while Admins can view and edit all reports.
- **Email Creation**: Compile and edit emails for students, including their Placements, Course Suggestions, and Progress Reports. Emails are editable by admins, and track approval status.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue on the GitHub repository. Pull requests are also welcome.

## Technologies Used

- Python
- Flask
- SQLAlchemy
- HTML/CSS
- JavaScript
  - React
  - Lexical
  - React Semantic UI

## License

This project is licensed under the [MIT License](LICENSE).
