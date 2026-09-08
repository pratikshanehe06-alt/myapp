from app.database import SessionLocal
from app.modules.tenants.models import Tenant
from app.modules.organization.models import Site, Area
from app.modules.assets.models import Asset
from app.modules.tags.models import Tag

db = SessionLocal()

tenant = db.query(Tenant).filter_by(slug="demo-manufacturing").first()
if not tenant:
    raise SystemExit("Run seed_tenant.py first — no demo tenant found.")

site = db.query(Site).filter_by(tenant_id=tenant.id, code="PLANT-A").first()
if not site:
    site = Site(tenant_id=tenant.id, name="Plant A", code="PLANT-A", location="Nashik, MH")
    db.add(site)
    db.flush()

area_names = ["Press Shop", "Machining Shop", "Utility Area"]
areas = {}
for name in area_names:
    a = db.query(Area).filter_by(site_id=site.id, name=name).first()
    if not a:
        a = Area(site_id=site.id, name=name, code=name.upper().replace(" ", "-"))
        db.add(a)
        db.flush()
    areas[name] = a

asset_templates = [
    ("Hydraulic Press", "Press Shop", [
        ("Hydraulic Pressure", "pressure", "bar", 180, 220),
        ("Oil Temperature", "temperature", "°C", 70, 85),
        ("Motor Current", "current", "A", 40, 55),
    ]),
    ("CNC", "Machining Shop", [
        ("Spindle Speed", "speed", "RPM", 8000, 9500),
        ("Motor Temperature", "temperature", "°C", 70, 85),
        ("Vibration", "vibration", "mm/s", 4.5, 7.0),
    ]),
    ("VMC", "Machining Shop", [
        ("Spindle Load", "load", "%", 80, 95),
        ("Coolant Temperature", "temperature", "°C", 45, 60),
    ]),
    ("Compressor", "Utility Area", [
        ("Discharge Pressure", "pressure", "bar", 8, 10),
        ("Motor Current", "current", "A", 30, 40),
        ("Vibration", "vibration", "mm/s", 4.0, 6.5),
    ]),
    ("Chiller", "Utility Area", [
        ("Supply Temperature", "temperature", "°C", 12, 18),
        ("Compressor Current", "current", "A", 25, 35),
    ]),
    ("Furnace", "Machining Shop", [
        ("Chamber Temperature", "temperature", "°C", 850, 950),
        ("Fuel Pressure", "pressure", "bar", 2, 3.5),
    ]),
    ("Pump", "Utility Area", [
        ("Discharge Pressure", "pressure", "bar", 5, 7),
        ("Motor Current", "current", "A", 15, 22),
    ]),
    ("Motor", "Machining Shop", [
        ("Winding Temperature", "temperature", "°C", 80, 100),
        ("Vibration", "vibration", "mm/s", 4.0, 7.0),
    ]),
]

created_count = 0
for i, (asset_type, area_name, tags) in enumerate(asset_templates, start=1):
    code = f"{asset_type.upper().replace(' ', '-')}-{i:02d}"
    existing = db.query(Asset).filter_by(tenant_id=tenant.id, asset_code=code).first()
    if existing:
        continue

    asset = Asset(
        tenant_id=tenant.id,
        area_id=areas[area_name].id,
        asset_code=code,
        name=f"{asset_type} {i:02d}",
        asset_type=asset_type,
        criticality="high" if asset_type in ("Hydraulic Press", "CNC", "Furnace") else "medium",
        status="offline",
    )
    db.add(asset)
    db.flush()

    for tag_name, parameter, unit, warn, crit in tags:
        db.add(Tag(
            asset_id=asset.id,
            tag_name=tag_name,
            parameter=parameter,
            unit=unit,
            warning_threshold=warn,
            critical_threshold=crit,
        ))
    created_count += 1

db.commit()
print(f"Manufacturing template seed complete. Created {created_count} new assets under {site.name}.")
