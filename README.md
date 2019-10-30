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

- [`getaddressesbylabel`](https://bitcoin.org/en/developer-reference#getaddressesbylabel)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const label = "SomeLabel";
const result = await client.getaddressesbylabel({ label }, wallet);
```

- [`getaddressinfo`](https://bitcoin.org/en/developer-reference#getaddressinfo)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const address = "tb1qds5qv262690uvsh6wytp0aq8xey29jfuegv4pj";
const result = await client.getaddressinfo({ address }, wallet);
```

- [`getbalance`](https://bitcoin.org/en/developer-reference#getbalance)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const minconf = 6;
const include_watchonly = true;
const result = await client.getbalance({ minconf, include_watchonly }, wallet);
```

- [`getnewaddress`](https://bitcoin.org/en/developer-reference#getnewaddress)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const label = "SomeLabel";
const address_type = "bech32";
const result = await client.getnewaddress({ label, address_type }, wallet);
```

- [`getrawchangeaddress`](https://bitcoin.org/en/developer-reference#getrawchangeaddress)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const address_type = "bech32";
const result = await client.getrawchangeaddress({ address_type }, wallet);
```

- [`getreceivedbyaddress`](https://bitcoin.org/en/developer-reference#getreceivedbyaddress)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const address =
  "tb1qg9nfs5ll5h3xl3h8xqhw8wg4sj6j6g6666cstmeg7v2q4ty0ccsqg5du3n";
const minconf = 6;
const result = await client.getreceivedbyaddress({ address, minconf }, wallet);
```

- [`getreceivedbylabel`](https://bitcoin.org/en/developer-reference#getreceivedbylabel)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const label = "SomeLabel";
const minconf = 6;
const result = await client.getreceivedbylabel({ label, minconf }, wallet);
```

- [`gettransaction`](https://bitcoin.org/en/developer-reference#gettransaction)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const txid = "2c06449191f86594ceb059363da55e6587963fc8d801fdecf73f9a42d64dfe95";
const include_watchonly = true;
const result = await client.gettransaction({ txid, include_watchonly }, wallet);
```

- [`getunconfirmedbalance`](https://bitcoin.org/en/developer-reference#getunconfirmedbalance)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const result = await client.getunconfirmedbalance(wallet);
```

- [`getwalletinfo`](https://bitcoin.org/en/developer-reference#getwalletinfo)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const result = await client.getwalletinfo(wallet);
```

- [`importaddress`](https://bitcoin.org/en/developer-reference#importaddress)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const address = "tb1qk57dcv7rs2ap6k82xu58957qz6zherj4vm54lw";
const label = "ImportedAddress";
const rescan = false;
const p2sh = false;
const result = await client.importaddress(
  { address, label, rescan, p2sh },
  wallet
);
```

- [`importmulti`](https://bitcoin.org/en/developer-reference#importmulti)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const requests = [
  {
    desc:
      "wpkh(tpubD6NzVbkrYhZ4Wk5MMULiQd4XkBe3KeG6GCUNrWcXu27PJwqFfHF7geuTPfPZcViUpV7ny6MHVnbvxdCSfkooFb7bBJiQgKXCVM58XZiVyHu/0/*)#9tk43hcd",
    range: [2, 5],
    internal: true,
    watchonly: true,
    timestamp: 0
  },
  {
    scriptPubKey: { address: "tb1q0pjl9cy0t38uvyfs75t7av7ujrhs65xx0nfjmf" },
    timestamp: "now"
  },
  {
    scriptPubKey: { address: "tb1qxqt28qy3uvj8qeucm60dnrzty3cccx88hp9car" },
    keys: ["cQfkAynVm54Je8mXYH6zkKKjug7ehheUeMx5jnWTvy94M73X2Vdj"],
    timestamp: "now"
  }
];
const options = { rescan: false };
const result = await client.importmulti({ requests, options }, wallet);
```

- [`importprivkey`](https://bitcoin.org/en/developer-reference#importprivkey)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const privkey = "cQnahvawMKvZXLWCdrBvXdvDoTHm4xeQq9iWqLC2JzmicFVd5Mdz";
const label = "Imported";
const rescan = false;
const result = await client.importprivkey({ privkey, label, rescan }, wallet);
```

- [`importprunedfunds`](https://bitcoin.org/en/developer-reference#importprunedfunds)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const rawtransaction =
  "0200000000010422647b4fc186385b15a01cc6cd6d7864399b4ff536f370f86ecc5e2f4281d7d50000000017160014013b2e1e130cd463f3be9fce311cfbf6f862d224fdffffffc61430e9a56a5ebba761828078c9a5f03571da6fbf40f4f87f7d72cbcbaf6f5e0000000000fdffffffe399e3ebf69237d36ba6f5d7ccb8f2d79923e19733fb4b7fc58f11b789f89653000000006a47304402204ea849bac52e0f76b7df9b196cad692cc8e253778c999d67627f2a9c487067e00220245e9446863037949dac77cb34f532376749507e6d499418fe51144c6e950725012103bb1add1e1e6093caa59f127ff3d477f8ac210f2ca1f8c81ff8c1602d9a5bacd0fdffffffd37c62273bfaeffee551ccaa1e06a6daa1e9d32248798821e33c6623ea17b9910000000000fdffffff022785400000000000160014740535b933895ac1caf3ba92976993f7fd9d2e99a086010000000000160014000243d945554d568a6858f5f243d9510258d75c0247304402207400692ba5ecfeda204468905b138c0f7e6cf2d02be119094864db1c48c21f7c022008ccad54fb2cdc107a96c8a56b3e80867e4cfa8c904e9a78f27f10fc8071fb430121026c9b6d74350725506d14613cabade7f447fb67eb416c8ef34323da77f7299c2302473044022024d43ee736fe458b739f32866c35a6dfe7ca352acd7b76a25472c4a8246a5ead022073db04ee5a894a6eb949ab56046416fd5090f44f65fe3a6ab68b4a5b540bb6b20121028ff8402568eea88e93d30b4b2e6c7125bdb894cbf27c87a2101e35e0b1f5ff2e000247304402205e9b129b0a0c2c0fb458c1f397d462fd4db46cf7fffd19dc9189e421f1f61fac0220424e8cbfa9a01160033cae4955bc44c6f958d3afc7ccc67aef0a23c5f95bf37e012102228f0d709aacaa24fb4712c8fca4b10c9f4cfb60dcaa4d34b58660080a8bd8435e1e1800";
const txoutproof =
  "000040205853c9a97816b63b9bb539f7b4cfb8c8a36ee0d9b6e1c59df102000000000000ab93331e4cae84da202131b6418e61e30095a81108edb09376ad7d02768d72c348ff9a5d74c4031a712e7b5614000000040cce7e642af08fd68ddcf0b7630ad88c4110c91fcdb7f792f6253bef56181bf201d52b2f5696dd23973b09dd34c2447aadeeb31ada2ff4b1d88d238c8cb2081a0a6331dd8ded7863f79cd3574812d032d5bc7c96df137ddb0d3b794ac2a26f199b66a00a8b8376f3bd0b1c7f9827b403242976d1dc16ed8bc6ec7e11c1f028bf02dd00";
const result = await client.importprunedfunds(
  { rawtransaction, txoutproof },
  wallet
);
```

- [`importpubkey`](https://bitcoin.org/en/developer-reference#importpubkey)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const pubkey =
  "023ef8f5fa2a18c07d714d942e4aa933827df7d5fba43a513be22581fc0ce83207";
const label = "SomeAddress";
const rescan = false;
const result = await client.importpubkey({ pubkey, label, rescan }, wallet);
```

- [`importwallet`](https://bitcoin.org/en/developer-reference#importwallet)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const filename = "myWalletDump.dat";
const result = await client.importwallet({ filename }, wallet);
```

- [`keypoolrefill`](https://bitcoin.org/en/developer-reference#keypoolrefill)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const newsize = 123;
const result = await client.keypoolrefill({ newsize }, wallet);
```

- [`listaddressgroupings`](https://bitcoin.org/en/developer-reference#listaddressgroupings)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const result = await client.listaddressgroupings(wallet);
```

- [`listlabels`](https://bitcoin.org/en/developer-reference#listlabels)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const purpose = "receive";
const result = await client.listlabels({ purpose }, wallet);
```

- [`listlockunspent`](https://bitcoin.org/en/developer-reference#listlockunspent)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const result = await client.listlockunspent(wallet);
```

- [`listreceivedbyaddress`](https://bitcoin.org/en/developer-reference#listreceivedbyaddress)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const minconf = 6;
const include_empty = false;
const include_watchonly = false;
const address_filter = "tb1qyferlkpvr7v3r5ne7jh2avjuvnxkf08lqhpqe9";
const result = await client.listreceivedbyaddress(
  { minconf, include_empty, include_watchonly, address_filter },
  wallet
);
```

- [`listreceivedbylabel`](https://bitcoin.org/en/developer-reference#listreceivedbylabel)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const minconf = 6;
const include_empty = true;
const include_watchonly = true;
const result = await client.listreceivedbylabel(
  { minconf, include_empty, include_watchonly },
  wallet
);
```

- [`listsinceblock`](https://bitcoin.org/en/developer-reference#listsinceblock)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const blockhash =
  "00000000001ad9877c5a839c65371a18e1392a2be83378915e01342a368caaef";
const target_confirmations = 6;
const include_watchonly = true;
const include_removed = false;
const result = await client.listsinceblock(
  { blockhash, target_confirmations, include_watchonly, include_removed },
  wallet
);
```

- [`listtransactions`](https://bitcoin.org/en/developer-reference#listtransactions)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const label = "SomeLabel";
const count = 5;
const skip = 4;
const include_watchonly = true;
const result = await client.listtransactions(
  { label, count, skip, include_watchonly },
  wallet
);
```

- [`listunspent`](https://bitcoin.org/en/developer-reference#listunspent)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const minconf = 1;
const maxconf = 100;
const addresses = [
  "tb1qg9nfs5ll5h3xl3h8xqhw8wg4sj6j6g6666cstmeg7v2q4ty0ccsqg5du3n",
  "tb1q8vd7hh77afe2aans7vywyt8txvz84r3pwkmny4"
];
const include_unsafe = false;
const query_options = {
  minimumAmount: 0.0001,
  maximumAmount: 0.01,
  maximumCount: 2,
  minimumSumAmount: 10
};
const result = await client.listunspent(
  { minconf, maxconf, addresses, include_unsafe, query_options },
  wallet
);
```

- [`listwalletdir`](https://bitcoin.org/en/developer-reference#listwalletdir)

```javascript
const result = await client.listwalletdir();
```

- [`listwallets`](https://bitcoin.org/en/developer-reference#listwallets)

```javascript
const result = await client.listwallets();
```

- [`loadwallet`](https://bitcoin.org/en/developer-reference#loadwallet)

```javascript
const filename = "myWallet.dat";
const result = await client.loadwallet({ filename });
```

- [`lockunspent`](https://bitcoin.org/en/developer-reference#lockunspent)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const unlock = true;
const transactions = [
  {
    txid: "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
    vout: 1
  },
  {
    txid: "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a",
    vout: 0
  }
];
const result = await client.lockunspent({ unlock, transactions }, wallet);
```

- [`removeprunedfunds`](https://bitcoin.org/en/developer-reference#removeprunedfunds)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const txid = "196fa2c24a793b0ddb7d13df967cbcd532d0124857d39cf76378ed8ddd31630a";
const result = await client.removeprunedfunds({ txid }, wallet);
```

- [`rescanblockchain`](https://bitcoin.org/en/developer-reference#rescanblockchain)

```javascript
const wallet = "bitcoin-core-wallet.dat";
const start_height = 1566870;
const stop_height = 1566970;
const result = await client.rescanblockchain(
  { start_height, stop_height },
  wallet
);
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
