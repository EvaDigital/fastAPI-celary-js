from celery import Celery
import sqlite3
import json

celery = Celery("tasks", broker="redis://localhost:6379/0")

@celery.task
def add_task_to_db(task_json):
    try:
        task = json.loads(task_json)

        conn = sqlite3.connect('../tasks.db')
        cursor = conn.cursor()

        cursor.execute('INSERT INTO tasks (title, description, is_completed) VALUES (?, ?, ?)',
                    (task['title'], task['description'], True))
        
        conn.commit()
        conn.close()
    except Exception as err:
        print(err)


@celery.task
def delete_task_from_db(task_id):
    try:
        conn = sqlite3.connect('tasks.db')
        cursor = conn.cursor()

        cursor.execute('SELECT id FROM tasks WHERE id = ?', (task_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return {"message": f"Task with '{task_id}' not found"}, 404

        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
        conn.close()
    except Exception as err:
        print(err)