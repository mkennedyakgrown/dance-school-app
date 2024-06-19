from config import app, db
from models import User, Role, Course, Discipline, Level, Student, Gender, StudentReport, CourseReport, Placement, Suggestion, Template, Email
from random import choice


if __name__ == "__main__":
  with app.app_context():
    
    def create_user(first_name, last_name, email_address, password):
      user = User(first_name=first_name, last_name=last_name, email_address=email_address)
      user.password_hash = 
      db.session.add(user)
