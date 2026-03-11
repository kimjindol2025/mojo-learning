#!/bin/bash
COMPILER="/home/kimjin/Desktop/kim/mojo-learning/compiler-impl/compiler-indent.js"
success=0
fail=0

for step in step{01,02,03,04,06,07,08,09,10}-*; do
  echo "=== Testing $step ==="
  for file in "$step"/*.mojo; do
    if [ -f "$file" ]; then
      name=$(basename "$file")
      if timeout 15 node "$COMPILER" "$file" >/dev/null 2>&1; then
        echo "  ✅ $name"
        ((success++))
      else
        echo "  ❌ $name"
        ((fail++))
      fi
    fi
  done
done

echo ""
echo "Results: $success passed, $fail failed"
