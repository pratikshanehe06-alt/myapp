# Template Engine (Phase 8) — deferred per fast-path plan.
#
# When built, this module will support create/clone/version/publish of
# Industry -> Asset -> Component -> Parameter -> Tag templates (Section 10).
# For now, the Manufacturing template is seeded directly as Asset/Tag data
# via seed_manufacturing.py — the APM engine already reads asset/tag data
# generically, so adding the real Template authoring UI later will not
# require changing any APM logic, only adding a management layer on top
# of the same data.
