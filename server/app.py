#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Project, Task


# Views go here!
class Signup(Resource):
    
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return {'errors': ['All fields must be submitted']}, 400
        
        user = User(username=username, email=email)

        try:
            user.password = password
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'errors': ['Username or email already exists']}, 422
        
class Login(Resource):
    
    def post(self):
        user = User.query.filter(User.username == request.get_json().get('username')).first()
        if user and user.authenticate(request.get_json().get('password')):
            session['user_id'] = user.id
            return user.to_dict(), 200
        else:
            return {'errors': ['Incorrect Username or password']}, 401

class Logout(Resource):
    
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        else:
            return {'errors': [ 'User not logged in']}, 401


class CheckSession(Resource):
    
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        return {'errors': ['Unauthorized']}, 401

class ProjectCollection(Resource):

    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        user_projects = Project.query.filter_by(user_id=user_id).all()
        projects = [project.to_dict() for project in user_projects]
        return projects, 200
    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        
        data = request.get_json()
        try:
            project = Project()
            for field in ['name', 'description', 'start_date', 'end_date']:
                setattr(project, field, data.get(field))
            project.user_id = user_id 
            db.session.add(project)
            db.session.commit()
            return project.to_dict(), 201
        except ValueError as ve:
            db.session.rollback()
            return {'errors': [str(ve)]}, 422
        
class ProjectDetail(Resource):

    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        project = Project.query.filter(Project.id == id).first()
        if project:
            return project.to_dict(), 200
        else:
            return {'errors': ['Project not found']}, 404

    def put(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        project = Project.query.filter(Project.id == id).first()
        if not project:
            return {'errors': ['Project not found']}, 404
        if not project.user_id == user_id:
            return {'errors': ['Unauthorized Page']}, 403
        
        data = request.get_json()
        try:
            for field in ['name', 'description', 'start_date', 'end_date']:
                if field in data:
                    setattr(project, field, data.get(field))
            db.session.commit()
            return project.to_dict(), 200
        except ValueError as ve:
            db.session.rollback()
            return {'errors': [ str(ve)]}, 422

    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        project = Project.query.filter(Project.id == id).first()
        if not project:
            return {'errors': ['Project not found']}, 404
        if not project.user_id == user_id:
            return {'errors': ['Unauthorized Page']}, 403
        
        try:
            db.session.delete(project)
            db.session.commit()
            return {'message': 'Project deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'errors': [ str(e)]}, 500


class TaskDetail(Resource):
    def get(self, project_id, task_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        
        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {'errors': ['Project not found']}, 404

        if project.user_id != user_id:
            return {'errors': ['Unauthorized']}, 403

        task = Task.query.filter_by(id=task_id, project_id=project_id).first()
        if not task:
            return {'errors': ['Task not found']}, 404

        return task.to_dict(), 200

    def put(self, project_id, task_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {'errors': ['Project not found']}, 404

        if project.user_id != user_id:
            return {'errors': ['Unauthorized']}, 403

        task = Task.query.filter_by(id=task_id, project_id=project_id).first()
        if not task:
            return {'errors': ['Task not found']}, 404

        data = request.get_json()
        try:
            for field in ['name', 'description', 'status']:
                if field in data:
                    setattr(task, field, data[field])
            db.session.commit()
            return task.to_dict(), 200
        except ValueError as ve:
            db.session.rollback()
            return {'errors': [str(ve)]}, 422       

    def delete(self, project_id, task_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {'errors': ['Project not found']}, 404

        if project.user_id != user_id:
            return {'errors': ['Unauthorized']}, 403

        task = Task.query.filter_by(id=task_id, project_id=project_id).first()
        if not task:
            return {'errors': ['Task not found']}, 404

        try:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Task deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 500
        
        
class ProjectTasks(Resource):
    def get(self, project_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404

        tasks = [task.to_dict() for task in project.tasks]
        return tasks, 200
    
    def post(self, project_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404

        data = request.get_json()
        try:
            task = Task(
                name=data.get('name'),
                description=data.get('description'),
                status=data.get('status', 'Not Started'),
                project_id=project.id
            )
            db.session.add(task)
            db.session.commit()
            return task.to_dict(), 201
        except ValueError as ve:
            db.session.rollback()
            return {'errors': [str(ve)]}, 422


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(ProjectCollection, '/projects', endpoint='projects')
api.add_resource(ProjectDetail, '/projects/<int:id>', endpoint='project_detail')
api.add_resource(TaskDetail, '/projects/<int:project_id>/tasks/<int:task_id>', endpoint='task_detail')
api.add_resource(ProjectTasks, '/projects/<int:project_id>/tasks', endpoint='project_tasks')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
    