from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import ForeignKey
from re import search

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email_address = db.Column(db.String(20), unique=True, nullable=False)
    _password_hash = db.Column(db.String(60), nullable=False)

    roles = db.relationship('Role', secondary='users_roles', back_populates='users')
    courses = db.relationship('Course', secondary='users_courses', back_populates='users')
    student_reports = db.relationship('StudentReport', back_populates='user')
    course_reports = db.relationship('CourseReport', back_populates='user')

    @validates('first_name')
    def validate_first_name(self, key, first_name):
        if not first_name:
            raise AssertionError('User must have a first name')
        if not search('[a-zA-Z]', first_name):
            raise AssertionError('User first name must only contain letters')
        if len(first_name) > 20:
            raise AssertionError('User first name must be less than 20 characters')
        if len(first_name) < 2:
            raise AssertionError('User first name must be at least 2 characters')
        if ' ' in first_name:
            raise AssertionError('User first name must not contain spaces')
        return first_name

    @validates('last_name')
    def validate_last_name(self, key, last_name):
        if not last_name:
            raise AssertionError('User must have a last name')
        if not search('[a-zA-Z]', last_name):
            raise AssertionError('User last name must only contain letters')
        if len(last_name) > 20:
            raise AssertionError('User last name must be less than 20 characters')
        if len(last_name) < 2:
            raise AssertionError('User last name must be at least 2 characters')
        if ' ' in last_name:
            raise AssertionError('User last name must not contain spaces')
        return last_name

    @validates('email_address')
    def validate_email_address(self, key, email_address):
        if not email_address:
            raise AssertionError('User must have an email address')
        if not search('[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', email_address):
            raise AssertionError('User email address must be valid')
        if len(email_address) > 30:
            raise AssertionError('User email address must be less than 30 characters')
        if ' ' in email_address:
            raise AssertionError('User email address must not contain spaces')
        return email_address
    
    @hybrid_property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hash may not be viewed')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<User {self.first_name} {self.last_name}>'

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=False)

    users = db.relationship('User', secondary='users_roles', back_populates='roles')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise AssertionError('Role must have a name')
        if len(name) > 20:
            raise AssertionError('Role name must be less than 20 characters')
        if len(name) < 2:
            raise AssertionError('Role name must be at least 2 characters')
        return name

    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise AssertionError('Role must have a description')
        if len(description) > 200:
            raise AssertionError('Role description must be less than 200 characters')
        if len(description) < 2:
            raise AssertionError('Role description must be at least 2 characters')
        return description

class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)
    discipline_id = db.Column(db.Integer, db.ForeignKey('disciplines.id'), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey('levels.id'), nullable=False)

    users = db.relationship('User', secondary='users_courses', back_populates='courses')
    students = db.relationship('Student', secondary='students_courses', back_populates='courses')
    discipline = db.relationship('Discipline', back_populates='courses')
    level = db.relationship('Level', back_populates='courses')
    course_reports = db.relationship('CourseReport', back_populates='course')
    student_reports = db.relationship('StudentReport', back_populates='course')
    placements = db.relationship('Placement', back_populates='course')

    serialize_rules = ('-users', 'students', '-discipline', '-level', '-course_reports', '-student_reports', '-placements')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise AssertionError('Course must have a name')
        if len(name) > 40:
            raise AssertionError('Course name must be less than 40 characters')
        if len(name) < 2:
            raise AssertionError('Course name must be at least 2 characters')
        return name
    
    @validates('discipline_id')
    def validate_discipline_id(self, key, discipline_id):
        if not discipline_id:
            raise AssertionError('Course must have a discipline')
        if discipline_id not in [discipline.id for discipline in Discipline.query.all()]:
            raise AssertionError('Course must have a valid discipline')
        return discipline_id
    
    @validates('level_id')
    def validate_level_id(self, key, level_id):
        if not level_id:
            raise AssertionError('Course must have a level')
        if level_id not in [level.id for level in Level.query.all()]:
            raise AssertionError('Course must have a valid level')
        return level_id

class Discipline(db.Model, SerializerMixin):
    __tablename__ = 'disciplines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    courses = db.relationship('Course', back_populates='discipline')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise AssertionError('Discipline must have a name')
        if len(name) > 20:
            raise AssertionError('Discipline name must be less than 20 characters')
        if len(name) < 2:
            raise AssertionError('Discipline name must be at least 2 characters')
        return name

class Level(db.Model, SerializerMixin):
    __tablename__ = 'levels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    courses = db.relationship('Course', back_populates='level')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise AssertionError('Level must have a name')
        if len(name) > 20:
            raise AssertionError('Level name must be less than 20 characters')
        return name

class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email_address = db.Column(db.String(20), nullable=False)
    secondary_email_address = db.Column(db.String(20), nullable=True)
    birth_date = db.Column(db.Date, nullable=False)
    gender_id = db.Column(db.Integer, db.ForeignKey('genders.id'), nullable=True)

    gender = db.relationship('Gender', back_populates='students')
    courses = db.relationship('Course', secondary='students_courses', back_populates='students')
    student_reports = db.relationship('StudentReport', back_populates='student')
    email = db.relationship('Email', back_populates='student')
    placements = db.relationship('Placement', back_populates='student')

    @validates('first_name')
    def validate_first_name(self, key, first_name):
        if not first_name:
            raise AssertionError('User must have a first name')
        if not search('[a-zA-Z]', first_name):
            raise AssertionError('User first name must only contain letters')
        if len(first_name) > 20:
            raise AssertionError('User first name must be less than 20 characters')
        if len(first_name) < 2:
            raise AssertionError('User first name must be at least 2 characters')
        if ' ' in first_name:
            raise AssertionError('User first name must not contain spaces')
        return first_name

    @validates('last_name')
    def validate_last_name(self, key, last_name):
        if not last_name:
            raise AssertionError('User must have a last name')
        if not search('[a-zA-Z]', last_name):
            raise AssertionError('User last name must only contain letters')
        if len(last_name) > 20:
            raise AssertionError('User last name must be less than 20 characters')
        if len(last_name) < 2:
            raise AssertionError('User last name must be at least 2 characters')
        if ' ' in last_name:
            raise AssertionError('User last name must not contain spaces')
        return last_name

    @validates('email_address')
    def validate_email_address(self, key, email_address):
        if not email_address:
            raise AssertionError('User must have an email address')
        if not search('[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', email_address):
            raise AssertionError('User email address must be valid')
        if len(email_address) > 30:
            raise AssertionError('User email address must be less than 30 characters')
        if ' ' in email_address:
            raise AssertionError('User email address must not contain spaces')
        return email_address
    
    @hybrid_property
    def name(self):
        return f'{self.first_name} {self.last_name}'

class Gender(db.Model, SerializerMixin):
    __tablename__ = 'genders'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    students = db.relationship('Student', back_populates='gender')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise AssertionError('Gender must have a name')
        if len(name) > 20:
            raise AssertionError('Gender name must be less than 20 characters')
        if len(name) < 2:
            raise AssertionError('Gender name must be at least 2 characters')
        return name

class StudentReport(db.Model, SerializerMixin):
    __tablename__ = 'student_reports'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    approved = db.Column(db.Boolean, nullable=False, default=False)

    student = db.relationship('Student', back_populates='student_reports')
    course = db.relationship('Course', back_populates='student_reports')
    user = db.relationship('User', back_populates='student_reports')

    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise AssertionError('Student report must have content')
        if len(content) > 2000:
            raise AssertionError('Student report content must be less than 500 characters')
        return content
    
    @validates('date')
    def validate_date(self, key, date):
        if not date:
            raise AssertionError('Student report must have a date')
        return date
    
    @validates('approved')
    def validate_approved(self, key, approved):
        if approved is None:
            raise AssertionError('Student report approval must have a value')
        if not isinstance(approved, bool):
            raise AssertionError('Student report approval must be a boolean')
        return approved

class CourseReport(db.Model, SerializerMixin):
    __tablename__ = 'course_reports'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    approved = db.Column(db.Boolean, nullable=False)

    course = db.relationship('Course', back_populates='course_reports')
    user = db.relationship('User', back_populates='course_reports')

    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise AssertionError('Course report must have content')
        if len(content) > 2000:
            raise AssertionError('Course report content must be less than 2000 characters')
        return content
    
    @validates('date')
    def validate_date(self, key, date):
        if not date:
            raise AssertionError('Course report must have a date')
        return date
    
    @validates('approved')
    def validate_approved(self, key, approved):
        if approved is None:
            raise AssertionError('Course report approval must have a value')
        if not isinstance(approved, bool):
            raise AssertionError('Course report approval must be a boolean')
        return approved

class Placement(db.Model, SerializerMixin):
    __tablename__ = 'placements'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    course = db.relationship('Course', back_populates='placements')
    student = db.relationship('Student', back_populates='placements')

    @validates('date')
    def validate_date(self, key, date):
        if not date:
            raise AssertionError('Placement must have a date')
        return date

class Suggestion(db.Model, SerializerMixin):
    __tablename__ = 'suggestions'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    discipline_id = db.Column(db.Integer, db.ForeignKey('disciplines.id'), nullable=True)
    level_id = db.Column(db.Integer, db.ForeignKey('levels.id'), nullable=True)
    gender_id = db.Column(db.Integer, db.ForeignKey('genders.id'), nullable=True)

    @validates('course_id')
    def validate_course_id(self, key, course_id):
        if not course_id:
            raise AssertionError('Suggestion must have a course')
        return course_id

class Template(db.Model, SerializerMixin):
    __tablename__ = 'templates'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise AssertionError('Template must have a name')
        return name
    
    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise AssertionError('Template must have content')
        return content

class Email(db.Model, SerializerMixin):
    __tablename__ = 'emails'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    email_address = db.Column(db.String(20), nullable=False)
    secondary_email_address = db.Column(db.String(20), nullable=True)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    student = db.relationship('Student', back_populates='email')

    @validates('student_id')
    def validate_student_id(self, key, student_id):
        if not student_id:
            raise AssertionError('Email must have a student')
        if student_id not in [student.id for student in Student.query.all()]:
            raise AssertionError('Email must have a valid student')
        return student_id

    @validates('email_address')
    def validate_email_address(self, key, email_address):
        if not email_address:
            raise AssertionError('User must have an email address')
        if not search('[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', email_address):
            raise AssertionError('User email address must be valid')
        if len(email_address) > 30:
            raise AssertionError('User email address must be less than 30 characters')
        if ' ' in email_address:
            raise AssertionError('User email address must not contain spaces')
        return email_address
    
    @validates('secondary_email_address')
    def validate_secondary_email_address(self, key, secondary_email_address):
        if secondary_email_address:
            if not search('[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', secondary_email_address):
                raise AssertionError('User email address must be valid')
            if len(secondary_email_address) > 30:
                raise AssertionError('User email address must be less than 30 characters')
            if ' ' in secondary_email_address:
                raise AssertionError('User email address must not contain spaces')
        return secondary_email_address
    
    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise AssertionError('Email must have content')
        return content
    
    @validates('date')
    def validate_date(self, key, date):
        if not date:
            raise AssertionError('Email must have a date')
        return date



users_roles = db.Table('users_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'))
)

users_courses = db.Table('users_courses',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id'))
)

students_courses = db.Table('students_courses',
    db.Column('student_id', db.Integer, db.ForeignKey('students.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id'))
)