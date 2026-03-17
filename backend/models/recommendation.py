"""
models/recommendation.py
------------------------
UserRecommendationRequest ORM model.
Logs every set of user preferences submitted to the recommendation
engine — useful for analytics and future ML training data.
"""
from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from database.base import Base


class UserRecommendationRequest(Base):
    """Persists user preference inputs sent to the recommendation engine."""
    __tablename__ = "user_recommendation_requests"

    id = Column(Integer, primary_key=True, index=True)

    # --- User context (optional: no auth required in Phase 2) ---
    session_id = Column(String(64), nullable=True, index=True)

    # --- Preference inputs ---
    car_model = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    budget_min = Column(Float, nullable=True)        # Annual premium lower bound (₹)
    budget_max = Column(Float, nullable=True)        # Annual premium upper bound (₹)
    coverage_preference = Column(String(50), nullable=True)  # e.g. "comprehensive"

    # --- Result snapshot ---
    recommended_policy_ids = Column(Text, nullable=True)  # Comma-separated IDs

    # --- Timestamps ---
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def __repr__(self) -> str:
        return (
            f"<UserRecommendationRequest id={self.id} "
            f"car={self.car_model!r} city={self.city!r}>"
        )
