from config import app, db
from models import User, Role, Course, Discipline, Level, Student, Gender, StudentReport, CourseReport, Placement, Suggestion, Template, Email
from random import choice
from faker import Faker

fake = Faker()

if __name__ == "__main__":
  with app.app_context():
    
    def create_user(first_name, last_name, email_address, password):
      user = User(first_name=first_name, last_name=last_name, email_address=email_address)
      user.password_hash = password
      db.session.add(user)

    print("Clearing database...")
    db.session.query(User).delete()
    db.session.query(Role).delete()
    db.session.query(Course).delete()
    db.session.query(Discipline).delete()
    db.session.query(Level).delete()
    db.session.query(Student).delete()
    db.session.query(Gender).delete()
    db.session.query(StudentReport).delete()
    db.session.query(CourseReport).delete()
    db.session.query(Placement).delete()
    db.session.query(Suggestion).delete()
    db.session.query(Template).delete()
    db.session.query(Email).delete()
    db.session.commit()

    print("Creating users...")
    for i in range(10):
      create_user(fake.first_name(), fake.last_name(), fake.email(), fake.password(length=10))

    db.session.commit()