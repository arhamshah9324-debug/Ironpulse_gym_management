# backend/seed.py
# Populate the database with 15 members, 3 trainers, and related data
import asyncio
import sys, os
import random
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import AsyncSessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.plan import Plan
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.attendance import Attendance
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.core.security import hash_password
from datetime import date, timedelta, datetime, timezone
from decimal import Decimal

async def seed():
    # Drop and recreate tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # ── Admin ───────────────────────────────────────────────────
        admin = User(
            name="Admin User", email="admin@ironpulse.com",
            hashed_password=hash_password("admin123"), role=UserRole.admin,
        )
        db.add(admin)
        await db.flush()

        # ── Trainers (4) ───────────────────────────────────────────
        trainer_data = [
            ("Trainer Ayush", "ayush@ironpulse.com", "Hypertrophy & Bodybuilding"),
            ("Trainer Alex", "alex@ironpulse.com", "Strength & Conditioning"),
            ("Trainer Blake", "blake@ironpulse.com", "Yoga & Mobility"),
            ("Trainer Casey", "casey@ironpulse.com", "HIIT & Cardio"),
        ]
        trainers, trainer_profiles = [], []
        for name, email, spec in trainer_data:
            t_user = User(
                name=name, email=email,
                hashed_password=hash_password("trainer123"), role=UserRole.trainer
            )
            db.add(t_user)
            await db.flush()
            t_profile = Trainer(
                user_id=t_user.id, phone=f"+1-555-T{random.randint(100, 999)}",
                specialization=spec, bio=f"Experienced {spec} coach.",
                experience_years=random.randint(3, 10), hourly_rate=Decimal(str(random.randint(40, 100))),
                certifications="NASM-CPT"
            )
            db.add(t_profile)

        # ── Members (16) ───────────────────────────────────────────
        member_names = ["Arham", "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Kyle", "Liam", "Mia", "Noah", "Olivia"]
        members, member_profiles = [], []
        for idx, name in enumerate(member_names, start=1):
            m_user = User(
                name=f"{name} Smith", email=f"{name.lower()}@example.com",
                hashed_password=hash_password("member123"), role=UserRole.member
            )
            db.add(m_user)
            await db.flush()
            join_d = date.today() - timedelta(days=random.randint(1, 100))
            m_profile = Member(
                user_id=m_user.id, phone=f"+1-555-M{idx:03d}",
                join_date=join_d, date_of_birth=date(1990 + random.randint(0, 10), 1, 1)
            )
            db.add(m_profile)
            member_profiles.append(m_profile)

        await db.flush()

        # ── Plans ──────────────────────────────────────────────────
        basic = Plan(name="Basic", duration_days=30, price=Decimal("29.99"), features="Gym Access,Locker Room", description="Essential access.", is_active=True)
        premium = Plan(name="Premium", duration_days=30, price=Decimal("59.99"), features="Gym Access,Sauna,Classes", description="Full access.", is_active=True)
        annual = Plan(name="Annual Elite", duration_days=365, price=Decimal("499.99"), features="All Access,PT,Sauna", description="Best value.", is_active=True)
        db.add_all([basic, premium, annual])
        await db.flush()
        plans = [basic, premium, annual]

        # ── Subscriptions & Payments ───────────────────────────────
        methods = list(PaymentMethod)
        for m_prof in member_profiles:
            plan = random.choice(plans)
            sub = Subscription(
                member_id=m_prof.id, plan_id=plan.id,
                start_date=date.today() - timedelta(days=random.randint(0, 20)),
                end_date=date.today() + timedelta(days=plan.duration_days - 20),
                status=SubscriptionStatus.active
            )
            db.add(sub)
            await db.flush()

            pay = Payment(
                user_id=m_prof.user_id, subscription_id=sub.id,
                amount=plan.price, status=PaymentStatus.paid,
                method=random.choice(methods),
                paid_at=datetime.now(timezone.utc) - timedelta(days=random.randint(0, 5))
            )
            db.add(pay)

        # ── Attendance ─────────────────────────────────────────────
        for m_prof in member_profiles:
            for _ in range(random.randint(1, 4)):
                days_ago = random.randint(0, 10)
                db.add(Attendance(
                    user_id=m_prof.user_id, date=date.today() - timedelta(days=days_ago),
                    check_in=datetime.now(timezone.utc) - timedelta(days=days_ago, hours=random.randint(1,4)),
                    check_out=datetime.now(timezone.utc) - timedelta(days=days_ago, minutes=random.randint(30, 90))
                ))
            # Active session today for a few members
            if random.random() > 0.7:
                db.add(Attendance(
                    user_id=m_prof.user_id, date=date.today(),
                    check_in=datetime.now(timezone.utc) - timedelta(minutes=random.randint(10, 120))
                ))

        await db.commit()

    print(f"\n✅  Database successfully wiped and seeded with {len(member_names)} members and {len(trainer_data)} trainers!")
    print("─" * 40)
    print("  Admin:   admin@ironpulse.com  / admin123")
    print(f"  Trainer: ayush@ironpulse.com / trainer123")
    print(f"  Members: arham@example.com / member123")
    print("─" * 40)

if __name__ == "__main__":
    asyncio.run(seed())
