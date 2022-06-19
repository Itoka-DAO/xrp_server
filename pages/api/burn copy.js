//***************************
//** Burn Token *************
//***************************

var xrpl = require("xrpl");

let idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ ok: IDL.Principal, err: IDL.Text });
  const XRPAccount = IDL.Record({
    publicKey: IDL.Text,
    privateKey: IDL.Text,
  });
  const Result_2 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Principal, XRPAccount)),
    err: IDL.Text,
  });
  const Result = IDL.Variant({ ok: XRPAccount, err: IDL.Text });
  const XRPAccountManager = IDL.Service({
    addCustodian: IDL.Func([IDL.Principal], [Result_1], []),
    getMapping: IDL.Func([], [Result_2], ["query"]),
    getXRPAccount: IDL.Func([], [Result], ["query"]),
    isRegisteredUser: IDL.Func([IDL.Principal], [IDL.Bool], ["query"]),
    removeCustodian: IDL.Func([IDL.Principal], [Result_1], []),
    setXRPAccount: IDL.Func([IDL.Text, IDL.Text], [Result], []),
    setXRPAccountByCustodian: IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Text],
      [Result],
      []
    ),
    whami_principal: IDL.Func([], [IDL.Principal], ["query"]),
    whami_text: IDL.Func([], [IDL.Text], ["query"]),
    whoAreCustodians: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
  });
  return XRPAccountManager;
};

const Identity = require("@dfinity/identity");
const Actor = require("@dfinity/agent").Actor;
const HttpAgent = require("@dfinity/agent").HttpAgent;
const sha256 = require("sha256");

const { Principal } = require("@dfinity/candid/lib/cjs/idl");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { Ed25519KeyIdentity, Secp256k1KeyIdentity } = Identity;

// *******************ENV VAR BEGIN*******************
const buffer = process.env.PRINCIPAL;
const canisterId_xrpAccountManager = "e7vz4-wqaaa-aaaai-aclha-cai";
// *******************ENV VAR END*******************

const privateKey = Uint8Array.from(sha256(buffer, { asBytes: true }));
const identity = Secp256k1KeyIdentity.fromSecretKey(privateKey);

const agent = new HttpAgent({
  fetch: fetch,
  identity: identity,
  host: `https://${canisterId_xrpAccountManager}.ic0.app`,
});

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId_xrpAccountManager,
});

let whami_principal = async () => {
  const res = await actor.whami_principal().catch((e) => {
    return "Error" + e;
  });
  return res;
};

let getMapping = async () => {
  const res = await actor.getMapping().catch((e) => {
    return "Error" + e;
  });
  return res;
};

export default async function handler(req, res) {
  const userPrinciple = req.body.principle.value;
  const userScret = req.body.secret.value;

  getMapping().then((res2) => {
    res2["ok"].forEach((element, index) => {
      if (userPrinciple == element[0].toString()) {
        if (userScret != element[1]["privateKey"]) {
          res.status(400).json({ response: "Unauthorized user!" });
        } else {
          console.log("User authorized!");
          return;
        }
      }
    });
  });

  const wallet = xrpl.Wallet.fromSeed(userScret);
  const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
  await client.connect();
  console.log("Burn token.");

  // Prepare transaction -------------------------------------------------------
  const transactionBlob = {
    TransactionType: "NFTokenBurn",
    Account: wallet.classicAddress,
    NFTokenID: req.body.tokenId.value,
  };

  // Submit signed blob --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob, { wallet });
  const nfts = await client.request({
    method: "account_nfts",
    account: wallet.classicAddress,
  });
  console.log(nfts);
  // Check transaction results -------------------------------------------------
  console.log("Transaction result:", tx.result.meta.TransactionResult);
  console.log(
    "Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  );
  client.disconnect();

  res.status(200).json({ response: "Burn token successful!" });
}
// End of burnToken()
