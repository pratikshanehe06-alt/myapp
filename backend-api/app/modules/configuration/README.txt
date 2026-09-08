# Configuration Engine (Phase 7) — deferred per fast-path plan.
#
# When built, this module will store customer-specific thresholds, KPI
# formulas, and dashboard configuration as data (Section 9 of master spec).
# For now, thresholds live directly on Tag records (warning_threshold,
# critical_threshold in app/modules/tags/models.py) — functionally
# equivalent to configuration data, just not yet exposed through a
# dedicated configuration-authoring API/UI.
