// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

//***************************
//** Mint Token *************
//***************************

var xrpl = require("xrpl");

export default async function handler(req, res) {
  const userXrpPrivateKey = req.body.xrpPrivateKey;
  
  const clientWallet = xrpl.Wallet.fromSeed(userXrpPrivateKey);
  const custodianWallet = xrpl.Wallet.fromSeed(xrpIssuerPrivateKey);
  const client = new xrpl.Client(xrpNFTServer);
  await client.connect();
  console.log("Connected to Sandbox");

  const accSetTransactionBlob = {
    TransactionType: "AccountSet",
    Account: custodianWallet.classicAddress,
    NFTokenMinter: clientWallet.classicAddress,
    SetFlag: 10, //Allow another acc to mint token.
  };

  const accSetRes = await client.submitAndWait(accSetTransactionBlob, {
    wallet: custodianWallet,
  });
  // console.log(
  //   "AccSet transaction result:",
  //   accSetRes.result.meta.TransactionResult
  // );
  // console.log("AccSet response:", accSetRes);

  // Note that you must convert the token URL to a hexadecimal
  // value for this transaction.
  // ----------------------------------------------------------
  const transactionBlob = {
    TransactionType: "NFTokenMint",
    Issuer: custodianWallet.classicAddress,
    Account: clientWallet.classicAddress,
    URI: xrpl.convertStringToHex(metadata),
    Flags: 9,
    TransferFee: 0,
    NFTokenTaxon: 0, //Required, but if you have no use for it, set to zero.
  };
  // Submit signed blob --------------------------------------------------------
  const tx = await client.submitAndWait(transactionBlob, {
    wallet: clientWallet,
  });
  client.disconnect();

  // Check transaction results -------------------------------------------------
  // console.log("Transaction result:", tx.result.meta.TransactionResult);
  // console.log(
  //   "Balance changes:",
  //   JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  // );
  // const nfts = await client.request({
  //   method: "account_nfts",
  //   account: clientWallet.classicAddress,
  // });
  // console.log("client account nft:", nfts);


  let meta_serialized = tx.result.meta.AffectedNodes.map((item) => {
    return [
      item.ModifiedNode.LedgerEntryType,
      {
        FinalFields: item.ModifiedNode.FinalFields,
        PreviousFields: item.ModifiedNode.PreviousFields,
      },
    ];
  });

  let meta_json = Object.fromEntries(new Map(meta_serialized));

  let FinalFields = meta_json.NFTokenPage.FinalFields.NFTokens.map((item) => {
    return item.NFToken.NFTokenID;
  });

  let PreviousFields = meta_json.NFTokenPage.PreviousFields.NFTokens.map(
    (item) => {
      return item.NFToken.NFTokenID;
    }
  );

  let NFTokenID = FinalFields.filter(function (NFToken) {
    return PreviousFields.indexOf(NFToken) < 0;
  });
  res.status(200).json(NFTokenID);
  return;
} //End of mintToken
