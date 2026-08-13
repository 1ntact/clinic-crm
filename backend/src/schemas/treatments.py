from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class TreatmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    treatment: str
    price: Decimal
    is_main: bool
