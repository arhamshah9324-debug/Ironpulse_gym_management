# backend/seed.py
# Populate the database with 15 members, 3 trainers, and realistic data
import asyncio
import sys, os
import random
from datetime import date, timedelta, datetime, timezone
from decimal import Decimal

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
            ("Trainer Ayush", "ayush@ironpulse.com", "Hypertrophy & Bodybuilding", "A seasoned bodybuilder and elite personal trainer specializing in extreme mass gain and competition prep. 8x National Powerlifting Champion."),
            ("Rohan Desai", "rohan.d@ironpulse.com", "Strength & Conditioning", "Certified strength coach working closely with athletes to improve explosive power, agility, and overall core structural strength."),
            ("Simran Kaur", "simran.k@ironpulse.com", "Yoga & Mobility", "Ashtanga Yoga certified practitioner focusing on mobility, active recovery, and breathwork aimed to reduce gym-based injuries."),
            ("Vikram Singh", "vikram.s@ironpulse.com", "HIIT & Cardio", "High-energy coach leading intense daily cardio and functional movement workshops. Known for pushing members to their absolute limit."),
        ]
        trainers, trainer_profiles = [], []
        for name, email, spec, bio in trainer_data:
            t_user = User(
                name=name, email=email,
                hashed_password=hash_password("trainer123"), role=UserRole.trainer
            )
            db.add(t_user)
            await db.flush()
            t_profile = Trainer(
                user_id=t_user.id, phone=f"+91 98{random.randint(10000000, 99999999)}",
                specialization=spec, bio=bio,
                experience_years=random.randint(4, 12), hourly_rate=Decimal(str(random.choice([800, 1200, 1500, 2500]))),
                certifications="NASM-CPT, ACE"
            )
            db.add(t_profile)
            await db.flush()
            trainer_profiles.append(t_profile)

        # ── Members (16) ───────────────────────────────────────────
        realistic_members = [
            ("Arham Shah", "arham@example.com", "401, Sapphire Heights, Andheri West, Mumbai"),
            ("Aarav Patel", "aarav.p@example.com", "B-12, Royal Enclave, Juhu, Mumbai"),
            ("Priya Sharma", "priya.s@example.com", "Villa 4, Palm Meadows, Bandra, Mumbai"),
            ("Karan Malhotra", "karan.m@example.com", "Flat 502, Skyline Towers, Lower Parel, Mumbai"),
            ("Neha Gupta", "neha.g@example.com", "304, Green Valley Apts, Powai, Mumbai"),
            ("Aditya Verma", "aditya.v@example.com", "House 18, Sterling Cooperative, Worli, Mumbai"),
            ("Ananya Rao", "ananya.r@example.com", "12, Seaside Villas, Carter Road, Mumbai"),
            ("Kabir Singh", "kabir.s@example.com", "A-wing 801, Metropolis, Malad West, Mumbai"),
            ("Isha Desai", "isha.d@example.com", "Apartment 9C, The Imperial, South Mumbai"),
            ("Rahul Mehra", "rahul.m@example.com", "Flat 22, Ocean View, Marine Drive, Mumbai"),
            ("Sneha Joshi", "sneha.j@example.com", "Building 4, Sector 7, Vashi, Navi Mumbai"),
            ("Varun Iyer", "varun.i@example.com", "D-102, Hiranandani Estate, Thane West"),
            ("Meera Nair", "meera.n@example.com", "501, Orchid Petals, Borivali East, Mumbai"),
            ("Siddharth Kapoor", "sidd.k@example.com", "18/A, Lotus Apartments, Colaba, Mumbai"),
            ("Riya Das", "riya.das@example.com", "203, Whispering Palms, Kandivali, Mumbai"),
            ("Arjun Reddy", "arjun.r@example.com", "Penthouse 1, Platinum Towers, Dadar, Mumbai"),
        ]

        members, member_profiles = [], []
        for name, email, addr in realistic_members:
            m_user = User(
                name=name, email=email,
                hashed_password=hash_password("member123"), role=UserRole.member
            )
            db.add(m_user)
            await db.flush()
            join_d = date.today() - timedelta(days=random.randint(5, 300))
            m_profile = Member(
                user_id=m_user.id, phone=f"+91 {random.randint(9000000000, 9999999999)}",
                join_date=join_d, date_of_birth=date(1985 + random.randint(0, 15), random.randint(1,12), random.randint(1,28)),
                address=addr, emergency_contact=name.split()[0] + "'s Relative", 
                emergency_phone=f"+91 {random.randint(9000000000, 9999999999)}",
                trainer_id=random.choice(trainer_profiles).id if random.random() < 0.8 and trainer_profiles else None
            )
            db.add(m_profile)
            member_profiles.append(m_profile)

        await db.flush()

        # ── Plans ──────────────────────────────────────────────────
        basic = Plan(name="Basic Monthly", duration_days=30, price=Decimal("1500.00"), features="Standard Weights area,Locker Room,Water Cooler", description="Essential access for casual gym-goers.", is_active=True)
        premium = Plan(name="Premium Quarterly", duration_days=90, price=Decimal("4000.00"), features="Weights area,Cardio Section,Sauna,Group Classes", description="Full access for a structured 3-month cycle.", is_active=True)
        annual = Plan(name="Annual Elite", duration_days=365, price=Decimal("15000.00"), features="All Access,Personalised Plan,Sauna,Nutrition Consulting,Guest Access", description="Best absolute value for serious athletes.", is_active=True)
        db.add_all([basic, premium, annual])
        await db.flush()
        plans = [basic, premium, annual]

        # ── Subscriptions & Payments ───────────────────────────────
        methods = list(PaymentMethod)
        for m_prof in member_profiles:
            plan = random.choice(plans)
            
            # 80% have active subscriptions
            is_active = random.random() < 0.8
            status = SubscriptionStatus.active if is_active else SubscriptionStatus.expired
            
            start = date.today() - timedelta(days=random.randint(10, plan.duration_days + 30))
            end = start + timedelta(days=plan.duration_days)
            if start > date.today() - timedelta(days=plan.duration_days) and not is_active:
                status = SubscriptionStatus.active # correct chronological errors
            
            sub = Subscription(
                member_id=m_prof.id, plan_id=plan.id,
                start_date=start,
                end_date=end,
                status=status
            )
            db.add(sub)
            await db.flush()

            # Record a payment for this
            pay_time = datetime.combine(start, datetime.min.time()).replace(tzinfo=timezone.utc)
            pay = Payment(
                user_id=m_prof.user_id, subscription_id=sub.id,
                amount=plan.price, status=PaymentStatus.paid,
                method=random.choice(methods),
                transaction_id=f"TXN{random.randint(1000000, 9999999)}",
                paid_at=pay_time
            )
            db.add(pay)

        # ── Attendance ─────────────────────────────────────────────
        # Active recent attendance to light up the dashboard charts
        for m_prof in member_profiles:
            attendance_freq = random.randint(1, 8)
            for _ in range(attendance_freq):
                days_ago = random.randint(0, 14)
                check_in_time = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=random.randint(1, 3))
                check_out_time = check_in_time + timedelta(minutes=random.randint(45, 120))
                db.add(Attendance(
                    user_id=m_prof.user_id, date=date.today() - timedelta(days=days_ago),
                    check_in=check_in_time, check_out=check_out_time
                ))
                
        # Simulate active current sessions
        active_now_count = random.randint(3, 7)
        active_members = random.sample(member_profiles, active_now_count)
        for m_prof in active_members:
            db.add(Attendance(
                user_id=m_prof.user_id, date=date.today(),
                check_in=datetime.now(timezone.utc) - timedelta(minutes=random.randint(5, 75))
            ))

        await db.commit()

    print(f"\n✅  Database successfully wiped and seeded with real-life oriented data!")
    print("─" * 40)
    print("  Admin credentials:   admin@ironpulse.com  / admin123")
    print(f"  Trainer credentials: ayush@ironpulse.com / trainer123")
    print(f"  Member credentials:  arham@example.com / member123")
    print("─" * 40)

if __name__ == "__main__":
    asyncio.run(seed())
