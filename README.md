# fastAPI-celary-js

## Getting Started

These instructions will guide you through setting up and running the project on your local machine.

### Prerequisites

- Git
- Python 3.x
- Virtual environment (recommended)
- Redis installed and running

### Installation

1. **Clone the project repository:**

   ```bash
   https://github.com/EvaDigital/fastAPI-celary-js.git)https://github.com/EvaDigital/fastAPI-celary-js.git
   ```
2. **Navigate to the project directory
   ```bash
   cd fastAPI-celary-js
   ```
3. **Create and activate a virtual environment (recommended):
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```
4. Install project dependencies from the req.txt file:

   ```bash
   pip install -r req.txt
   ```
5. Create a db:
   ```bash
   python3 db.py
   ```
6. Run the following command to start the FastAPI application:

   ```bash
   python3 api/main.py
   ```
7. Open a new terminal window navigate to the api folder:
   ```bash
   cd api
   ```
8. Start the Celery worker with the following command (log level set to INFO):
   ```bash
   celery -A tasks:celery worker --loglevel=INFO
   ```


