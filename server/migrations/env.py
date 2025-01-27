import logging
from logging.config import fileConfig
import os
import sys

from flask import current_app
from alembic import context

# Alembic Config
config = context.config

# Configure logging
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# Ensure the correct path for imports (for AWS Elastic Beanstalk)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import models
try:
    from server.models import User, Project, Task, CostEstimate, Tag  # ✅ Use absolute import
except ImportError:
    logger.error("Could not import models. Ensure 'server.models' exists.")

# Get database connection
def get_engine():
    try:
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        return current_app.extensions['migrate'].db.engine

def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace('%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')

config.set_main_option('sqlalchemy.url', get_engine_url())
target_db = current_app.extensions['migrate'].db

def get_metadata():
    """Return database metadata."""
    return target_db.metadatas[None] if hasattr(target_db, 'metadatas') else target_db.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=get_metadata(), literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    conf_args = current_app.extensions['migrate'].configure_args
    conf_args.setdefault("process_revision_directives", process_revision_directives)

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=get_metadata(), **conf_args)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()