// try to keep this dep-free so we don't have to install deps
const { execSync } = require("child_process");
const https = require("https");

function fetchJson(url, { timoutTime } = {}) {
  return new Promise((resolve, reject) => {
    const request = https
      .get(url, (res) => {
        let data = "";
        res.on("data", (d) => {
          data += d;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (e) => {
        reject(e);
      });
    if (timoutTime) {
      setTimeout(() => {
        request.destroy(new Error("Request timed out"));
      }, timoutTime);
    }
  });
}

const changeTypes = {
  M: "modified",
  A: "added",
  D: "deleted",
  R: "moved",
};

async function getChangedFiles(currentCommitSha, compareCommitSha) {
  try {
    const lineParser = /^(?<change>\w).*?\s+(?<filename>.+$)/;
    const gitOutput = execSync(
      `git diff --name-status ${currentCommitSha} ${compareCommitSha}`
    ).toString();
    const changedFiles = gitOutput
      .split("\n")
      .map((line) => line.match(lineParser)?.groups)
      .filter(Boolean);
    const changes = [];
    for (const { change, filename } of changedFiles) {
      const changeType = changeTypes[change];
      if (changeType) {
        changes.push({ changeType: changeTypes[change], filename });
      } else {
        console.error(`Unknown change type: ${change} ${filename}`);
      }
    }
    return changes;
  } catch (error) {
    console.error(`Something went wrong trying to get changed files.`, error);
    return null;
  }
}

const hostname =
  process.env.GITHUB_REF_NAME === "dev"
    ? "hanihusam-com.fly.dev"
    : "hanihusam.com";

// try to keep this dep-free so we don't have to install deps
async function postRefreshCache({
  http,
  postData,
  options: { headers: headersOverrides, ...optionsOverrides } = {},
}) {
  if (!http) {
    http = https;
  }
  return new Promise((resolve, reject) => {
    try {
      const postDataString = JSON.stringify(postData);
      const options = {
        hostname,
        port: 443,
        path: `/action/refresh-cache`,
        method: "POST",
        headers: {
          auth: process.env.REFRESH_TOKEN,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postDataString),
          ...headersOverrides,
        },
        ...optionsOverrides,
      };

      const req = http
        .request(options, (res) => {
          let data = "";
          res.on("data", (d) => {
            data += d;
          });

          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(data);
            }
          });
        })
        .on("error", reject);
      req.write(postDataString);
      req.end();
    } catch (error) {
      console.log("oh no", error);
      reject(error);
    }
  });
}

module.exports = { fetchJson, getChangedFiles, postRefreshCache };
