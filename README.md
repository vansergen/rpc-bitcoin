# rpc-bitcoin [![Build Status](https://travis-ci.com/vansergen/rpc-bitcoin.svg?token=cg5dVMovG8Db6p5Qzzps&branch=master)](https://travis-ci.com/vansergen/rpc-bitcoin)

A [TypeScript](https://www.typescriptlang.org) library to make RPC and HTTP REST requests to [Bitcoin Core](https://bitcoin.org/en/bitcoin-core/).

## Installation

```bash
npm install rpc-bitcoin
```

## [RPC](https://bitcoin.org/en/developer-reference#remote-procedure-calls-rpcs)

```javascript
const { RPCClient } = require("rpc-bitcoin");
const url = "http://192.168.0.10";
const user = "rpcuser";
const pass = "rpcpassword";
const port = 18832;
const timeout = 10000;
const client = new RPCClient({ url, port, timeout, user, pass });
```

- batch

```javascript
const response = await client.batch([
  { method: "getbestblockhash", id: 1 },
  { method: "help", params: { command: "help" }, id: "custom-id" },
  { method: "getzmqnotifications", params: {}, id: 2 }
]);
```

### Blockchain

- [`getbestblockhash`](https://bitcoin.org/en/developer-reference#getbestblockhash)

```javascript
const hex = await client.getbestblockhash();
```

- [`getblock`](https://bitcoin.org/en/developer-reference#getblock)

```javascript
const blockhash =
  "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
const verbosity = 2;
const block = await client.getblock({ blockhash, verbosity });
```

- [`getblockchaininfo`](https://bitcoin.org/en/developer-reference#getblockchaininfo)

```javascript
const info = await client.getblockchaininfo();
```

- [`getblockcount`](https://bitcoin.org/en/developer-reference#getblockcount)

```javascript
const count = await client.getblockcount();
```

- [`getblockhash`](https://bitcoin.org/en/developer-reference#getblockhash)

```javascript
const height = 1583782;
const hash = await client.getblockhash({ height });
```

- [`getblockheader`](https://bitcoin.org/en/developer-reference#getblockheader)

```javascript
const blockhash =
  "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
const verbose = false;
const header = await client.getblockheader({ blockhash, verbose });
```

- [`getblockstats`](https://bitcoin.org/en/developer-reference#getblockstats)

```javascript
const hash_or_height =
  "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
const stats = ["txs", "time"];
const info = await client.getblockstats({ hash_or_height, stats });
```

- [`getchaintips`](https://bitcoin.org/en/developer-reference#getchaintips)

```javascript
const tips = await client.getchaintips();
```

- [`getchaintxstats`](https://bitcoin.org/en/developer-reference#getchaintxstats)

```javascript
const nblocks = 2016;
const blockhash =
  "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
const result = await client.getchaintxstats({ nblocks, blockhash });
```

- [`getdifficulty`](https://bitcoin.org/en/developer-reference#getdifficulty)

```javascript
const difficulty = await client.getdifficulty();
```

- [`getmempoolancestors`](https://bitcoin.org/en/developer-reference#getmempoolancestors)

```javascript
const verbose = true;
const txid = "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a";
const result = await client.getmempoolancestors({ txid, verbose });
```

- [`getmempooldescendants`](https://bitcoin.org/en/developer-reference#getmempooldescendants)

```javascript
const verbose = true;
const txid = "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b";
const result = await client.getmempooldescendants({ txid, verbose });
```

- [`getmempoolentry`](https://bitcoin.org/en/developer-reference#getmempoolentry)

```javascript
const txid = "0629e01f05088728b089715f247de82a160428c06d6c85484adab2aa66574ace";
const result = await client.getmempoolentry({ txid });
```

- [`getmempoolinfo`](https://bitcoin.org/en/developer-reference#getmempoolinfo)

```javascript
const info = await client.getmempoolinfo();
```

- [`getrawmempool`](https://bitcoin.org/en/developer-reference#getrawmempool)

```javascript
const verbose = true;
const result = await client.getrawmempool({ verbose });
```

- [`gettxout`](https://bitcoin.org/en/developer-reference#gettxout)

```javascript
const txid = "d2f6b1d1844e483ce350a4a22fbaef36c31ebe88730415b7408c1f34b834fab5";
const n = 1;
const include_mempool = true;
const result = await client.gettxout({ txid, n, include_mempool });
```

- [`gettxoutproof`](https://bitcoin.org/en/developer-reference#gettxoutproof)

```javascript
const txids = [
  "42e75d074cf5b836170d20fc09593245c65a3f07283a497c3350c4d109b38bb6"
];
const blockhash =
  "000000000000000000055bc30b762904ab996430603cafe846cc6adc82c4af1e";
const result = await client.gettxoutproof({ txids, blockhash });
```

- [`gettxoutsetinfo`](https://bitcoin.org/en/developer-reference#gettxoutsetinfo)

```javascript
const info = await client.gettxoutsetinfo();
```

- [`preciousblock`](https://bitcoin.org/en/developer-reference#preciousblock)

```javascript
const blockhash =
  "00000000000000261a35cf378bf8fa1bf6ac87800d798ce2a11f581f562e92ba";
const result = await client.preciousblock({ blockhash });
```

- [`pruneblockchain`](https://bitcoin.org/en/developer-reference#pruneblockchain)

```javascript
const height = 1000;
const result = await client.pruneblockchain({ height });
```

- [`savemempool`](https://bitcoin.org/en/developer-reference#savemempool)

```javascript
const result = await client.savemempool();
```

- [`scantxoutset`](https://bitcoin.org/en/developer-reference#scantxoutset)

```javascript
const action = "start";
const scanobjects = [
  "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)",
  {
    desc:
      "wpkh([d34db33f/84'/0'/0']tpubD6NzVbkrYhZ4YTN7usjEzYmfu4JKqnfp9RCbDmdKH78vTyuwgQat8vRw5cX1YaZZvFfQrkHrM2XsyfA8cZE1thA3guTBfTkKqbhCDpcKFLG/0/*)#8gfuh6ex",
    range: [1, 3]
  }
];
const result = await client.scantxoutset({ action, scanobjects });
```

- [`verifychain`](https://bitcoin.org/en/developer-reference#verifychain)

```javascript
const checklevel = 1;
const nblocks = 10;
const result = await client.verifychain({ checklevel, nblocks });
```

- [`verifytxoutproof`](https://bitcoin.org/en/developer-reference#verifytxoutproof)

```javascript
const proof =
  "00000020ed07b12f0398e45fd403db11dbe894dc3301ce1a7725424e0b5e460c0000000066fca14db436f305aea37b3ae0f8b188cbf112dff3854c3d419f3ff3ebbc821f6c0c975dffff001d8fd5a7d2eb00000009e7acd3f605d1b957d684d9eeca9c472d803d90c0d17e29e5606f9b080b177a4abcd854622ad3900b5bc1ae71e99699a05eb972d46bd439c08eb7fbd20bba6494542222b2d1388f52c6d23ac12b32245ca47b02fc2f0a283a88aabca1f4db43ca8a4da8ffd7d9ae403b0c34ccbf14d2318c34fabb713c48f6d6490c6095250b6f08f26f020275d448dfb9967c62bedefaf29260021671a191f620f7783252788549b1e033dc815e2cd36ff204b398046f834643859f881a4d93b3fc5b91413a009c5069be274e1dcc675183ea2a989ef598422c0ed02e407aade8eaa6ef7ec1120ca4ffdef21b5fd26c4525a27c78cc38026b257f9d23f0d796603b1d3cbf539bdf87ccf9e81954f58e072d67eff2891339f203cbdec68bbbabbbbc0c070cceea03bf0a00";
const result = await client.verifytxoutproof({ proof });
```

### Control

- [`getmemoryinfo`](https://bitcoin.org/en/developer-reference#getmemoryinfo)

```javascript
const mode = "mallocinfo";
const result = await client.getmemoryinfo({ mode });
```

- [`getrpcinfo`](https://bitcoin.org/en/developer-reference#getrpcinfo)

```javascript
const result = await client.getrpcinfo();
```

- [`help`](https://bitcoin.org/en/developer-reference#help)

```javascript
const command = "getzmqnotifications";
const result = await client.help({ command });
```

- [`logging`](https://bitcoin.org/en/developer-reference#logging)

```javascript
const include = ["net", "rpc"];
const exclude = ["mempoolrej", "estimatefee"];
const result = await client.logging({ include, exclude });
```

- [`stop`](https://bitcoin.org/en/developer-reference#stop)

```javascript
const result = await client.stop();
```

- [`uptime`](https://bitcoin.org/en/developer-reference#uptime)

```javascript
const result = await client.uptime();
```

### Generating

- [`generate`](https://bitcoin.org/en/developer-reference#generate)

```javascript
const nblocks = 1;
const maxtries = 10000;
const wallet = "bitcoin-core-wallet.dat";
const result = await client.generate({ nblocks, maxtries }, wallet);
```

- [`generatetoaddress`](https://bitcoin.org/en/developer-reference#generatetoaddress)

```javascript
const nblocks = 1;
const maxtries = 10000;
const address = "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1";
const wallet = "bitcoin-core-wallet.dat";
const result = await client.generatetoaddress(
  { nblocks, address, maxtries },
  wallet
);
```

### Mining

- [`getblocktemplate`](https://bitcoin.org/en/developer-reference#getblocktemplate)

```javascript
const rules = ["segwit"];
const mode = "template";
const capabilities = ["serverlist", "proposal"];
const template_request = { rules, mode, capabilities };
const result = await client.getblocktemplate({ template_request });
```

- [`getmininginfo`](https://bitcoin.org/en/developer-reference#getmininginfo)

```javascript
const result = await client.getmininginfo();
```

- [`getnetworkhashps`](https://bitcoin.org/en/developer-reference#getnetworkhashps)

```javascript
const nblocks = 100;
const height = 100;
const result = await client.getnetworkhashps({ nblocks, height });
```

- [`prioritisetransaction`](https://bitcoin.org/en/developer-reference#prioritisetransaction)

```javascript
const txid = "9b0fc92260312ce44e74ef369f5c66bbb85848f2eddd5a7a1cde251e54ccfdd5";
const fee_delta = 1000;
const result = await client.prioritisetransaction({ txid, fee_delta });
```

- [`submitblock`](https://bitcoin.org/en/developer-reference#submitblock)

```javascript
const hexdata = "hexEncodedBlock";
const result = await client.submitblock({ hexdata });
```

- [`submitheader`](https://bitcoin.org/en/developer-reference#submitheader)

```javascript
const hexdata = "hexEncodedBlockHeaderData";
const result = await client.submitheader({ hexdata });
```

### Network

- [`addnode`](https://bitcoin.org/en/developer-reference#addnode)

```javascript
const node = "192.168.0.6:8333";
const command = "onetry";
const result = await client.addnode({ node, command });
```

- [`clearbanned`](https://bitcoin.org/en/developer-reference#clearbanned)

```javascript
const result = await client.clearbanned();
```

- [`disconnectnode`](https://bitcoin.org/en/developer-reference#disconnectnode)

```javascript
const address = "192.168.1.123:18333";
let result = await client.disconnectnode({ address });
// or by a `nodeid`
const nodeid = 3;
result = await client.disconnectnode({ nodeid });
```

- [`getaddednodeinfo`](https://bitcoin.org/en/developer-reference#getaddednodeinfo)

```javascript
const node = "192.168.0.201";
const result = await client.getaddednodeinfo({ node });
```

- [`getconnectioncount`](https://bitcoin.org/en/developer-reference#getconnectioncount)

```javascript
const result = await client.getconnectioncount();
```

- [`getnettotals`](https://bitcoin.org/en/developer-reference#getnettotals)

```javascript
const result = await client.getnettotals();
```

- [`getnetworkinfo`](https://bitcoin.org/en/developer-reference#getnetworkinfo)

```javascript
const result = await client.getnetworkinfo();
```

- [`getnodeaddresses`](https://bitcoin.org/en/developer-reference#getnodeaddresses)

```javascript
const count = 8;
const result = await client.getnodeaddresses({ count });
```

- [`getpeerinfo`](https://bitcoin.org/en/developer-reference#getpeerinfo)

```javascript
const result = await client.getpeerinfo();
```

- [`listbanned`](https://bitcoin.org/en/developer-reference#listbanned)

```javascript
const result = await client.listbanned();
```

- [`ping`](https://bitcoin.org/en/developer-reference#ping)

```javascript
const result = await client.ping();
```

- [`setban`](https://bitcoin.org/en/developer-reference#setban)

```javascript
const subnet = "192.168.0.6";
const command = "add";
const bantime = 1581599503;
const absolute = true;
const result = await client.setban({ subnet, command, bantime, absolute });
```

- [`setnetworkactive`](https://bitcoin.org/en/developer-reference#setnetworkactive)

```javascript
const state = false;
const result = await client.setnetworkactive({ state });
```

### Rawtransactions

- [`analyzepsbt`](https://bitcoin.org/en/developer-reference#analyzepsbt)

```javascript
const psbt =
  "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
const result = await client.analyzepsbt({ psbt });
```

- [`combinepsbt`](https://bitcoin.org/en/developer-reference#combinepsbt)

```javascript
const txs = [
  "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAAA",
  "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQABAR/HgTsAAAAAABYAFDNBVvuJV65T//o2rr6AhKSwDPt9AQhrAkcwRAIgWyFL8FdWh0kB8CbKL2GsVPQU2Wgb9E4YvOwJ9KLseMgCIHBdaP/zuYg7Y4cL5B+gjsOUB4PFss6+dnACpn/+U9UjASEDTi3KTyZW9vKWtxYxflo5B7l1PHSqn0GUlf8AsXkGfvQAAA=="
];
const result = await client.combinepsbt({ txs });
```

- [`combinerawtransaction`](https://bitcoin.org/en/developer-reference#combinerawtransaction)

```javascript
const txs = [
  "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69000247304402201596d19c0eec785d301dad21ecc8bad1d808d4bd15615df1a5a1b9e930404066022038126c82743ccf5bc225b61a38ddd7ae651f12d27a730817de79279df8fd0ab88121028cc283639d0254c3f3091659d66f7681189de1ade326d36eefa50217956b057b00000000",
  "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69024730440220451546bae0bc61270eec966f1ca0a5cb16a93c5f88a800094240e61fb3f6fdd7022021a0065ec25e06f9e0b3a4d87b06d13adc2bd620dd8f2ecf7a40366ceaa93e998121039a3d49d8d6a2ca7ff2ea6657d3c8c19ba20ab67f529edb522030928b5f4894d20000000000"
];
const result = await client.combinerawtransaction({ txs });
```

- [`converttopsbt`](https://bitcoin.org/en/developer-reference#converttopsbt)

```javascript
const hexstring =
  "020000000122647b4fc186385b15a01cc6cd6d7864399b4ff536f370f86ecc5e2f4281d7d50000000000ffffffff017b000000000000001976a914394e47d5a2d723e34b38b05e257c6ab69be3b59988ac00000000";
const permitsigdata = true;
const iswitness = true;
const result = await client.converttopsbt({
  hexstring,
  permitsigdata,
  iswitness
});
```

- [`createpsbt`](https://bitcoin.org/en/developer-reference#createpsbt)

```javascript
const inputs = [
  {
    txid: "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
    vout: 1
  },
  {
    txid: "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
    vout: 0
  }
];
const outputs = [
  {
    tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su: 0.00215
  },
  {
    tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs: 0.001
  }
];
const locktime = 1;
const replaceable = true;
const result = await client.createpsbt({
  inputs,
  outputs,
  locktime,
  replaceable
});
```

- [`createrawtransaction`](https://bitcoin.org/en/developer-reference#createrawtransaction)

```javascript
const inputs = [
  {
    txid: "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
    vout: 1
  },
  {
    txid: "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
    vout: 0
  }
];
const outputs = [
  {
    tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su: 0.00215
  },
  {
    tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs: 0.001
  }
];
const locktime = 1;
const replaceable = true;
const result = await client.createrawtransaction({
  inputs,
  outputs,
  locktime,
  replaceable
});
```

- [`decodepsbt`](https://bitcoin.org/en/developer-reference#decodepsbt)

```javascript
const psbt =
  "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
const result = await client.decodepsbt({ psbt });
```

- [`decoderawtransaction`](https://bitcoin.org/en/developer-reference#decoderawtransaction)

```javascript
const hexstring =
  "0200000002d552146118cdc257daac21cbc889188d58ff3788a8142d1ff3810bd589e26c7b0100000000fdffffff6b369c50b221b64f465c5ead75eeda0b84f74735680daeafe89b7273fd8f75ff0000000000fdffffff02d8470300000000001600146f709183bc76478188b2325f2ee692e8c043cb8fa086010000000000160014b7137dfed18ffe396fbe0b1678608cebdd45b1eb01000000";
const iswitness = true;
const result = await client.decoderawtransaction({ hexstring, iswitness });
```

- [`decodescript`](https://bitcoin.org/en/developer-reference#decodescript)

```javascript
const hexstring =
  "5221031e925dbe43ca87bce874f4fb77ac0d6bb2dc1a9db93868fa27611b687775bd0b2102ffb8b66ba266797f1e33e5d177a6f9c72839992ccf11e97837054a8d3a8284bc21025bf696347321a5276aad08dfefff19dd09d3717bfc2ce521060f4247d31c37b553ae";
const result = await client.decodescript({ hexstring });
```

- [`finalizepsbt`](https://bitcoin.org/en/developer-reference#finalizepsbt)

```javascript
const psbt =
  "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAEBH8eBOwAAAAAAFgAUM0FW+4lXrlP/+jauvoCEpLAM+30BCGsCRzBEAiBbIUvwV1aHSQHwJsovYaxU9BTZaBv0Thi87An0oux4yAIgcF1o//O5iDtjhwvkH6COw5QHg8Wyzr52cAKmf/5T1SMBIQNOLcpPJlb28pa3FjF+WjkHuXU8dKqfQZSV/wCxeQZ+9AAA";
const extract = true;
const result = await client.finalizepsbt({ psbt, extract });
```

- [`fundrawtransaction`](https://bitcoin.org/en/developer-reference#fundrawtransaction)

```javascript
const hexstring =
  "020000000129455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960000000000fdffffff0140420f00000000001600148470e04e616ab6552d72e8284a32a293ff8a959b00000000";
const includeWatching = true;
const feeRate = 0.0002;
const replaceable = true;
const changeAddress = "tb1q80h3kvp98fgkz293we3p75hs0aq4cecz3qtgkg";
const wallet = "bitcoin-core-wallet.dat";
const options = { includeWatching, feeRate, replaceable, changeAddress };
const iswitness = true;
const result = await client.fundrawtransaction(
  {
    hexstring,
    options,
    iswitness
  },
  wallet
);
```

- [`getrawtransaction`](https://bitcoin.org/en/developer-reference#getrawtransaction)

```javascript
const txid = "a32ddaed3387a2bc0bb9a4f90bc6e84e5589335b97142848ad144efd38420eb2";
const verbose = true;
const blockhash =
  "00000000480351c0fc7047af37756bbae30996a018e94d9ca8156dccea032018";
const result = await client.getrawtransaction({ txid, verbose, blockhash });
```

- [`joinpsbts`](https://bitcoin.org/en/developer-reference#joinpsbts)

```javascript
const txs = [
  "cHNidP8BAFICAAAAAdVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////AdhHAwAAAAAAFgAUb3CRg7x2R4GIsjJfLuaS6MBDy48BAAAAAAAA",
  "cHNidP8BAFICAAAAAWs2nFCyIbZPRlxerXXu2guE90c1aA2ur+ibcnP9j3X/AAAAAAD9////AaCGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAA"
];
const result = await client.joinpsbts({ txs });
```

- [`sendrawtransaction`](https://bitcoin.org/en/developer-reference#sendrawtransaction)

```javascript
const hexstring =
  "020000000001027f9115bb880cf88190de6e6b4be7515670c2f6e79c367c09ae19eb2def432aa70000000000fdffffff29455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960100000000fdffffff0160823b00000000001600148035bc99c1327407ba8faa9592a251042986c81502473044022007a70711f0889028f4cb7fd01d20b1f96bb8a7def745b4394696fe032a4f5de102206b72cbe094466fc4358a2a130b02b539da774c6fa7006a7802feeea6a30c231801210283450124a3ca764e4d321fe9b3a700d5d446ee7343d786a5401c075c79ebdfea0247304402205b214bf05756874901f026ca2f61ac54f414d9681bf44e18bcec09f4a2ec78c80220705d68fff3b9883b63870be41fa08ec3940783c5b2cebe767002a67ffe53d5230121034e2dca4f2656f6f296b716317e5a3907b9753c74aa9f419495ff00b179067ef401000000";
const allowhighfees = true;
const result = await client.sendrawtransaction({ hexstring, allowhighfees });
```

- [`signrawtransactionwithkey`](https://bitcoin.org/en/developer-reference#signrawtransactionwithkey)

```javascript
const hexstring =
  "0200000002d552146118cdc257daac21cbc889188d58ff3788a8142d1ff3810bd589e26c7b0000000000fdffffff6dd6a088fda2de4c1f25912f5c6f53fdafd54abf6557d888af5ceac704a26d050100000000fdffffff0200093d0000000000160014fc8e119e52776678cc05cab6b024eb77cea2f11620cc0400000000001600141ca68ece7a876e66d377c0a1bc5d45251513c20800000000";
const privkeys = ["privkey1", "privkey2"];
const prevtxs = [
  {
    txid: "cc21b8cb612f7b451e4283f08b3fa96ccdc141441697c499366f42514b3bdd15",
    vout: 0,
    scriptPubKey: "00141ca68ece7a876e66d377c0a1bc5d45251513c208",
    amount: 0.001
  }
];
const sighashtype = "ALL|ANYONECANPAY";
const result = await client.signrawtransactionwithkey({
  hexstring,
  privkeys,
  prevtxs,
  sighashtype
});
```

- [`testmempoolaccept`](https://bitcoin.org/en/developer-reference#testmempoolaccept)

```javascript
const rawtxs = [
  "020000000001027f9115bb880cf88190de6e6b4be7515670c2f6e79c367c09ae19eb2def432aa70000000000fdffffff29455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960100000000fdffffff0160823b00000000001600148035bc99c1327407ba8faa9592a251042986c81502473044022007a70711f0889028f4cb7fd01d20b1f96bb8a7def745b4394696fe032a4f5de102206b72cbe094466fc4358a2a130b02b539da774c6fa7006a7802feeea6a30c231801210283450124a3ca764e4d321fe9b3a700d5d446ee7343d786a5401c075c79ebdfea0247304402205b214bf05756874901f026ca2f61ac54f414d9681bf44e18bcec09f4a2ec78c80220705d68fff3b9883b63870be41fa08ec3940783c5b2cebe767002a67ffe53d5230121034e2dca4f2656f6f296b716317e5a3907b9753c74aa9f419495ff00b179067ef401000000"
];
const allowhighfees = true;
const result = await client.testmempoolaccept({ rawtxs, allowhighfees });
```

- [`utxoupdatepsbt`](https://bitcoin.org/en/developer-reference#utxoupdatepsbt)

```javascript
const psbt =
  "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAAA";
const result = await client.utxoupdatepsbt({ psbt });
```

### Util

- [`createmultisig`](https://bitcoin.org/en/developer-reference#createmultisig)

```javascript
const nrequired = 2;
const keys = [
  "03789ed0bb717d88f7d321a368d905e7430207ebbd82bd342cf11ae157a7ace5fd",
  "03dbc6764b8884a92e871274b87583e6d5c2a58819473e17e107ef3f6aa5a61626"
];
const address_type = "bech32";
const result = await client.createmultisig({ nrequired, keys, address_type });
```

- [`deriveaddresses`](https://bitcoin.org/en/developer-reference#deriveaddresses)

```javascript
const descriptor =
  "wpkh([d34db33f/84'/0'/0']tpubD6NzVbkrYhZ4YTN7usjEzYmfu4JKqnfp9RCbDmdKH78vTyuwgQat8vRw5cX1YaZZvFfQrkHrM2XsyfA8cZE1thA3guTBfTkKqbhCDpcKFLG/0/*)#8gfuh6ex";
const range = [0, 2];
const result = await client.deriveaddresses({ descriptor, range });
```

- [`estimatesmartfee`](https://bitcoin.org/en/developer-reference#estimatesmartfee)

```javascript
const conf_target = 2;
const estimate_mode = "ECONOMICAL";
const result = await client.estimatesmartfee({ conf_target, estimate_mode });
```

- [`getdescriptorinfo`](https://bitcoin.org/en/developer-reference#getdescriptorinfo)

```javascript
const descriptor =
  "wpkh([d34db33f/84h/0h/0h]0279be667ef9dcbbac55a06295Ce870b07029Bfcdb2dce28d959f2815b16f81798)";
const result = await client.getdescriptorinfo({ descriptor });
```

- [`signmessagewithprivkey`](https://bitcoin.org/en/developer-reference#signmessagewithprivkey)

```javascript
const privkey = "yourPrivateKey";
const message = "Hello World";
const result = await client.signmessagewithprivkey({ privkey, message });
```

- [`validateaddress`](https://bitcoin.org/en/developer-reference#validateaddress)

```javascript
const address = "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1";
const result = await client.validateaddress({ address });
```

- [`verifymessage`](https://bitcoin.org/en/developer-reference#verifymessage)

```javascript
const address = "myv3xs1BBBhaDVU62LFNBho2zSp4KLBkgK";
const message = "Hello World";
const signature =
  "H14/QyrMj8e63GyEXBDDWnWrplXK3OORnMc3B+fEOOisbNFEAQuNB9myAH9qs7h1VNJb1xq1ytPQqiLcmSwwPv8=";
const result = await client.verifymessage({ address, message, signature });
```

### Wallet

- [`abandontransaction`](https://bitcoin.org/en/developer-reference#abandontransaction)

```javascript
const txid = "d1514757030c26d54e90b242c696f46f539bb55e92fb105505d9ee43e61657a9";
const wallet = "bitcoin-core-wallet.dat";
const result = await client.abandontransaction({ txid }, wallet);
```

- [`abortrescan`](https://bitcoin.org/en/developer-reference#abortrescan)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const result = await client.abortrescan(wallet);
```

- [`addmultisigaddress`](https://bitcoin.org/en/developer-reference#addmultisigaddress)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const nrequired = 2;
const keys = [
  "030b0f444121f91cf323ad599ee8ced39dcbb136905e8ac42f9bdb4756142c716f",
  "02ea2e2847de9386b704cacb5c730c272c4f3e7b14a586ca6122cdacff5dea59e9"
];
const label = "NewMultiSigAddress";
const address_type = "bech32";
const result = await client.addmultisigaddress(
  { nrequired, keys, label, address_type },
  wallet
);
```

- [`backupwallet`](https://bitcoin.org/en/developer-reference#backupwallet)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const destination = "D:/Crypto/wallets/myWalletBackup.dat";
const result = await client.backupwallet({ destination }, wallet);
```

- [`bumpfee`](https://bitcoin.org/en/developer-reference#bumpfee)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const txid = "txid";
const totalFee = 0.00000839;
const replaceable = true;
const estimate_mode = "CONSERVATIVE";
const options = { totalFee, replaceable, estimate_mode };
const result = await client.bumpfee({ txid, options }, wallet);
```

- [`createwallet`](https://bitcoin.org/en/developer-reference#createwallet)

```javascript
const wallet_name = "bitcoin-core-wallet.dat";
const disable_private_keys = true;
const blank = true;
const result = await client.createwallet({
  wallet_name,
  disable_private_keys,
  blank
});
```

- [`dumpprivkey`](https://bitcoin.org/en/developer-reference#dumpprivkey)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const address = "tb1qkdvjgyk7y5fmekzs2sk6zep4rdcl7yell9drxm";
const result = await client.dumpprivkey({ address }, wallet);
```

- [`dumpwallet`](https://bitcoin.org/en/developer-reference#dumpwallet)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const filename = "myWalletDump.dat";
const result = await client.dumpwallet({ filename }, wallet);
```

- [`encryptwallet`](https://bitcoin.org/en/developer-reference#encryptwallet)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const passphrase = "VerySecretPassphraseDoNotTellAnyone";
const result = await client.encryptwallet({ passphrase }, wallet);
```

### ZMQ

- [`getzmqnotifications`](https://bitcoincore.org/en/doc/0.17.0/rpc/zmq/getzmqnotifications/)

```javascript
const result = await client.getzmqnotifications();
```

## [HTTP REST](https://bitcoin.org/en/developer-reference#http-rest)

```javascript
const { RESTClient } = require("rpc-bitcoin");
const url = "http://192.168.0.101";
const port = 17230;
const timeout = 20000;
const restClient = new RESTClient({ url, port, timeout });
```

- [`getBlock`](https://bitcoin.org/en/developer-reference#get-block)

```javascript
const hash = "00000000099de420b319c7804c4bfee5357d3f5ddbfd3c71c15b3625347792bf";
const format = "hex";
await restClient.getBlock({ hash, format });
```

- [`getBlockNoTxDetails`](https://bitcoin.org/en/developer-reference#get-blocknotxdetails)

```javascript
const hash = "00000000099de420b319c7804c4bfee5357d3f5ddbfd3c71c15b3625347792bf";
const format = "hex";
await restClient.getBlockNoTxDetails({ hash, format });
```

- [`getBlockHashByHeight`](https://bitcoin.org/en/developer-reference#get-blockhashbyheight)

```javascript
const height = 1;
const format = "hex";
await restClient.getBlockHashByHeight({ height, format });
```

- [`getChainInfo`](https://bitcoin.org/en/developer-reference#get-chaininfo)

```javascript
await restClient.getChainInfo();
```

- [`getUtxos`](https://bitcoin.org/en/developer-reference#get-getutxos)

```javascript
const checkmempool = true;
const outpoints = [
  {
    txid: "e346be6c1ef4d24f3a26ea8e1b45a2645d339fbee9da8b9dc03aeef1c4179716",
    n: 0
  },
  {
    txid: "e346be6c1ef4d24f3a26ea8e1b45a2645d339fbee9da8b9dc03aeef1c4179716",
    n: 1
  }
];
const format = "hex";
await restClient.getUtxos({ checkmempool, outpoints, format });
```

- [`getHeaders`](https://bitcoin.org/en/developer-reference#get-headers)

```javascript
const count = 5;
const hash = "00000000000001f0be142e57e99d3528212e1204157209c6c10bd11326cc5b35";
const format = "hex";
await restClient.getHeaders({ count, hash, format });
```

- [`getMemPoolContents`](https://bitcoin.org/en/developer-reference#get-mempoolcontents)

```javascript
await restClient.getMemPoolContents();
```

- [`getMemPoolInfo`](https://bitcoin.org/en/developer-reference#get-mempoolinfo)

```javascript
await restClient.getMemPoolInfo();
```

- [`getTx`](https://bitcoin.org/en/developer-reference#get-tx)

```javascript
const txid = "93520a51cc6c694e79913f1daf0288cb10e0d7946723c06b4e7b6c2e5b057933";
const format = "hex";
await restClient.getTx({ txid, format });
```
