---
name: implement-plan
description: Implement a feature plan from a spec file, following the documented steps and reporting completed work
user-invocable: true
---

# Implement the following plan

Follow the `Instructions` to implement the `Plan` then `Report` the completed work.

IMPORTANT: If no plan is provided (i.e., $ARGUMENTS is empty or blank), STOP immediately and ask the user to provide one. Do not proceed with the planning process without one. Example usage: `/implement-plan specs/new-feature.md`

## Instructions
- Read the plan, think hard about the plan and implement the plan.

## Plan
$ARGUMENTS

## Report
- Summarize the work you've just done in a concise bullet point list.
- Report the files and total lines changed with `git diff --stat`
