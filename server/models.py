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
            self.password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<User {self.first_name} {self.last_name}>'

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=False)

    users = db.relationship('User', secondary='users_roles', back_populates='roles')

class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    discipline_id = db.Column(db.Integer, db.ForeignKey('disciplines.id'), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey('levels.id'), nullable=False)

    users = db.relationship('User', secondary='users_courses', back_populates='courses')
    students = db.relationship('Student', secondary='students_courses', back_populates='courses')
    discipline = db.relationship('Discipline', back_populates='courses')
    level = db.relationship('Level', back_populates='courses')
    course_reports = db.relationship('CourseReport', back_populates='course')
    student_reports = db.relationship('StudentReport', back_populates='course')
    placements = db.relationship('Placement', back_populates='course')

class Discipline(db.Model, SerializerMixin):
    __tablename__ = 'disciplines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    courses = db.relationship('Course', back_populates='discipline')

class Level(db.Model, SerializerMixin):
    __tablename__ = 'levels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    courses = db.relationship('Course', back_populates='level')

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

class Gender(db.Model, SerializerMixin):
    __tablename__ = 'genders'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    students = db.relationship('Student', back_populates='gender')

class StudentReport(db.Model, SerializerMixin):
    __tablename__ = 'student_reports'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    approved = db.Column(db.Boolean, nullable=False)

    student = db.relationship('Student', back_populates='student_reports')
    course = db.relationship('Course', back_populates='student_reports')
    user = db.relationship('User', back_populates='student_reports')

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

class Placement(db.Model, SerializerMixin):
    __tablename__ = 'placements'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    course = db.relationship('Course', back_populates='placements')
    student = db.relationship('Student', back_populates='placements')

class Suggestion(db.Model, SerializerMixin):
    __tablename__ = 'suggestions'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    discipline_id = db.Column(db.Integer, db.ForeignKey('disciplines.id'), nullable=True)
    level_id = db.Column(db.Integer, db.ForeignKey('levels.id'), nullable=True)
    gender_id = db.Column(db.Integer, db.ForeignKey('genders.id'), nullable=True)

class Template(db.Model, SerializerMixin):
    __tablename__ = 'templates'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)

class Email(db.Model, SerializerMixin):
    __tablename__ = 'emails'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    email_address = db.Column(db.String(20), nullable=False)
    secondary_email_address = db.Column(db.String(20), nullable=True)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    student = db.relationship('Student', back_populates='email')



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