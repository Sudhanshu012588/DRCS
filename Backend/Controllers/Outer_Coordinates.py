import logging
from fastapi import HTTPException
from google import genai
from Types.BasePlan import FloorPlanResponse
logger = logging.getLogger(__name__)
async def Outer_Coordinates_Controller(plan, GEMINI_API_KEY):
    try:
        userId = plan.userId
        Outer_Coodinates = plan.Outer_Coodinates
        BHK = plan.BHK
        if not userId or not userId.strip():
            raise HTTPException(
                status_code=400,
                detail="userId must be provided"
            )

        if not Outer_Coodinates:
            raise HTTPException(
                status_code=400,
                detail="Outer_Coodinates cannot be empty"
            )

        if BHK not in (1, 2, 3, 4, 5):
            raise HTTPException(
                status_code=400,
                detail="BHK must be between 1 and 5"
            )
        prompt = f"""
        You are an architectural floor-plan layout assistant.

        Generate a proposed residential floor plan using the
        supplied plot boundary coordinates and BHK requirement.

        INPUT:
        Plot boundary coordinates: {Outer_Coodinates}
        Required BHK: {BHK}

        REQUIREMENTS:

        1. Treat the supplied coordinates as the exact outer
           boundary of the plot.

        2. Use the same coordinate system for every room.
           Represent each point as [x, y].

        3. Generate exactly {BHK} bedrooms.

        4. Include a living room, kitchen, bathrooms,
           dining area where feasible, and circulation space.

        5. Represent each room using its boundary corner points.
           Order the corners consistently around each room.

        6. Keep all room boundaries inside the plot boundary.

        7. Avoid unintended room overlaps and gaps.
           Shared walls should use matching coordinates.

        8. Respect the actual shape of the supplied plot.

        9. If a reasonable layout is infeasible, explain the
           limitation rather than fabricating a valid-looking plan.

        Return the structured JSON required by the response schema.
        """
        client = genai.Client(api_key=GEMINI_API_KEY)

        interaction = await client.aio.interactions.create(
            model="gemini-3.8-flash",
            input=prompt,
            generation_config={
                "thinking_level": "low"
            },
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": FloorPlanResponse.model_json_schema()
            },
        )
        result = FloorPlanResponse.model_validate_json(
            interaction.output_text
        )
        response = result.model_dump()
        response["userId"] = userId

        return response

    except HTTPException:
        raise

    except Exception as e:
        logger.exception("Floor plan generation failed")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate the floor plan"
        ) from e
