#!/usr/bin/env node

const { $ } = require("execa");
const { writeFile } = require("node:fs/promises");

console.log("setting up swapfile...");
$`fallocate -l 512M /swapfile`
  .then(() => $`chmod 0600 /swapfile`)
  .then(() => $`mkswap /swapfile`)
  .then(() => writeFile("/proc/sys/vm/swappiness", "10"))
  .then(() => $`swapon /swapfile`)
  .then(() =>
    writeFile("/proc/sys/vm/overcommit_memory", "1").finally(() => {
      console.log("swapfile setup complete");
    })
  );
