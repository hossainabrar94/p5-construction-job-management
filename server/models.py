from sqlalchemy.orm import validates
from datetime import date, datetime

from config import db, bcrypt

# Models go here!
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    projects = db.relationship('Project', backref='owner')

    @property
    def password(self):
        raise AttributeError('Not a readable attribute')
    @password.setter
    def password(self, password):
        if len(password) < 4:
            raise ValueError('Please enter a password with at least 4 characters') 
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError('Please enter a valid email address')
        return address

    def __repr__(self):
        return f"<User {self.username}>"
    

project_tags = db.Table(
    'project_tags',
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    _start_date = db.Column(db.Date)
    _end_date = db.Column(db.Date)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    tasks = db.relationship('Task', backref='project', cascade="all, delete-orphan")
    cost_estimates = db.relationship('CostEstimate', backref='project', cascade="all, delete-orphan")
    tags = db.relationship('Tag', secondary='project_tags', backref='projects')

    @property
    def start_date(self):
        return self._start_date
    
    @start_date.setter
    def start_date(self, value):
        if not value:
            self._start_date = None
        elif isinstance(value, str):
            self._start_date = datetime.strptime(value, "%Y-%m-%d").date()
        elif isinstance(value, date):
            self._start_date = value
        else:
            self._start_date = None

    @property
    def end_date(self):
        return self._end_date
    
    @end_date.setter
    def end_date(self, value):
        if not value:
            self._end_date = None
        elif isinstance(value, str):
            self._end_date = datetime.strptime(value, "%Y-%m-%d").date()
        elif isinstance(value, date):
            self._end_date = value
        else:
            self._end_date = None
    
    def __repr__(self):
        return f"<Project {self.name}>"
    


# Users can filter or search for projects based on tags (ex. kitchen, bathroom, wood_flooring, vinyl_flooring, tile_flooring, paint, etc).    
class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f"<Tag {self.name}>"



class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), nullable=False, default='Not Started')

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    def __repr__(self):
        return f"<Task {self.name} - Status: {self.status}>"
    

class CostEstimate(db.Model):
    __tablename__ = 'cost_estimates'

    id = db.Column(db.Integer, primary_key=True)
    labor_cost = db.Column(db.Float, default=0.0)
    material_cost = db.Column(db.Float, default=0.0)
    other_cost = db.Column(db.Float, default=0.0)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    def __repr__(self):
        return f"<CostEstimate ${self.total_cost} for Project ID {self.project_id}>"
