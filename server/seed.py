#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from mimesis.locales import Locale

# Local imports
from app import app
from models import db

if __name__ == '__main__':
    
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
