import json
import sys
from collections import Counter
from pathlib import Path

LEADS = Path(__file__).resolve().parent.parent / "data" / "leads.ndjson"


def load(path):
    rows = []
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def main():
    if not LEADS.exists():
        print("No leads yet.")
        return 0
    rows = load(LEADS)
    domains = Counter(r["email"].rsplit("@", 1)[-1] for r in rows)
    interest = Counter(r.get("interest") or "unspecified" for r in rows)
    print(f"Total leads: {len(rows)}")
    print("Top domains:")
    for d, n in domains.most_common(5):
        print(f"  {d:<24}{n}")
    print("Interest:")
    for k, n in interest.most_common():
        print(f"  {k:<24}{n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
