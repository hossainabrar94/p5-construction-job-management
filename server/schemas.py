from config import ma
from models import User, Project, Task, Tag, CostEstimate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)

user_schema = UserSchema()
users_schema = UserSchema(many=True)


class ProjectSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Project
        load_instance = True

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)


class TaskSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Task
        load_instance = True

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)


class CostEstimateSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CostEstimate
        load_instance = True

cost_estimate_schema = CostEstimateSchema()
cost_estimates_schema = CostEstimateSchema(many=True)


class TagSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        load_instance = True

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)