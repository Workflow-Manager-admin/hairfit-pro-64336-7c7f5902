#!/bin/bash
cd /home/kavia/workspace/code-generation/hairfit-pro-64336-7c7f5902/hairfit_pro_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

