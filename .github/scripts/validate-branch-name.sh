#!/bin/bash
#
# Validate branch name for preview deployments
#
# This script validates that a branch name meets the requirements for
# creating App Runner services and other AWS resources.
#
# Usage:
#   ./validate-branch-name.sh <branch-name>
#
# Requirements:
#   - Max 30 characters (after sanitization)
#   - Only lowercase alphanumeric and hyphens
#   - Cannot start or end with hyphen
#
# Exit codes:
#   0 - Branch name is valid
#   1 - Branch name is invalid

set -e

BRANCH_NAME="${1}"
MAX_LENGTH=30

if [ -z "$BRANCH_NAME" ]; then
    echo "Error: Branch name is required"
    echo "Usage: $0 <branch-name>"
    exit 1
fi

echo "Validating branch name: $BRANCH_NAME"
echo ""

# Calculate what the sanitized name would be
SANITIZED=$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
TRUNCATED="${SANITIZED:0:$MAX_LENGTH}"

echo "Original:  $BRANCH_NAME"
echo "Sanitized: $SANITIZED"
echo "Truncated: $TRUNCATED"
echo "Length:    ${#SANITIZED} (max: $MAX_LENGTH)"
echo ""

# Check if the branch name is too long BEFORE truncation causes issues
# We want to warn if significant truncation happens
ORIGINAL_SANITIZED_LENGTH=${#SANITIZED}

if [ "$ORIGINAL_SANITIZED_LENGTH" -gt "$MAX_LENGTH" ]; then
    TRUNCATION_AMOUNT=$((ORIGINAL_SANITIZED_LENGTH - MAX_LENGTH))
    echo "Warning: Branch name will be truncated by $TRUNCATION_AMOUNT characters"
    echo ""

    # Check if truncation would cause confusion (cutting off meaningful parts)
    if [ "$TRUNCATION_AMOUNT" -gt 10 ]; then
        echo "Error: Branch name is too long!"
        echo ""
        echo "The branch name '$BRANCH_NAME' is $ORIGINAL_SANITIZED_LENGTH characters after sanitization."
        echo "This exceeds the maximum of $MAX_LENGTH characters by $TRUNCATION_AMOUNT characters."
        echo ""
        echo "Long branch names cause issues with:"
        echo "  - App Runner service names (max 40 chars total)"
        echo "  - ECR image tags"
        echo "  - SSM parameter names"
        echo "  - CloudWatch log group names"
        echo ""
        echo "Please use a shorter branch name. Suggestions:"
        echo "  - Use abbreviations (feat/ instead of feature/)"
        echo "  - Use ticket numbers (ABC-123 instead of full description)"
        echo "  - Keep feature descriptions brief"
        echo ""
        echo "Example good branch names:"
        echo "  feat/add-login"
        echo "  fix/nav-bug"
        echo "  ABC-123-user-auth"
        echo ""
        exit 1
    fi
fi

# Check for empty result after sanitization
if [ -z "$TRUNCATED" ]; then
    echo "Error: Branch name results in empty string after sanitization"
    echo ""
    echo "The branch name '$BRANCH_NAME' contains no valid characters."
    echo "Branch names must contain at least one alphanumeric character."
    exit 1
fi

# Final validation passed
echo "Branch name is valid!"
echo ""
echo "Preview resources will use: $TRUNCATED"
exit 0
