from config import ma
from models import User, Project, Task, Tag, CostEstimate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)

user_schema = UserSchema()
users_schema = UserSchema(many=True)


class TagSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        load_instance = True
        fields = ("id", "name") 

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)


class CostEstimateSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CostEstimate
        load_instance = True
        fields = ("id", "labor_cost", "material_cost", "other_cost", "project_id") 

cost_estimate_schema = CostEstimateSchema()
cost_estimates_schema = CostEstimateSchema(many=True)


class TaskSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Task
        load_instance = True
        fields = ("id", "name", "description", "status", "project_id") 

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)


class ProjectSchema(SQLAlchemyAutoSchema):
    tags = fields.List(fields.Nested(TagSchema))  
    cost_estimates = fields.List(fields.Nested(CostEstimateSchema))  
    tasks = fields.List(fields.Nested(TaskSchema)) 

    class Meta:
        model = Project
        load_instance = True
        fields = (
            "id",
            "name",
            "description",
            "start_date",
            "end_date",
            "user_id",
            "tags",
            "cost_estimates",
            "tasks",
        )

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)