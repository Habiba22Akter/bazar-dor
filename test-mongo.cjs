const { loadEnvConfig } = require("@next/env");
const { MongoClient } = require("mongodb");

loadEnvConfig(process.cwd());

// Error message-এ connection string থাকলে credentials আড়াল করবে।
function safeMessage(message) {
  return String(message || "").replace(
    /mongodb(?:\+srv)?:\/\/[^@\s]+@/gi,
    "mongodb://[credentials-hidden]@"
  );
}

function printError(error) {
  const seen = new Set();
  let current = error;
  let level = 0;

  while (current && !seen.has(current) && level < 5) {
    seen.add(current);

    console.log(level === 0 ? "ERROR:" : "CAUSE:", current.name);
    console.log("CODE:", current.code || "none");
    console.log("MESSAGE:", safeMessage(current.message));

    current = current.cause;
    level += 1;
  }
}

async function main() {
  const uri = process.env.BETTER_AUTH_DB_URL;

  if (!uri) {
    console.error("BETTER_AUTH_DB_URL পাওয়া যায়নি।");
    process.exitCode = 1;
    return;
  }

  let client;

  try {
    client = new MongoClient(uri, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("Node:", process.version);
    console.log("MongoDB connection পরীক্ষা হচ্ছে…");

    await client.connect();
    await client.db().command({ ping: 1 });

    console.log("SUCCESS: MongoDB connected.");
  } catch (error) {
    console.log("FAILED");
    printError(error);

    const servers = error.reason?.servers;

    if (servers) {
      for (const [address, server] of servers) {
        console.log("\nSERVER:", address);
        console.log("ROLE:", server.type);

        if (server.error) {
          printError(server.error);
        } else {
          console.log("ERROR: none");
        }
      }
    }

    process.exitCode = 1;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

main().catch((error) => {
  console.error("Test চালানো যায়নি।");
  printError(error);
  process.exitCode = 1;
});