"""Increase Item name length

Revision ID: cc8af385952f
Revises: 66a4bf151725
Create Date: 2025-03-13 10:53:54.713972

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc8af385952f'
down_revision = '66a4bf151725'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('items', 'name',
               existing_type=sa.VARCHAR(length=30),
               type_=sa.String(length=50),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None, recreate='always') as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=30),
               existing_nullable=False)

    # ### end Alembic commands ###
