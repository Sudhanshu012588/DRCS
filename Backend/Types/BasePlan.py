from pydantic import BaseModel
from pydantic import BaseModel, Field
class BasePlan(BaseModel):
    userId:str
    Outer_Coodinates:list[list[float]]
    BHK:int

class Room(BaseModel):
    name: str
    type: str
    corners: list[list[float]] = Field(
        description="Room boundary vertices in [x, y] format"
    )


class FloorPlan(BaseModel):
    plot_coordinates: list[list[float]]
    rooms: list[Room]


class FloorPlanResponse(BaseModel):
    status: str
    userId: str
    floor_plan: FloorPlan