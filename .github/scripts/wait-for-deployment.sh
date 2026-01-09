#!/bin/bash
#
# Wait for App Runner deployment to complete
#
# This script checks if an App Runner service has an operation in progress
# and waits for it to complete before allowing a new deployment.
#
# Usage:
#   ./wait-for-deployment.sh <service-arn> [max-attempts] [interval-seconds]
#
# Arguments:
#   service-arn       - The ARN of the App Runner service
#   max-attempts      - Maximum number of polling attempts (default: 10)
#   interval-seconds  - Seconds between polling attempts (default: 60)
#
# Exit codes:
#   0 - Service is ready for deployment
#   1 - Service is still busy after max attempts
#   2 - Service is in a failed state
#   3 - Invalid arguments or service not found

set -e

SERVICE_ARN="${1}"
MAX_ATTEMPTS="${2:-10}"
INTERVAL="${3:-60}"

if [ -z "$SERVICE_ARN" ]; then
    echo "Error: Service ARN is required"
    echo "Usage: $0 <service-arn> [max-attempts] [interval-seconds]"
    exit 3
fi

echo "Checking deployment status for service..."
echo "  Service: $SERVICE_ARN"
echo "  Max attempts: $MAX_ATTEMPTS"
echo "  Interval: ${INTERVAL}s"
echo ""

# Status values that indicate an operation is in progress
IN_PROGRESS_STATUSES=("CREATE_IN_PROGRESS" "UPDATE_IN_PROGRESS" "DELETE_IN_PROGRESS" "OPERATION_IN_PROGRESS")

# Status values that indicate failure
FAILED_STATUSES=("CREATE_FAILED" "DELETE_FAILED" "DELETED")

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
    echo "Attempt $attempt/$MAX_ATTEMPTS: Checking service status..."

    # Get current service status
    STATUS=$(aws apprunner describe-service \
        --service-arn "$SERVICE_ARN" \
        --query 'Service.Status' \
        --output text 2>/dev/null || echo "NOT_FOUND")

    echo "  Status: $STATUS"

    # Check if service not found
    if [ "$STATUS" = "NOT_FOUND" ]; then
        echo "  Service not found - may need to be created"
        echo ""
        echo "Service is ready (not found, will be created)"
        exit 0
    fi

    # Check for failed status
    for failed_status in "${FAILED_STATUSES[@]}"; do
        if [ "$STATUS" = "$failed_status" ]; then
            echo ""
            echo "Error: Service is in failed state: $STATUS"
            echo "Manual intervention may be required."
            exit 2
        fi
    done

    # Check if operation is in progress
    is_in_progress=false
    for in_progress_status in "${IN_PROGRESS_STATUSES[@]}"; do
        if [ "$STATUS" = "$in_progress_status" ]; then
            is_in_progress=true
            break
        fi
    done

    if [ "$is_in_progress" = "true" ]; then
        if [ "$attempt" -eq "$MAX_ATTEMPTS" ]; then
            echo ""
            echo "Error: Service still has operation in progress after $MAX_ATTEMPTS attempts"
            echo ""
            echo "The service is currently being updated by another deployment."
            echo "Please wait for the current deployment to complete and try again."
            echo ""
            echo "To check the current status:"
            echo "  aws apprunner describe-service --service-arn \"$SERVICE_ARN\""
            echo ""
            echo "To view recent operations:"
            echo "  aws apprunner list-operations --service-arn \"$SERVICE_ARN\""
            exit 1
        fi

        remaining=$((MAX_ATTEMPTS - attempt))
        wait_time=$((remaining * INTERVAL))
        echo "  Operation in progress. Waiting ${INTERVAL}s before retry..."
        echo "  (${remaining} attempts remaining, max wait time: ${wait_time}s)"
        sleep "$INTERVAL"
    else
        # Service is in RUNNING or another stable state
        echo ""
        echo "Service is ready for deployment (status: $STATUS)"
        exit 0
    fi
done

# Should not reach here, but just in case
exit 1
