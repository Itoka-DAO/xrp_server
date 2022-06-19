// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

//***************************
//** Mint Token *************
//***************************

var xrpl = require("xrpl");
let getNFTokenIDs = (nfts) => {
  let NFTokenIDs = nfts.result.account_nfts.map((item) => {
    return item.NFTokenID;
  });
  return NFTokenIDs;
};
export default async function handler(req, res) {
  const userXrpPrivateKey = req.body.xrpPrivateKey;
  const xrpNFTServer = "wss://xls20-sandbox.rippletest.net:51233";
  const client = new xrpl.Client(xrpNFTServer);
  const clientWallet = xrpl.Wallet.fromSeed(userXrpPrivateKey);
  await client.connect();
  const nfts = await client.request({
    method: "account_nfts",
    account: clientWallet.classicAddress,
  });
  let NFTokenIDs = getNFTokenIDs(nfts);
  res.status(200).json({
    res: NFTokenIDs,
  });
}
