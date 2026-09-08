from sqlalchemy.orm import Session

from app.modules.assets.models import Asset
from app.modules.tags.models import Tag
from app.modules.telemetry.models import TelemetryReading


def calculate_health_score(db: Session, asset: Asset) -> int:
    """
    Simple explainable health score: starts at 100, deducts points
    for each tag currently past its warning/critical threshold.
    Real APM engines get more sophisticated later (Phase 12 depth) —
    this version is intentionally simple and explainable for the demo.
    """
    tags = db.query(Tag).filter(Tag.asset_id == asset.id).all()
    if not tags:
        return 100

    score = 100
    for tag in tags:
        latest = (
            db.query(TelemetryReading)
            .filter(TelemetryReading.tag_id == tag.id)
            .order_by(TelemetryReading.timestamp.desc())
            .first()
        )
        if not latest:
            continue
        if tag.critical_threshold and latest.value >= tag.critical_threshold:
            score -= 25
        elif tag.warning_threshold and latest.value >= tag.warning_threshold:
            score -= 10

    return max(score, 0)


def get_plant_summary(db: Session, tenant_id: int) -> dict:
    assets = db.query(Asset).filter(Asset.tenant_id == tenant_id).all()
    total = len(assets)
    by_status: dict[str, int] = {}
    health_scores = []

    for a in assets:
        by_status[a.status] = by_status.get(a.status, 0) + 1
        health_scores.append(calculate_health_score(db, a))

    avg_health = round(sum(health_scores) / len(health_scores)) if health_scores else 100

    return {
        "total_assets": total,
        "running": by_status.get("running", 0),
        "idle": by_status.get("idle", 0),
        "fault": by_status.get("fault", 0),
        "stopped": by_status.get("stopped", 0),
        "maintenance": by_status.get("maintenance", 0),
        "offline": by_status.get("offline", 0),
        "average_health": avg_health,
        "critical_assets": sum(1 for h in health_scores if h < 50),
    }
