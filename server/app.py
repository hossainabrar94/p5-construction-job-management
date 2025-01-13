#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Project, Task, CostEstimate, Tag


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
        
class CostEstimateCollection(Resource):

    def post(self, project_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404

        data = request.get_json()
        try:
            cost_estimate = CostEstimate(
                labor_cost = data.get('labor_cost', 0.0),
                material_cost = data.get('material_cost', 0.0),
                other_cost = data.get('other_cost', 0.0),
                project_id = project.id
            )
            db.session.add(cost_estimate)
            db.session.commit()
            return cost_estimate.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 422

class CostEstimateDetail(Resource):

    def put(self, project_id, ce_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404

        cost_estimate = CostEstimate.query.filter_by(id=ce_id, project_id=project.id).first()
        if not cost_estimate:
            return {'errors': ['Cost estimate not found']}, 404

        data = request.get_json()
        try:
            if 'labor_cost' in data:
                cost_estimate.labor_cost = data['labor_cost']
            if 'material_cost' in data:
                cost_estimate.material_cost = data['material_cost']
            if 'other_cost' in data:
                cost_estimate.other_cost = data['other_cost']

            db.session.commit()
            return cost_estimate.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 422

    def delete(self, project_id, ce_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404

        cost_estimate = CostEstimate.query.filter_by(id=ce_id, project_id=project.id).first()
        if not cost_estimate:
            return {'errors': ['Cost estimate not found']}, 404

        try:
            db.session.delete(cost_estimate)
            db.session.commit()
            return {'message': 'Cost estimate deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 422
        

class TagCollection(Resource):
    
    def get(self):
        all_tags = Tag.query.all()
        return [t.to_dict() for t in all_tags], 200

    def post(self):
        data = request.get_json()
        name = data.get('name')
        if not name:
            return {'errors': ['Tag name is required']}, 400
        existing = Tag.query.filter_by(name=name).first()
        if existing:
            return existing.to_dict(), 200
        new_tag = Tag(name=name)
        db.session.add(new_tag)
        db.session.commit()
        return new_tag.to_dict(), 201
    
class ProjectTagsCollection(Resource):
    
    def post(self, project_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401
        
        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404

        data = request.get_json()  
        tag_ids = data.get('tag_ids', [])
        try:
            for t_id in tag_ids:
                tag = Tag.query.get(t_id)
                if tag and tag not in project.tags:
                    project.tags.append(tag)
            db.session.commit()
            return project.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 422
        

class ProjectTagDetail(Resource):
    
    def delete(self, project_id, tag_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'errors': ['Must be signed in']}, 401

        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return {'errors': ['Project not found or unauthorized']}, 404
        
        tag = Tag.query.filter_by(id=tag_id).first()
        if not tag:
            return {'errors': [f'Tag with ID {tag_id} does not exist']}, 404
        
        if tag not in project.tags:
            return {'errors': [f'Tag {tag.name} not associated with this project']}, 400

        try:
            project.tags.remove(tag)
            db.session.commit()
            return {'message': f'Removed tag "{tag.name}" from project {project.id}'}, 200
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 422


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(ProjectCollection, '/projects', endpoint='projects')
api.add_resource(ProjectDetail, '/projects/<int:id>', endpoint='project_detail')
api.add_resource(TaskDetail, '/projects/<int:project_id>/tasks/<int:task_id>', endpoint='task_detail')
api.add_resource(ProjectTasks, '/projects/<int:project_id>/tasks', endpoint='project_tasks')
api.add_resource(CostEstimateCollection, '/projects/<int:project_id>/cost_estimates', endpoint='cost_estimates')
api.add_resource(CostEstimateDetail, '/projects/<int:project_id>/cost_estimates/<int:ce_id>', endpoint='cost_estimate_detail')
api.add_resource(TagCollection, '/tags', endpoint='tags')
api.add_resource(ProjectTagsCollection, '/projects/<int:project_id>/tags', endpoint='project_tags_collection')
api.add_resource(ProjectTagDetail, '/projects/<int:project_id>/tags/<int:tag_id>', endpoint='project_tag_detail')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
    