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

    def create_roles():
      roles = [
        Role(name="Teacher", description="Can edit reports"),
        Role(name="Admin", description="Full access, create, and edit all data")
      ]
      db.session.add_all(roles)

    def create_student():
      student = Student(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        email_address=fake.email(),
        secondary_email_address=fake.email(),
        birth_date=fake.date_of_birth(),
        gender=Gender.query.all()[choice([0,1])]
      )
      db.session.add(student)

    def create_enrollment():
      students = Student.query.all()
      courses = Course.query.all()
      for course in courses:
        for i in range(choice([5,6,7,8,9,10])):
          student = choice(students)
          student.courses.append(course)

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

    print("Creating roles...")
    create_roles()

    print("Creating disciplines...")
    disciplines = [
      "Ballet",
      "Tap",
      "Jazz",
      "Hip Hop",
      "Lyrical",
      "Clogging",
      "Ballroom",
      "Contemporary",
      "Aerial Hammock",
      "Aerial Silks",
      "Lyra",
      "AcroJazz"
    ]
    for discipline in disciplines:
      db.session.add(Discipline(name=discipline))
    db.session.commit()

    print("Creating levels...")
    levels = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "Elementary",
      "Middle/High School"
    ]
    for level in levels:
      db.session.add(Level(name=level))
    db.session.commit()

    print("Creating courses...")
    for discipline in disciplines:
      for level in levels:
        db.session.add(Course(name=f'{discipline} {level}', discipline=Discipline.query.filter_by(name=discipline).first(), level=Level.query.filter_by(name=level).first()))
    db.session.commit()

    print("Creating genders...")
    genders = [
      "Male",
      "Female",
      "Other"
    ]
    for gender in genders:
      db.session.add(Gender(name=gender))
    db.session.commit()

    print("Creating students...")
    for i in range(50):
      create_student()
    db.session.commit()

    print ("Assigning students to courses...")
    create_enrollment()
    db.session.commit()