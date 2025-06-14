"""AttFKImagesFacade

Revision ID: 31d86b02db7c
Revises: f05217167e05
Create Date: 2025-05-26 17:28:33.459853

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '31d86b02db7c'
down_revision = 'f05217167e05'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.add_column(sa.Column('facade_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'facade', ['facade_id'], ['id'])

    with op.batch_alter_table('logs', schema=None) as batch_op:
        batch_op.alter_column('timestamp',
               existing_type=sa.VARCHAR(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    with op.batch_alter_table('logs', schema=None) as batch_op:
        batch_op.alter_column('timestamp',
               existing_type=sa.VARCHAR(),
               nullable=True)


    # ### end Alembic commands ###
