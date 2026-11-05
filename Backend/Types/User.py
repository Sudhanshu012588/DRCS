from pydantic import BaseModel

class User(BaseModel):
    UserName:str
    Email:str
    Password:str