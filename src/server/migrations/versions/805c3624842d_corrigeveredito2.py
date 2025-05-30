"""CorrigeVeredito2

Revision ID: 805c3624842d
Revises: b104ec5ff352
Create Date: 2025-05-14 22:50:45.948437

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '805c3624842d'
down_revision = 'b104ec5ff352'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.alter_column('fissure_type',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=True)


    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    with op.batch_alter_table('images', schema=None) as batch_op:
        batch_op.alter_column('fissure_type',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###
