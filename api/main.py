from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from tasks import add_task_to_db, delete_task_from_db
from model import Task
import uvicorn
import httpx
import sqlite3
import json


app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


origins = [
    "http://localhost",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "8c142c8c2c270d8e67304394f38ac314"

@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/tasks/create/")
async def create_task(task: Task):
    try:
        task_dict = task.dict()  
        task_json = json.dumps(task_dict)
        add_task_to_db.delay(task_json)
        return {"message": task}
    except Exception as err:
        print(err) 


@app.get("/tasks/list/")
async def get_tasks():
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()

    cursor.execute('SELECT id, title, description, is_completed FROM tasks')
    rows = cursor.fetchall()
    
    tasks = []
    for row in rows:
        task = {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'is_completed': bool(row[3])
        }
        tasks.append(task)

    conn.close()

    return {"message": tasks}


@app.delete("/tasks/delete/{task_id}")
async def delete_task(task_id: int):
    try:
        print('start')
        delete_task_from_db(task_id)
        return {"message": f"Task '{task_id}' has been deleted"}
    except Exception as err:
        print(err)


@app.get("/weather/{city}")
async def get_weather(city: str):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                weather_data = response.json()
                return {"weather": weather_data}
            else:
                return {"error": "Something went wrong"}

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)