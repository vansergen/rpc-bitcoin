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

## [HTTP REST](https://bitcoin.org/en/developer-reference#http-rest)

```javascript
const { RESTClient } = require("rpc-bitcoin");
const url = "http://192.168.0.101";
const port = 17230;
const timeout = 20000;
const restClient = new RESTClient({ url, port, timeout });
```

- [getBlock](https://bitcoin.org/en/developer-reference#get-block)

```javascript
const hash = "00000000099de420b319c7804c4bfee5357d3f5ddbfd3c71c15b3625347792bf";
const format = "hex";
await restClient.getBlock({ hash, format });
```

- [getBlockNoTxDetails](https://bitcoin.org/en/developer-reference#get-blocknotxdetails)

```javascript
const hash = "00000000099de420b319c7804c4bfee5357d3f5ddbfd3c71c15b3625347792bf";
const format = "hex";
await restClient.getBlockNoTxDetails({ hash, format });
```

- [getBlockHashByHeight](https://bitcoin.org/en/developer-reference#get-blockhashbyheight)

```javascript
const height = 1;
const format = "hex";
await restClient.getBlockHashByHeight({ height, format });
```

- [getChainInfo](https://bitcoin.org/en/developer-reference#get-chaininfo)

```javascript
await restClient.getChainInfo();
```

- [getUtxos](https://bitcoin.org/en/developer-reference#get-getutxos)

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

- [getHeaders](https://bitcoin.org/en/developer-reference#get-headers)

```javascript
const count = 5;
const hash = "00000000000001f0be142e57e99d3528212e1204157209c6c10bd11326cc5b35";
const format = "hex";
await restClient.getHeaders({ count, hash, format });
```

- [getMemPoolContents](https://bitcoin.org/en/developer-reference#get-mempoolcontents)

```javascript
await restClient.getMemPoolContents();
```

- [getMemPoolInfo](https://bitcoin.org/en/developer-reference#get-mempoolinfo)

```javascript
await restClient.getMemPoolInfo();
```

- [getTx](https://bitcoin.org/en/developer-reference#get-tx)

```javascript
const txid = "93520a51cc6c694e79913f1daf0288cb10e0d7946723c06b4e7b6c2e5b057933";
const format = "hex";
await restClient.getTx({ txid, format });
```
