#!/bin/bash
cd /home/kavia/workspace/code-generation/to-do-list-application-338539-338553/to_do_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

