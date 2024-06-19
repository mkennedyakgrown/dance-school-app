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
    password_hash = db.Column(db.String(60), nullable=False)

    roles = db.relationship('Role', secondary='users_roles', backref='users')
    courses = db.relationship('Course', secondary='users_courses', backref='users')
    student_reports = db.relationship('StudentReport', backref='user')
    course_reports = db.relationship('CourseReport', backref='user')

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=False)

    users = db.relationship('User', secondary='users_roles', backref='roles')

class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    discipline_id = db.Column(db.Integer, db.ForeignKey('disciplines.id'), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey('levels.id'), nullable=False)

    users = db.relationship('User', secondary='users_courses', backref='courses')
    students = db.relationship('Student', secondary='students_courses', backref='courses')
    discipline = db.relationship('Discipline', backref='courses')
    level = db.relationship('Level', backref='courses')

class Discipline(db.Model, SerializerMixin):
    __tablename__ = 'disciplines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    students = db.relationship('Student', secondary='students_courses', backref='discipline')
    courses = db.relationship('Course', secondary='users_courses', backref='discipline')

class Level(db.Model, SerializerMixin):
    __tablename__ = 'levels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    courses = db.relationship('Course', secondary='users_courses', backref='level')

class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email_address = db.Column(db.String(20), nullable=False)
    secondary_email_address = db.Column(db.String(20), nullable=True)
    birth_date = db.Column(db.Date, nullable=False)
    gender_id = db.Column(db.Integer, db.ForeignKey('genders.id'), nullable=True)

    courses = db.relationship('Course', secondary='students_courses', backref='students')
    disciplines = db.relationship('Discipline', secondary='students_courses', backref='students')
    levels = db.relationship('Level', secondary='students_courses', backref='students')
    reports = db.relationship('StudentReport', backref='student')
    email = db.relationship('Emails', backref='student')

class Gender(db.Model, SerializerMixin):
    __tablename__ = 'genders'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    students = db.relationship('Student', secondary='students_courses', backref='gender')

class StudentReport(db.Model, SerializerMixin):
    __tablename__ = 'student_reports'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    approved = db.Column(db.Boolean, nullable=False)

    student = db.relationship('Student', backref='reports')
    course = db.relationship('Course', backref='reports')
    user = db.relationship('User', backref='reports')

class CourseReport(db.Model, SerializerMixin):
    __tablename__ = 'course_reports'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    approved = db.Column(db.Boolean, nullable=False)

    course = db.relationship('Course', backref='reports')
    user = db.relationship('User', backref='reports')

class Placement(db.Model, SerializerMixin):
    __tablename__ = 'placements'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    course = db.relationship('Course', backref='placements')
    student = db.relationship('Student', backref='placements')

class Suggestion(db.Model, SerializerMixin):
    __tablename__ = 'suggestions'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
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

    student = db.relationship('Student', backref='emails')



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