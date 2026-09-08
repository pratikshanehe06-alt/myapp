"""
Telemetry Simulator for CoreOT.
Generates realistic fake telemetry for all seeded assets, on a loop, and
updates each asset's machine state — standing in for real OPC UA/MQTT
connectivity during the demo phase (master doc Section 12).

Run with: python simulate_telemetry.py
Stop with Ctrl+C. Leave running in its own terminal tab during a demo.
"""
import random
import time
from datetime import datetime, timezone

from app.database import SessionLocal
from app.modules.tenants.models import Tenant  # noqa: F401 — needed for FK resolution
from app.modules.organization.models import Site, Area  # noqa: F401 — needed for FK resolution
from app.modules.assets.models import Asset
from app.modules.tags.models import Tag
from app.modules.telemetry.models import TelemetryReading

STATE_WEIGHTS = {
    "running": 0.70,
    "idle": 0.15,
    "fault": 0.05,
    "maintenance": 0.05,
    "offline": 0.05,
}


def pick_state() -> str:
    return random.choices(list(STATE_WEIGHTS.keys()), weights=list(STATE_WEIGHTS.values()))[0]


def generate_value(tag: Tag, state: str) -> float:
    warn = tag.warning_threshold or 100
    crit = tag.critical_threshold or 120
    baseline = warn * 0.6

    if state == "fault":
        return round(random.uniform(crit, crit * 1.15), 2)
    if state == "running":
        return round(random.uniform(baseline * 0.85, warn * 0.95), 2)
    if state == "idle":
        return round(random.uniform(baseline * 0.3, baseline * 0.6), 2)
    return round(random.uniform(0, baseline * 0.2), 2)


def run_cycle():
    db = SessionLocal()
    try:
        assets = db.query(Asset).all()
        for asset in assets:
            new_state = pick_state()
            asset.status = new_state

            tags = db.query(Tag).filter(Tag.asset_id == asset.id).all()
            for tag in tags:
                value = generate_value(tag, new_state)
                db.add(TelemetryReading(
                    tenant_id=asset.tenant_id,
                    asset_id=asset.id,
                    tag_id=tag.id,
                    value=value,
                    quality="good",
                    timestamp=datetime.now(timezone.utc),
                ))

        db.commit()
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Simulated telemetry for {len(assets)} assets.")
    finally:
        db.close()


if __name__ == "__main__":
    print("CoreOT Telemetry Simulator running. Press Ctrl+C to stop.")
    try:
        while True:
            run_cycle()
            time.sleep(10)
    except KeyboardInterrupt:
        print("\nSimulator stopped.")
