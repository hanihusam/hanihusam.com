const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const SHA = process.env.COMMIT_SHA;

async function getCommitInfo() {
  if (!SHA) return `No COMMIT_SHA environment variable set.`;
  try {
    const response = await fetch(
      `https://api.github.com/repos/hanihusam/hanihusam.com/commits/${SHA}`
    );
    const data = await response.json();

    return {
      author: data.commit.author.name,
      timestamp: data.commit.author.date,
      sha: data.sha,
      message: data.commit.message,
      url: data.html_url,
    };
  } catch (e) {
    console.error(`💣 fetch failed with ${e.message}`);
  }
}

async function run() {
  const data = {
    timestamp: Date.now(),
    data: await getCommitInfo(),
  };

  fs.writeFileSync(
    path.join(__dirname, "../public/build/info.json"),
    JSON.stringify(data, null, 2)
  );
}
run();
