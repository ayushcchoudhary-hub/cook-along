#!/bin/sh
# Runs the checker on the examples (must pass) and on broken plans (must fail with the expected message).
cd "$(dirname "$0")/.." || exit 1
fail=0
for p in examples/*/plan.json; do
  python3 scripts/plan.py "$p" -q >/dev/null || { echo "FAIL (should pass): $p"; fail=1; }
done
expect() { out=$(python3 scripts/plan.py "tests/$1.json" 2>&1); code=$?
  if [ $code -eq 0 ] && [ "$3" = error ]; then echo "FAIL (should error): $1"; fail=1
  elif ! printf '%s' "$out" | grep -q "$2"; then echo "FAIL (missing '$2'): $1"; fail=1
  else echo "ok  $1"; fi; }
expect missing-step   "no step makes it" error
expect us-units       "Use metric units" error
expect hold-too-short "keeps only" error
expect unsafe-probe   "below FSA guidance" error
expect oven-clash     "waits" warn
expect no-probe       "no step checks it is cooked" error
expect oven-fahrenheit "too hot for a home oven" error
exit $fail
