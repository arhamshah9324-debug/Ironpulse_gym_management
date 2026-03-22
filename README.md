# IronPulse - Gym Management System 💥

IronPulse is a modern, full-stack Gym Management System designed to handle gym operations at light speed. It features a stunning, animated React frontend and a robust, high-performance FastAPI backend.

## 🌟 Key Features
- **Role-Based Access Control (RBAC):** Tailored dashboards and capabilities for Admins, Trainers, and Members.
- **Automated Memberships & Renewals:** Seamlessly track and manage membership plans.
- **Real-time Analytics:** Interactive graphs and dashboard overviews for tracking business metrics and revenue.
- **Secure Authentication:** JWT-based user authentication and protected routing.
- **Sleek UI/UX:** A beautifully themed dark-mode interface powered by Tailwind CSS with smooth micro-interactions.

## 🚀 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, React Router
- **Backend:** Python, FastAPI, SQLAlchemy, Uvicorn
- **Database:** PostgreSQL
- **DevOps:** Docker, Docker Compose

## 🛠️ Getting Started

### Prerequisites
- Docker & Docker Compose installed on your local machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arhamshah9324-debug/Ironpulse_gym_management.git
   cd Ironpulse_gym_management
   ```

2. **Configure Environment Variables:**
   Copy the example environment file and update it with your secrets if necessary.
   ```bash
   cp .env.example .env
   ```

3. **Start the application with Docker:**
   ```bash
   docker compose up -d --build
   ```
   *This command will pull the required images, build the multi-stage frontend/backend architecture, initialize the PostgreSQL database, and start the application in detached mode.*

4. **Access the Application:**
   - **Frontend Dashboard:** [http://localhost:8000](http://localhost:8000)
   - **Backend API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

## 📂 Project Structure

- `/frontend` - React single-page application and UI components.
- `/backend` - FastAPI server, database models, schemas, and API routes.
- `docker-compose.yml` - Multi-container Docker orchestrated setup.
- `DEPLOYMENT.md` - Deployment notes and production guides.

## 📝 License
This project is licensed under the MIT License.
