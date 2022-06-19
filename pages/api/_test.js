// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// //***************************
// //** Mint Token *************
// //***************************

// const { idlFactory: idlFactory_nft } = require("./nft.did");
// const { idlFactory: idlFactory_xrp } = require("./xrp.did");
// const { idlFactory: idlFactory_bridge } = require("./bridge.did");

// var xrpl = require("xrpl");
// const Identity = require("@dfinity/identity");
// const { Actor } = require("@dfinity/agent");
// const { HttpAgent } = require("@dfinity/agent");
// const sha256 = require("sha256");
// const { Principal } = require("@dfinity/candid/lib/cjs/idl");
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));
// const { Ed25519KeyIdentity, Secp256k1KeyIdentity } = Identity;

// // *******************ENV VAR BEGIN*******************
// const buffer = process.env.PRINCIPAL;
// const canisterId_xrp = "e7vz4-wqaaa-aaaai-aclha-cai";
// const canisterId_nft = "n46fk-6qaaa-aaaai-ackxa-cai";
// const canisterId_bridge = "hgfyg-4yaaa-aaaai-acloq-cai";
// // *******************ENV VAR END*******************

// const privateKey = Uint8Array.from(sha256(buffer, { asBytes: true }));
// const identity = Secp256k1KeyIdentity.fromSecretKey(privateKey);

// const getActor = (canisterId, idlFactory, identity) => {
//   const agent = new HttpAgent({
//     fetch: fetch,
//     identity: identity,
//     host: `https://${canisterId}.ic0.app`,
//   });

//   const actor = Actor.createActor(idlFactory, {
//     agent,
//     canisterId: canisterId,
//   });
//   return actor;
// };

// let getMapping = async (actor) => {
//   const res = await actor.getMapping().catch((e) => {
//     return "Error" + e;
//   });
//   return res;
// };

// let actor_xrp = getActor(canisterId_xrp, idlFactory_xrp, identity);
// let actor_nft = getActor(canisterId_nft, idlFactory_nft, identity);
// let actor_bridge = getActor(canisterId_xrp, idlFactory_bridge, identity);

// new map = []
// getMapping(actor_xrp).then(async (canisterRes) => {
//   // for loop
//   //   map[canisterRes["ok"]["Principal"]] = canisterRes["ok"]["PrivateKey"]

//   // map is []
//   if (typeof map[userPrincipal] == "undefined") {
//     res.status(400).json({ err: `Unknown Users: ${userPrincipal}` });
//     return;
//   } else if (map[userPrincipal]["privateKey"] != userXrpPrivateKey) {
//     res.status(400).json({ err: `Unauthorized user: ${userPrincipal}` });
//     return;
//   }

// });

// // getMapping(actor_xrp).then((res2) => {
// //   res2["ok"].forEach((element, index) => {
// //     let tempPrincipal = element[0].toString();
// //     let tempPrivateKey = element[1]["privateKey"];
// //     console.log(tempPrincipal, tempPrivateKey);
// //   });
// // });

// // const userPrinciple = req.body.principle.value;
// // const userScret = req.body.secret.value;

// // export default async function handler(req, res) {

// //   const clientWallet = xrpl.Wallet.fromSeed(userScret);
// //   const custodianWallet = xrpl.Wallet.fromSeed("ssyVXJ4WRiZWt34TE92eXDhveofn5");
// //   const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
// //   await client.connect();
// //   console.log("Connected to Sandbox");

// //   const accSetTransactionBlob = {
// //     TransactionType: "AccountSet",
// //     Account: custodianWallet.classicAddress,
// //     NFTokenMinter: clientWallet.classicAddress,
// //     SetFlag: 10, //Allow another acc to mint token.
// //   };

// //   const accSetRes = await client.submitAndWait(accSetTransactionBlob, {
// //     wallet: custodianWallet,
// //   });
// //   console.log(
// //     "AccSet transaction result:",
// //     accSetRes.result.meta.TransactionResult
// //   );
// //   console.log("AccSet response:", accSetRes);

// //   // Note that you must convert the token URL to a hexadecimal
// //   // value for this transaction.
// //   // ----------------------------------------------------------
// //   const transactionBlob = {
// //     TransactionType: "NFTokenMint",
// //     Issuer: custodianWallet.classicAddress,
// //     Account: clientWallet.classicAddress,
// //     URI: xrpl.convertStringToHex(req.body.tokenUrl.value),
// //     Flags: 8,
// //     NFTokenTaxon: 0, //Required, but if you have no use for it, set to zero.
// //   };
// //   // Submit signed blob --------------------------------------------------------
// //   const tx = await client.submitAndWait(transactionBlob, {
// //     wallet: clientWallet,
// //   });

// //   // Check transaction results -------------------------------------------------
// //   console.log("Transaction result:", tx.result.meta.TransactionResult);

// //   const nfts = await client.request({
// //     method: "account_nfts",
// //     account: clientWallet.classicAddress,
// //   });
// //   console.log("client account nft:", nfts.result.account_nfts[0]);

// //   client.disconnect();

// //   res.status(200).json({ response: "Minting token successful!" });
// // } //End of mintToken
// const getNFTokenID (tx)=>{
//   tx.result.meta.AffectedNodes
// }
