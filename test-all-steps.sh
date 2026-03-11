#!/bin/bash
COMPILER="compiler-impl/compiler-indent.js"

echo "=== Phase 7 Compilation Test: All Steps ==="
echo ""

# Test counters
total=0
passed=0

# Function to test a mojo file
test_file() {
  local file=$1
  total=$((total + 1))
  
  if node "$COMPILER" "$file" > /tmp/test_output.txt 2>&1; then
    if grep -q "✅ Compilation succeeded" /tmp/test_output.txt; then
      echo "✅ $(basename $file)"
      passed=$((passed + 1))
      return 0
    fi
  fi
  echo "❌ $(basename $file)"
  return 1
}

# Test all steps
for step_dir in step*; do
  if [ -d "$step_dir" ]; then
    echo "📁 Testing $step_dir:"
    for file in "$step_dir"/*.mojo; do
      if [ -f "$file" ]; then
        test_file "$file"
      fi
    done
    echo ""
  fi
done

echo "=== Results ==="
echo "✅ Passed: $passed / $total"
echo "📊 Success Rate: $((passed * 100 / total))%"
