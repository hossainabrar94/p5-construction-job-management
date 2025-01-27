#!/usr/bin/env python3

from random import randint, choice as rc
from datetime import date
from faker import Faker

from server.config import app
from server.models import db, User, Project, Task, CostEstimate, Tag

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        db.drop_all()
        db.create_all()

        fake = Faker()

        # Seed Users
        users = []
        for _ in range(5):
            username = fake.user_name()
            email = fake.email()
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
        # We'll add the cost estimate before the final commit to avoid warnings.
        for user in users:
            num_projects = randint(2, 3)
            for _ in range(num_projects):
                project_name = " ".join(fake.words(nb=3)).title()
                description = fake.paragraph(nb_sentences=2)

                # Random start/end dates
                start_year = randint(2021, 2023)
                end_year = randint(2024, 2025)
                start_dt = date(start_year, randint(1, 12), randint(1, 28))
                end_dt = date(end_year, randint(1, 12), randint(1, 28))
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

                # Assign random tags
                project_tags_count = randint(1, 3)
                selected_tags = [rc(tags) for _ in range(project_tags_count)]
                unique_tags = set(selected_tags)
                for tg in unique_tags:
                    project.tags.append(tg)

                # Add and commit after assigning tags
                db.session.add(project)
                db.session.commit()

                # Create tasks for the project
                num_tasks = randint(3, 5)
                tasks = []
                for _ in range(num_tasks):
                    task_name = " ".join(fake.words(nb=2)).title()
                    task_desc = fake.paragraph(nb_sentences=1)
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

                # Create a cost estimate for the project
                estimated_cost = randint(5000, 50000)
                cost_estimate = CostEstimate(
                    estimated_cost=estimated_cost,
                    project=project
                )
                db.session.add(cost_estimate)
                # By adding cost_estimate to the session and committing here,
                # we ensure no warning is thrown.
                db.session.commit()

        print("Seeding completed!")