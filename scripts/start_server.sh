#!/bin/bash
pm2 restart all || pm2 start index.js
