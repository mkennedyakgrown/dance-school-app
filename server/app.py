from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from marshmallow import fields

from config import app, db, api, ma
from models import User, Role, Course, Discipline, Level, Student, Gender, StudentReport, CourseReport, Placement, Suggestion, Template, Email

class Login(Resource):

  def post(self):
    username = request.get_json()['username']
    user = User.query.filter(User.username == username).first()
    password = request.get_json()['password']
    if user is not None and user.authenticate(password) == True:
        session['user_id'] = user.id
        return user.to_dict(), 200
    else:
        return {'message': 'Username and password do not match any users'}, 401
    
class Logout(Resource):
   
  def delete(self):
    if session['user_id']:
        session['user_id'] = None
        return {'message': 'Successfully Logged Out'}, 200
    else:
        return {'message': 'You are not logged in'}, 401
      
class CheckSession(Resource):
   
  def get(self):
    user_id = session['user_id']
    if user_id:
        user = User.query.filter(User.id == user_id).first()
        return user.to_dict(), 200
    else:
        return {'message': 'You are not logged in'}, 401
      
class Users(Resource):
   
  def get(self):
    users = User.query.all()
    return users_schema.dump(users), 200
  
  def post(self):
    json = request.get_json()
    user = User(
        first_name=json.get('first_name'),
        last_name=json.get('last_name'),
        email_address=json.get('email_address')
    )
    user.password_hash = json.get('password', '')
    try:
        db.session.add(user)
        db.session.commit()
        user = User.query.filter(User.id == user.id).first()
        return user.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating user'}, 422
      
class UserById(Resource):
   
  def get(self, user_id):
    user = User.query.filter(User.id == user_id).first()
    return user_schema.dump(user), 200
  
  def patch(self, user_id):
    user = User.query.filter(User.id == user_id).first()
    json = request.get_json()
    if json.get('first_name'):
      user.first_name = json.get('first_name')
    if json.get('last_name'):
      user.last_name = json.get('last_name')
    if json.get('email_address'):
      user.email_address = json.get('email_address')
    if json.get('new_password') and json.get('current_password'):
      if user.authenticate(json.get('current_password')):
        user.password_hash = json.get('new_password')
      else:
         return {'message': 'Invalid current password'}, 401
    db.session.commit()

    user = User.query.filter(User.id == user.id).first()
    return user.to_dict(), 200

  def delete(self, user_id):
    user = User.query.filter(User.id == user_id).first()
    db.session.delete(user)
    db.session.commit()
    if session['user_id'] == user_id:
        session['user_id'] = None
    return {'message': 'User deleted'}, 200
  
class Roles(Resource):

  def get(self):
    return [role.to_dict() for role in Role.query.all()], 200
  
  def post(self):
    json = request.get_json()
    role = Role(
        name=json.get('name'),
        description=json.get('description')
    )
    try:
        db.session.add(role)
        db.session.commit()
        return role.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating role'}, 422
      
class RoleById(Resource):
   
  def get(self, role_id):
    role = Role.query.filter(Role.id == role_id).first()
    return role.to_dict(), 200
  
  def patch(self, role_id):
    role = Role.query.filter(Role.id == role_id).first()
    json = request.get_json()
    if json.get('name'):
      role.name = json.get('name')
    if json.get('description'):
      role.description = json.get('description')
    db.session.commit()
    return role.to_dict(), 200
  
  def delete(self, role_id):
    role = Role.query.filter(Role.id == role_id).first()
    db.session.delete(role)
    db.session.commit()
    return {'message': 'Role deleted'}, 200
  
class CourseReports(Resource):
   
  def get(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    return [report.to_dict() for report in course.reports], 200
  
  def post(self, course_id):
    json = request.get_json()
    course = Course.query.filter(Course.id == course_id).first()
    report = CourseReport(
        user_id=json.get('user_id'),
        course_id=json.get('course_id'),
        content=json.get('content'),
        date=json.get('date'),
        approved=json.get('approved')
    )
    try:
        db.session.add(report)
        db.session.commit()
        return report.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating report'}, 422
      
class StudentReports(Resource):
   
  def get(self, student_id):
    student = Student.query.filter(Student.id == student_id).first()
    return [report.to_dict() for report in student.reports], 200
  
  def post(self, student_id):
    json = request.get_json()
    student = Student.query.filter(Student.id == student_id).first()
    report = StudentReport(
        user_id=json.get('user_id'),
        student_id=json.get('student_id'),
        course_id=json.get('course_id'),
        content=json.get('content'),
        date=json.get('date'),
        approved=json.get('approved')
    )
    try:
        db.session.add(report)
        db.session.commit()
        return report.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating report'}, 422
    
class CourseReportsByInstructor(Resource):
   
  def get(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    return [report.to_dict() for report in course.reports], 200
  
class StudentReportsByInstructor(Resource):
   
  def get(self, student_id):
    student = Student.query.filter(Student.id == student_id).first()
    return [report.to_dict() for report in student.reports], 200
  
class CourseReportById(Resource):
   
  def get(self, course_id, report_id):
    course = Course.query.filter(Course.id == course_id).first()
    report = course.reports.filter(CourseReport.id == report_id).first()
    return report.to_dict(), 200
  
  def patch(self, course_id, report_id):
    course = Course.query.filter(Course.id == course_id).first()
    report = course.reports.filter(CourseReport.id == report_id).first()
    json = request.get_json()
    if json.get('content'):
      report.content = json.get('content')
    if json.get('date'):
      report.date = json.get('date')
    if json.get('approved'):
      report.approved = json.get('approved')
    db.session.commit()
    return report.to_dict(), 200
  
  def delete(self, course_id, report_id):
    course = Course.query.filter(Course.id == course_id).first()
    report = course.reports.filter(CourseReport.id == report_id).first()
    db.session.delete(report)
    db.session.commit()
    return {'message': 'Report deleted'}, 200
  
class StudentReportById(Resource):
   
  def get(self, student_id, report_id):
    student = Student.query.filter(Student.id == student_id).first()
    report = student.reports.filter(StudentReport.id == report_id).first()
    return report.to_dict(), 200
  
  def patch(self, student_id, report_id):
    student = Student.query.filter(Student.id == student_id).first()
    report = student.reports.filter(StudentReport.id == report_id).first()
    json = request.get_json()
    if json.get('content'):
      report.content = json.get('content')
    if json.get('date'):
      report.date = json.get('date')
    if json.get('approved'):
      report.approved = json.get('approved')
    db.session.commit()
    return report.to_dict(), 200
  
  def delete(self, student_id, report_id):
    student = Student.query.filter(Student.id == student_id).first()
    report = student.reports.filter(StudentReport.id == report_id).first()
    db.session.delete(report)
    db.session.commit()
    return {'message': 'Report deleted'}, 200
  
class Placements(Resource):

  def get(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    return [placement.to_dict() for placement in course.placements], 200

  def post(self, course_id):
    json = request.get_json()
    course = Course.query.filter(Course.id == course_id).first()
    placement = Placement(
        course_id=json.get('course_id'),
        student_id=json.get('student_id'),
        date=json.get('date')
    )
    try:
        db.session.add(placement)
        db.session.commit()
        return placement.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating placement'}, 422
    
class PlacementById(Resource):
   
  def get(self, course_id, placement_id):
    course = Course.query.filter(Course.id == course_id).first()
    placement = course.placements.filter(Placement.id == placement_id).first()
    return placement.to_dict(), 200
  
  def delete(self, course_id, placement_id):
    course = Course.query.filter(Course.id == course_id).first()
    placement = course.placements.filter(Placement.id == placement_id).first()
    db.session.delete(placement)
    db.session.commit()
    return {'message': 'Placement deleted'}, 200
  
class PlacementsByStudent(Resource):

  def get(self, student_id):
    student = Student.query.filter(Student.id == student_id).first()
    return [placement.to_dict() for placement in student.placements], 200
  
class Suggestions(Resource):

  def get(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    return [suggestion.to_dict() for suggestion in course.suggestions], 200
  
  def post(self, course_id):
    json = request.get_json()
    course = Course.query.filter(Course.id == course_id).first()
    suggestion = Suggestion(
        course_id=json.get('course_id'),
        discipline_id=json.get('discipline_id'),
        level_id=json.get('level_id'),
        gender_id=json.get('gender_id')
    )
    try:
        db.session.add(suggestion)
        db.session.commit()
        return suggestion.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating suggestion'}, 422
    
class SuggestionById(Resource):
   
  def get(self, course_id, suggestion_id):
    course = Course.query.filter(Course.id == course_id).first()
    suggestion = course.suggestions.filter(Suggestion.id == suggestion_id).first()
    return suggestion.to_dict(), 200
  
  def delete(self, course_id, suggestion_id):
    course = Course.query.filter(Course.id == course_id).first()
    suggestion = course.suggestions.filter(Suggestion.id == suggestion_id).first()
    db.session.delete(suggestion)
    db.session.commit()
    return {'message': 'Suggestion deleted'}, 200
  
class Courses(Resource):

  def get(self):
    return [course.to_dict() for course in Course.query.all()], 200
  
  def post(self):
    json = request.get_json()
    course = Course(
        name=json.get('name'),
        discipline_id=json.get('discipline_id'),
        level_id=json.get('level_id')
    )
    try:
        db.session.add(course)
        db.session.commit()
        return course.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating course'}, 422
      
class CourseById(Resource):
   
  def get(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    return course.to_dict(), 200
  
  def patch(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    json = request.get_json()
    if json.get('name'):
      course.name = json.get('name')
    if json.get('discipline_id'):
      course.discipline_id = json.get('discipline_id')
    if json.get('level_id'):
      course.level_id = json.get('level_id')
    db.session.commit()
    return course.to_dict(), 200
  
  def delete(self, course_id):
    course = Course.query.filter(Course.id == course_id).first()
    db.session.delete(course)
    db.session.commit()
    return {'message': 'Course deleted'}, 200
  
class Students(Resource):

  def get(self):
    return [student.to_dict() for student in Student.query.all()], 200
  
  def post(self):
    json = request.get_json()
    student = Student(
        first_name=json.get('first_name'),
        last_name=json.get('last_name'),
        email_address=json.get('email_address')
    )
    try:
        db.session.add(student)
        db.session.commit()
        return student.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating student'}, 422
      
class StudentById(Resource):
   
  def get(self, student_id):
    student = Student.query.filter(Student.id == student_id).first()
    return student.to_dict(), 200
  
  def patch(self, student_id):
    student = Student.query.filter(Student.id == student_id).first()
    json = request.get_json()
    if json.get('first_name'):
      student.first_name = json.get('first_name')
    if json.get('last_name'):
      student.last_name = json.get('last_name')
    if json.get('email_address'):
      student.email_address = json.get('email_address')
    db.session.commit()
    return student.to_dict(), 200
  
  def delete(self, student_id):
    student = Student.query.filter(Student.id == student_id).first()
    db.session.delete(student)
    db.session.commit()
    return {'message': 'Student deleted'}, 200

class Emails(Resource):
   
  def get(self):
    return [email.to_dict() for email in Email.query.all()], 200
  
  def post(self):
    json = request.get_json()
    email = Email(
        address=json.get('address')
    )
    try:
        db.session.add(email)
        db.session.commit()
        return email.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating email'}, 422
      
class EmailById(Resource):
   
  def get(self, email_id):
    email = Email.query.filter(Email.id == email_id).first()
    return email.to_dict(), 200
  
  def patch(self, email_id):
    email = Email.query.filter(Email.id == email_id).first()
    json = request.get_json()
    if json.get('address'):
      email.address = json.get('address')
    db.session.commit()
    return email.to_dict(), 200
  
  def delete(self, email_id):
    email = Email.query.filter(Email.id == email_id).first()
    db.session.delete(email)
    db.session.commit()
    return {'message': 'Email deleted'}, 200
  
class Disciplines(Resource):

  def get(self):
    return [discipline.to_dict() for discipline in Discipline.query.all()], 200
  
  def post(self):
    json = request.get_json()
    discipline = Discipline(
        name=json.get('name')
    )
    try:
        db.session.add(discipline)
        db.session.commit()
        return discipline.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating discipline'}, 422
      
class DisciplineById(Resource):
   
  def get(self, discipline_id):
    discipline = Discipline.query.filter(Discipline.id == discipline_id).first()
    return discipline.to_dict(), 200
  
  def patch(self, discipline_id):
    discipline = Discipline.query.filter(Discipline.id == discipline_id).first()
    json = request.get_json()
    if json.get('name'):
      discipline.name = json.get('name')
    db.session.commit()
    return discipline.to_dict(), 200
  
  def delete(self, discipline_id):
    discipline = Discipline.query.filter(Discipline.id == discipline_id).first()
    db.session.delete(discipline)
    db.session.commit()
    return {'message': 'Discipline deleted'}, 200
  
class Levels(Resource):

  def get(self):
    return [level.to_dict() for level in Level.query.all()], 200
  
  def post(self):
    json = request.get_json()
    level = Level(
        name=json.get('name')
    )
    try:
        db.session.add(level)
        db.session.commit()
        return level.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating level'}, 422
      
class LevelById(Resource):
   
  def get(self, level_id):
    level = Level.query.filter(Level.id == level_id).first()
    return level.to_dict(), 200
  
  def patch(self, level_id):
    level = Level.query.filter(Level.id == level_id).first()
    json = request.get_json()
    if json.get('name'):
      level.name = json.get('name')
    db.session.commit()
    return level.to_dict(), 200
  
  def delete(self, level_id):
    level = Level.query.filter(Level.id == level_id).first()
    db.session.delete(level)
    db.session.commit()
    return {'message': 'Level deleted'}, 200
  
class Genders(Resource):

  def get(self):
    return [gender.to_dict() for gender in Gender.query.all()], 200
  
  def post(self):
    json = request.get_json()
    gender = Gender(
        name=json.get('name')
    )
    try:
        db.session.add(gender)
        db.session.commit()
        return gender.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating gender'}, 422
      
class GenderById(Resource):
   
  def get(self, gender_id):
    gender = Gender.query.filter(Gender.id == gender_id).first()
    return gender.to_dict(), 200
  
  def patch(self, gender_id):
    gender = Gender.query.filter(Gender.id == gender_id).first()
    json = request.get_json()
    if json.get('name'):
      gender.name = json.get('name')
    db.session.commit()
    return gender.to_dict(), 200
  
  def delete(self, gender_id):
    gender = Gender.query.filter(Gender.id == gender_id).first()
    db.session.delete(gender)
    db.session.commit()
    return {'message': 'Gender deleted'}, 200
  
class Templates(Resource):

  def get(self):
    return [template.to_dict() for template in Template.query.all()], 200
  
  def post(self):
    json = request.get_json()
    template = Template(
        name=json.get('name'),
        content=json.get('content')
    )
    try:
        db.session.add(template)
        db.session.commit()
        return template.to_dict(), 201
    except IntegrityError:
        return {'message': 'Error creating template'}, 422
      
class TemplateById(Resource):
   
  def get(self, template_id):
    template = Template.query.filter(Template.id == template_id).first()
    return template.to_dict(), 200
  
  def patch(self, template_id):
    template = Template.query.filter(Template.id == template_id).first()
    json = request.get_json()
    if json.get('name'):
      template.name = json.get('name')
    if json.get('content'):
      template.content = json.get('content')
    db.session.commit()
    return template.to_dict(), 200
  
  def delete(self, template_id):
    template = Template.query.filter(Template.id == template_id).first()
    db.session.delete(template)
    db.session.commit()
    return {'message': 'Template deleted'}, 200
  

api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:user_id>')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check-session')
api.add_resource(Roles, '/roles')
api.add_resource(RoleById, '/roles/<int:role_id>')
api.add_resource(Courses, '/courses')
api.add_resource(CourseById, '/courses/<int:course_id>')
api.add_resource(Students, '/students')
api.add_resource(StudentById, '/students/<int:student_id>')
api.add_resource(Emails, '/emails')
api.add_resource(EmailById, '/emails/<int:email_id>')
api.add_resource(Disciplines, '/disciplines')
api.add_resource(DisciplineById, '/disciplines/<int:discipline_id>')
api.add_resource(Levels, '/levels')
api.add_resource(LevelById, '/levels/<int:level_id>')
api.add_resource(Genders, '/genders')
api.add_resource(GenderById, '/genders/<int:gender_id>')
api.add_resource(Templates, '/templates')
api.add_resource(TemplateById, '/templates/<int:template_id>')


class UserSchema(ma.SQLAlchemySchema):

  class Meta:
    model = User
    load_instance = True

  id = ma.auto_field()
  first_name = ma.auto_field()
  last_name = ma.auto_field()
  email_address = ma.auto_field()
  roles = fields.Nested('RoleSchema', exclude=['users'], many=True)
  courses = fields.Nested('CourseSchema', only=['id', 'name', 'discipline', 'level'], many=True)
  student_reports = fields.Nested('StudentReportSchema', only=['id', 'student', 'course', 'content', 'date', 'approved'], many=True)
  course_reports = fields.Nested('CourseReportSchema', only=['id', 'course', 'content', 'date', 'approved'], many=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class RoleSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Role
    load_instance = True

  id = ma.auto_field()
  name = ma.auto_field()
  description = ma.auto_field()
  users = fields.Nested('UserSchema', exclude=['roles'], many=True)

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

class CourseSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Course
    load_instance = True

  id = ma.auto_field()
  name = ma.auto_field()
  discipline = fields.Nested('DisciplineSchema', exclude=['courses'], many=False)
  level = fields.Nested('LevelSchema', exclude=['courses'], many=False)
  users = fields.Nested('UserSchema', exclude=['courses'], many=True)
  students = fields.Nested('StudentSchema', exclude=['courses'], many=True)
  course_reports = fields.Nested('CourseReportSchema', exclude=['course'], many=True)
  student_reports = fields.Nested('StudentReportSchema', exclude=['course'], many=True)
  placements = fields.Nested('PlacementSchema', exclude=['course'], many=True)

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)

class DisciplineSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Discipline
    load_instance = True

  id = ma.auto_field()
  name = ma.auto_field()
  courses = fields.Nested('CourseSchema', exclude=['discipline'], many=True)

discipline_schema = DisciplineSchema()
disciplines_schema = DisciplineSchema(many=True)

class LevelSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Level
    load_instance = True

  id = ma.auto_field()
  name = ma.auto_field()
  courses = fields.Nested('CourseSchema', exclude=['level'], many=True)

level_schema = LevelSchema()
levels_schema = LevelSchema(many=True)

class StudentSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Student
    load_instance = True

  id = ma.auto_field()
  first_name = ma.auto_field()
  last_name = ma.auto_field()
  email_address = ma.auto_field()
  secondary_email_address = ma.auto_field()
  birth_date = ma.auto_field()
  gender = ma.auto_field()
  courses = fields.Nested('CourseSchema', exclude=['students'], many=True)
  student_reports = fields.Nested('StudentReportSchema', exclude=['student'], many=True)
  email = fields.Nested('EmailSchema', exclude=['student'], many=False)
  placements = fields.Nested('PlacementSchema', exclude=['student'], many=True)

student_schema = StudentSchema()
students_schema = StudentSchema(many=True)

class GenderSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Gender
    load_instance = True

  id = ma.auto_field()
  name = ma.auto_field()
  students = fields.Nested('StudentSchema', only=['id', 'first_name', 'last_name'], many=True)

gender_schema = GenderSchema()
genders_schema = GenderSchema(many=True)

class StudentReportSchema(ma.SQLAlchemySchema):

  class Meta:
    model = StudentReport
    load_instance = True

  id = ma.auto_field()
  student = fields.Nested('StudentSchema', only=['id', 'first_name', 'last_name', 'email_address', 'secondary_email_address', 'birth_date', 'gender'], many=False)
  course = fields.Nested('CourseSchema', only=['id', 'name', 'discipline', 'level'], many=False)
  user = fields.Nested('UserSchema', exclude=['student_reports'], many=False)
  content = ma.auto_field()
  date = ma.auto_field()
  approved = ma.auto_field()

student_report_schema = StudentReportSchema()
student_reports_schema = StudentReportSchema(many=True)

class CourseReportSchema(ma.SQLAlchemySchema):

  class Meta:
    model = CourseReport
    load_instance = True

  id = ma.auto_field()
  course = fields.Nested('CourseSchema', only=['id', 'name', 'discipline', 'level'], many=False)
  user = fields.Nested('UserSchema', exclude=['course_reports'], many=False)
  content = ma.auto_field()
  date = ma.auto_field()
  approved = ma.auto_field()

course_report_schema = CourseReportSchema()
course_reports_schema = CourseReportSchema(many=True)

class PlacementSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Placement
    load_instance = True

  id = ma.auto_field()
  student = fields.Nested('StudentSchema', exclude=['placements'], many=False)
  course = fields.Nested('CourseSchema', exclude=['placements'], many=False)
  date = ma.auto_field()

placement_schema = PlacementSchema()
placements_schema = PlacementSchema(many=True)

class SuggestionSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Suggestion
    load_instance = True

  id = ma.auto_field()
  course = fields.Nested('CourseSchema', exclude=['suggestions'], many=False)
  discipline = fields.Nested('DisciplineSchema', exclude=['suggestions'], many=False)
  level = fields.Nested('LevelSchema', exclude=['suggestions'], many=False)
  gender = fields.Nested('GenderSchema', exclude=['suggestions'], many=False)

suggestion_schema = SuggestionSchema()
suggestions_schema = SuggestionSchema(many=True)

class TemplateSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Template
    load_instance = True

  id = ma.auto_field()
  name = ma.auto_field()
  content = ma.auto_field()

template_schema = TemplateSchema()
templates_schema = TemplateSchema(many=True)

class EmailSchema(ma.SQLAlchemySchema):

  class Meta:
    model = Email
    load_instance = True

  id = ma.auto_field()
  student = fields.Nested('StudentSchema', exclude=['email'], many=False)
  email_address = ma.auto_field()
  secondary_email_address = ma.auto_field()
  content = ma.auto_field()
  date = ma.auto_field()

email_schema = EmailSchema()
emails_schema = EmailSchema(many=True)

if __name__ == "__main__":
  app.run(port=5555, debug=True)
