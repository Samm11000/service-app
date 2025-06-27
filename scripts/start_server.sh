#!/bin/bash
cd /home/ec2-user/service-app-backend
pm2 start index.js --name service-app || pm2 restart service-app
