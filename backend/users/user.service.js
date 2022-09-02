const fs = require("fs");
const bcrypt = require("bcryptjs");
const db = require("../utils/db");
const jwt = require("jsonwebtoken");
const path = require("path");

const FabricCAServices = require("fabric-ca-client");
const { Gateway, Wallets } = require("fabric-network");

const User = db.User;

const authenticate = async ({ username, password }) => {
  console.log("authenticating...");
  try {
    const user = await User.findOne({ username });
    console.log(user);

    if (user && bcrypt.compareSync(password, user.hash)) {
      const token = jwt.sign({ sub: user.id }, process.env.MONGODB_SECRET, {
        expiresIn: "7d",
      });
      return {
        ...user.toJSON(),
        token,
      };
    }
    throw new Error("Failed to authenticate user");
  } catch (err) {
    console.error(`Authentication failed due to: ${err}`);
  }
};

const getById = async (id) => {
  return await User.findById(id);
};

const enrollAdmin = async () => {
  console.log("enrolling admin ...");
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "fabric",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get("admin");
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put("admin", x509Identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
  } catch (err) {
    console.error(`Failed to enroll admin user "admin": ${err}`);
    // process.exit(1);
  }
};

const create = async (userParam) => {
  console.log(userParam);
  try {
    if (await User.findOne({ username: userParam.username })) {
      throw `Username ${userParam.username} already exists`;
    }

    const user = new User(userParam);

    if (userParam.password) {
      user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "fabric",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(user.username);
    if (userIdentity) {
      console.log(
        `An identity for the user "${user.username}" already exists in the wallet`
      );
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      console.log("Run the enrollAdmin.js application before retrying");
      return;
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID: user.username,
        role: "client",
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: user.username,
      enrollmentSecret: secret,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put(user.username, x509Identity);
    console.log(
      `Successfully registered and enrolled admin user "${user.username}" and imported it into the wallet`
    );

    await user.save();
  } catch (err) {
    console.error(`Failed to create user: ${err}`);
    // process.exit(1);
  }
};

module.exports = {
  authenticate,
  enrollAdmin,
  create,
  getById,
};
