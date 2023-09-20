from pydantic import BaseModel

class Task(BaseModel):
    title: str
    description: str
    is_completed: bool = False