#!/usr/bin/env python3
"""
seed_policies.py
================
Seeds the PolicyWise AI database with 20 sample Indian car insurance policies.

Usage:
    1. Ensure the backend is running on http://localhost:8000
    2. Run from the project root:
       .venv\\Scripts\\python scripts\\seed_policies.py

The script is idempotent — it gracefully skips duplicates if the backend
returns a 409 or if the policy already exists (checked by name + insurer).
"""

import json
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("❌ 'requests' library not found. Install it with:\n   pip install requests")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────

BASE_URL = "http://localhost:8000"
POLICIES_ENDPOINT = f"{BASE_URL}/api/v1/policies/"
SEED_FILE = Path(__file__).parent.parent / "data" / "raw" / "policies" / "policies_seed.json"

# ── Helpers ───────────────────────────────────────────────────────────────────


def get_existing_policies() -> set[str]:
    """Fetch already-seeded policy names to enable idempotent seeding."""
    try:
        resp = requests.get(POLICIES_ENDPOINT, params={"limit": 100}, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        policies = data.get("data") or []
        # Create a key of name+insurer for de-duplication
        return {f"{p['name']}::{p['insurer_name']}" for p in policies}
    except requests.RequestException as e:
        print(f"⚠️  Could not fetch existing policies: {e}")
        return set()


def seed_policy(policy: dict, existing_keys: set) -> tuple[str, str]:
    """
    POST a single policy to the API.
    Returns ('created' | 'skipped' | 'error', message).
    """
    key = f"{policy['name']}::{policy['insurer_name']}"
    if key in existing_keys:
        return "skipped", policy["name"]

    try:
        resp = requests.post(POLICIES_ENDPOINT, json=policy, timeout=10)
        if resp.status_code in (200, 201):
            return "created", policy["name"]
        else:
            detail = resp.json().get("detail") or resp.text
            return "error", f"{policy['name']}: {detail}"
    except requests.RequestException as e:
        return "error", f"{policy['name']}: {e}"


# ── Main ──────────────────────────────────────────────────────────────────────


def main() -> None:
    print("\n🌱  PolicyWise AI — Database Seeder")
    print("=" * 45)

    # Check backend health
    print("\n1. Checking backend health...")
    try:
        health = requests.get(f"{BASE_URL}/api/v1/health/", timeout=5)
        health.raise_for_status()
        print(f"   ✅ Backend is live at {BASE_URL}")
    except requests.RequestException:
        print(f"   ❌ Cannot reach backend at {BASE_URL}")
        print("      Make sure the backend is running:")
        print("      cd policywise-ai/backend && .venv\\Scripts\\uvicorn main:app --reload")
        sys.exit(1)

    # Load seed file
    print("\n2. Loading seed file...")
    if not SEED_FILE.exists():
        print(f"   ❌ Seed file not found: {SEED_FILE}")
        sys.exit(1)

    with open(SEED_FILE, encoding="utf-8") as f:
        policies: list[dict] = json.load(f)
    print(f"   ✅ Loaded {len(policies)} policies from {SEED_FILE.name}")

    # Fetch existing policies (idempotency)
    print("\n3. Checking for existing policies (idempotent run)...")
    existing = get_existing_policies()
    print(f"   Found {len(existing)} existing policies in DB")

    # Seed each policy
    print(f"\n4. Seeding {len(policies)} policies...")
    print("-" * 45)

    created = []
    skipped = []
    errors = []

    for policy in policies:
        status, msg = seed_policy(policy, existing)
        if status == "created":
            created.append(msg)
            print(f"   ✅ Created: {msg}")
        elif status == "skipped":
            skipped.append(msg)
            print(f"   ⏭️  Skipped (already exists): {msg}")
        else:
            errors.append(msg)
            print(f"   ❌ Error: {msg}")

    # Summary
    print("\n" + "=" * 45)
    print("✨  Seeding Complete!")
    print(f"   ✅ Created : {len(created)}")
    print(f"   ⏭️  Skipped : {len(skipped)}")
    print(f"   ❌ Errors  : {len(errors)}")

    if errors:
        print("\nErrors encountered:")
        for err in errors:
            print(f"   - {err}")

    if len(errors) == 0:
        print(f"\n🎉 All {len(created) + len(skipped)} policies ready in the database!")
        print(f"   View at: http://localhost:3000/compare")
    else:
        print("\n⚠️  Some policies failed to seed. Check errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
