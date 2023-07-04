// try to keep this dep-free so we don't have to install deps
const { fetchJson, getChangedFiles, postRefreshCache } = require("./utils.js");

const [currentCommitSha] = process.argv.slice(2);

async function go() {
  const shaInfo = await fetchJson(
    "https://hanihusam-com.fly.dev/refresh-commit-sha.json",
    {
      timeoutTime: 10_000,
    }
  );
  let compareSha = shaInfo?.sha;
  if (!compareSha) {
    const buildInfo = await fetchJson(
      "https://hanihusam-com.fly.dev/build/info.json",
      {
        timeoutTime: 10_000,
      }
    );
    compareSha = buildInfo.data.sha;
    console.log(`No compare sha found, using build sha: ${buildInfo.data.sha}`);
  }
  if (typeof compareSha !== "string") {
    console.log("🤷‍♂️ No sha to compare to. Unsure what to refresh.");
    return;
  }

  const changedFiles =
    (await getChangedFiles(currentCommitSha, compareSha)) ?? [];
  const contentPaths = changedFiles
    .filter((f) => f.filename.startsWith("content"))
    .map((f) => f.filename.replace(/^content\//, ""));
  if (contentPaths.length) {
    console.log(`⚡️ Content changed. Requesting the cache be refreshed.`, {
      currentCommitSha,
      compareSha,
      contentPaths,
    });
    const response = await postRefreshCache({
      postData: {
        contentPaths,
        commitSha: currentCommitSha,
      },
    });
    console.log(`Content change request finished.`, { response });
  } else {
    console.log(
      "🆗 Not refreshing changed content because no content changed."
    );
  }
}

void go();
