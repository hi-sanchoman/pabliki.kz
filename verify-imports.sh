#!/bin/bash

# Check if any component is still importing from the original landing project
grep -r "from \"@/components/" /Users/tyess/dev/pabliki.kz/src/components/landing --include="*.tsx" | grep -v "landing/ui" | grep -v "landing/theme" | head -10

# Count total files with potential issues
count=$(grep -r "from \"@/components/" /Users/tyess/dev/pabliki.kz/src/components/landing --include="*.tsx" | grep -v "landing/ui" | grep -v "landing/theme" | wc -l)

echo "Found $count files with potential import issues" 