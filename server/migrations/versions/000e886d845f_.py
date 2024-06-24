"""empty message

Revision ID: 000e886d845f
Revises: 638785530d0b
Create Date: 2024-06-22 21:07:11.914284

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '000e886d845f'
down_revision = '638785530d0b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.String(length=40),
               existing_nullable=False)

    with op.batch_alter_table('emails', schema=None) as batch_op:
        batch_op.add_column(sa.Column('approved', sa.Boolean(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('emails', schema=None) as batch_op:
        batch_op.drop_column('approved')

    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.String(length=40),
               type_=sa.VARCHAR(length=20),
               existing_nullable=False)

    # ### end Alembic commands ###