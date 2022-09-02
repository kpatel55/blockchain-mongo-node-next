require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("./utils/jwt");

const { Gateway, Wallets } = require("fabric-network");
const { uuid } = require("uuidv4");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(jwt());
app.use("/users", require("./users/user.controller"));

app.get("/comments/:user", async (req, res) => {
  const user = req.params.user || "";

  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "fabric",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(user);
    if (!identity) {
      console.log(
        `An identity for the user "${user}" does not exist in the wallet`
      );
      console.log("Register the user before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: user,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("comment");

    // Submit the specified transaction.
    let result = await contract.evaluateTransaction("GetAllComments");
    result = JSON.parse(result);
    console.log("Response from blockchain:", result);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
});

app.post("/comment", async (req, res) => {
  const data = req.body;
  const userId = uuid();
  const timestamp = new Date(Date.now()).toISOString();
  const user = data.author || "";
  const userComment = data.comment || "";

  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "fabric",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(user);
    if (!identity) {
      console.log(
        `An identity for the user "${user}" does not exist in the wallet`
      );
      console.log("Register the user before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: user,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("comment");

    // Submit the specified transaction.
    let result = await contract.submitTransaction(
      "CreateComment",
      userId,
      user,
      userComment,
      timestamp
    );
    result = JSON.parse(result);
    console.log("Response from blockchain:", result);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
});

app.listen(process.env.PORT, "localhost", () => {
  console.log("Listening on port: " + process.env.PORT);
});
