#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from mimesis import Person, Text, Datetime, Finance
from mimesis.locales import Locale

# Local imports
from app import app
from models import db, User, Project, Task, CostEstimate, Tag, project_tags
from datetime import date

if __name__ == '__main__':
    
    with app.app_context():
            print("Starting seed...")

            db.drop_all()
            db.create_all()

            person = Person(locale=Locale.EN)
            text = Text(locale=Locale.EN)
            datetime_gen = Datetime(locale=Locale.EN)
            finance = Finance(locale=Locale.EN)

            # ----- Seeding Users -----
            users = []
            for _ in range(5):
                username = person.username()
                email = person.email()
                # For simplicity, store a placeholder hashed password or just a random string
                # Assuming User model handles password hashing internally via set_password method
                password = "password123"
                user = User(username=username, email=email, password=password)
                users.append(user)

            db.session.add_all(users)
            db.session.commit()

            tag_names = ["kitchen", "bathroom", "wood_flooring", "vinyl_flooring", "tile_flooring", "paint"]
            tags = [Tag(name=name) for name in tag_names]
            db.session.add_all(tags)
            db.session.commit()

            # Seeding Projects, Tasks, and CostEstimates
            projects = []
            tasks = []
            cost_estimates = []

            for user in users:
                num_projects = randint(2, 3)  # each user has 2 to 3 projects
                for _ in range(num_projects):
                    project_name = text.title()
                    description = text.text(quantity=1)  # A short paragraph
                    start_dt = datetime_gen.date(start=2021, end=2023)
                    end_dt = datetime_gen.date(start=2024, end=2025)

                    # make sure the end date is after start date
                    if end_dt < start_dt:
                        start_dt, end_dt = end_dt, start_dt

                    project = Project(
                        name=project_name,
                        description=description,
                        start_date=start_dt,
                        end_date=end_dt,
                        owner=user
                    )
                    
                    db.session.add(project)
                    db.session.commit()
                    projects.append(project)

                    # Assign random tags to the project
                    project_tags_count = randint(1, 3)
                    [rc(tags) for _ in range(project_tags_count)]
                    
                    db.session.add(project)
                    db.session.commit()

                    # Create tasks for the project
                    # Let's say each project has 3-5 tasks
                    num_tasks = randint(3, 5)
                    for _ in range(num_tasks):
                        task_name = text.title()
                        task_desc = text.text(quantity=1)
                        status = rc(["Not Started", "In Progress", "Completed"])
                        task = Task(
                            name=task_name,
                            description=task_desc,
                            status=status,
                            project=project
                        )
                        tasks.append(task)
                    
                    db.session.add_all(tasks)
                    db.session.commit()
                    tasks.clear()

                    # Create a cost estimate for the project
                    estimated_cost = finance.price(minimum=5000, maximum=50000)
                    cost_estimate = CostEstimate(
                        estimated_cost=estimated_cost,
                        project=project
                    )
                    cost_estimates.append(cost_estimate)

            db.session.add_all(cost_estimates)
            db.session.commit()

            print("Seeding completed!")
