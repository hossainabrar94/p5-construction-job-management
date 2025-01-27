# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
import os

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
# app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'
app.secret_key = os.getenv('SECRET_KEY', 'supersecret')
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError("DATABASE_URL is not set! Ensure it's configured in your AWS EB environment variables.")
elif database_url.startswith("postgres://"):  # AWS EB sometimes uses this
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# password hash
bcrypt = Bcrypt(app)

# Instantiate CORS
CORS(app)

app.instance_path = "/tmp/my_flask_instance"
os.makedirs(app.instance_path, exist_ok=True)