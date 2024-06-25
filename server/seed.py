from config import app, db
from models import User, Role, Course, Discipline, Level, Student, Gender, StudentReport, CourseReport, Placement, Suggestion, Template, Email, Users_Courses, Users_Roles, Students_Courses
from random import choice
from faker import Faker
from datetime import datetime

fake = Faker()

if __name__ == "__main__":
  with app.app_context():
    
    def create_user(first_name, last_name, email_address, password):
      user = User(first_name=first_name, last_name=last_name, email_address=email_address)
      user.password_hash = password
      db.session.add(user)
      db.session.commit()

    def create_roles():
      roles = [
        Role(name="Instructor", description="Can edit reports"),
        Role(name="Admin", description="Full access, create, and edit all data")
      ]
      db.session.add_all(roles)

    def create_user_role_assignments():
      users = User.query.all()
      roles = Role.query.all()
      for user in users:
        user.roles.append(choice(roles))

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
          if student not in course.students:
            course.students.append(student)

    def create_instructor_assignments():
      instructors = User.query.all()
      courses = Course.query.all()
      for course in courses:
        for i in range(choice([1,2])):
          instructor = choice(instructors)
          if instructor not in course.users:
            course.users.append(instructor)

    def create_student_reports():
      students = Student.query.all()
      courses = Course.query.all()
      for student in students:
        for course in courses:
          student_reports = StudentReport(
            student_id=student.id,
            user_id=course.users[0].id,
            course_id=course.id,
            content="Write your report here",
            date=datetime.now(),
            approved=False
          )
          db.session.add(student_reports)

    def create_course_reports():
      courses = Course.query.all()
      for course in courses:
        report = CourseReport(
          course_id = course.id,
          user_id = course.users[0].id,
          content = "Write your report here",
          date = datetime.now(),
          approved = False
        )
        course.course_reports.append(report)

    def create_placements():
      students = Student.query.all()
      for student in students:
        for course in student.courses:
          new_course = None
          if course.level.name != "Elementary" and course.level.name != "Middle/High School":
            if course.level.name != "8":
              new_course = Course.query.filter_by(name = f'{course.discipline.name} {(int(course.level.name) + 1)}').first()
            else:
              new_course = course
          else:
            new_course = course
          placement = Placement(
            student_id = student.id,
            course_id = new_course.id,
            date = datetime.now()
          )
          db.session.add(placement)

    def create_suggestions():
      disciplines = Discipline.query.all()
      for discipline in disciplines:
        elementary_level = Level.query.filter_by(name="Elementary").first()
        middle_high_level = Level.query.filter_by(name="Middle/High School").first()
        elementary_suggestion = Suggestion(
          course_id = Course.query.filter_by(discipline=discipline, level=elementary_level).first().id,
          discipline_id = discipline.id,
          level_id = elementary_level.id
        )
        db.session.add(elementary_suggestion)
        middle_high_suggestion = Suggestion(
          course_id = Course.query.filter_by(discipline=discipline, level=middle_high_level).first().id,
          discipline_id = discipline.id,
          level_id = middle_high_level.id
        )
        db.session.add(middle_high_suggestion)



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
    db.session.query(Users_Courses).delete()
    db.session.query(Users_Roles).delete()
    db.session.query(Students_Courses).delete()
    db.session.commit()

    print("Creating users...")
    for i in range(10):
      create_user(fake.first_name(), fake.last_name(), fake.email(), "password")

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

    print("Assigning instructors to courses...")
    create_instructor_assignments()
    db.session.commit()

    print("Assigning roles to users...")
    create_user_role_assignments()
    db.session.commit()

    print("Creating student reports...")
    create_student_reports()
    db.session.commit()

    print("Creating course reports...")
    create_course_reports()
    db.session.commit()

    print("Creating placements...")
    create_placements()
    db.session.commit()

    print("Creating suggestions...")
    create_suggestions()
    db.session.commit()