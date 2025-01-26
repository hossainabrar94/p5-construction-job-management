# Buildly
A Full-Stack Construction Project Management App.

## Introduction

Buildly is a full-stack construction project management platform built using Flask (Python) backend deployed using AWS Elastik Beanstalk and React (JavaScript) frontend. It enables users to create, track, and manage projects, with features like:

- User authentication (Sign up/Login)
- Create, edit, delete projects
- Assign & track tasks
- Cost estimation and budgeting
- Project tagging & categorization
- Deployed on AWS Elastic Beanstalk

### Backend
├── __init__.py
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
│       ├── 1a66d69efae4_update.py
│       ├── 25fc1c38816c_initial.py
│       └── b833488b207f_update.py
├── models.py

### Frontend
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── components
│   ├── index.css
│   ├── index.js
│   ├── pages
│   └── styles
└── tailwind.config.js

## Tech Stack

Backend (Flask & SQLAlchemy)
	•	Flask & Flask-RESTful (API endpoints)
	•	SQLAlchemy (ORM for database)
	•	Flask-Bcrypt (Password security)
	•	Flask-CORS (Cross-Origin Resource Sharing)

Frontend (React & Context API)
	•	React with React Router
	•	Tailwind CSS (for styling)
	•	Context API (for state management)

Deployment & Hosting
	•	Backend: AWS Elastic Beanstalk

## Deployment (AWS Elastic Beanstalk)

The backend is deployed using AWS Elastic Beanstalk.

### Install AWS CLI & EB CLI
pip install awsebcli --upgrade --user
aws configure
eb init  # Initialize the EB environment

### Deploy the Backend
eb create buildly-env  # Creates the EB environment
eb deploy  # Deploys changes
eb open  # Open the live URL

###  Set Environment Variables
eb setenv FLASK_ENV=production DATABASE_URL="(http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/)"
eb deploy

