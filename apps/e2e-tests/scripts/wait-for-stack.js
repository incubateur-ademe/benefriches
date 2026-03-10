#!/usr/bin/env node

const http = require("node:http");
const { setTimeout } = require("node:timers/promises");

const TIMEOUT = 120000; // 2 minutes in ms
const CHECK_INTERVAL = 1000; // 1 seconds
const url = "http://localhost:3001";

const startTime = Date.now();

async function checkStack() {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      resolve(res.statusCode < 500);
      req.abort();
    });

    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.abort();
      resolve(false);
    });
  });
}

async function wait() {
  while (Date.now() - startTime < TIMEOUT) {
    if (await checkStack()) {
      console.log("Stack is ready");
      process.exit(0);
    }
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`Waiting for stack... ${elapsed}s`);
    await setTimeout(CHECK_INTERVAL);
  }

  console.error("Timed out waiting for stack");
  process.exit(1);
}

wait();
