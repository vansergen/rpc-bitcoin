import { RPCClient, ScanTxOutSetParams } from "../.";
import * as nock from "nock";
import * as assert from "assert";

const port = 18332;
const timeout = 20000;
const pass = "rpcpassword";
const auth = { user: "", pass };
const uri = "http://localhost:" + port;
const client = new RPCClient({ port, timeout, pass });

const id = "rpc-bitcoin";
const jsonrpc = 1.0;
const error = null;

suite("RPCClient", () => {
  suiteSetup(() => nock.cleanAll());

  test(".constructor()", () => {
    const port = 12345;
    const timeout = 12345;
    const user = "rpcuser";
    const pass = "rpcpassword";
    const auth = { user, pass };
    const url = "http://www.example.com";
    const wallet = "wal.dat";
    const fullResponse = true;
    const baseUrl = url + ":" + port;
    const options = { user, port, pass, timeout, url, wallet, fullResponse };
    const client = new RPCClient(options);
    const uri = "/";
    const json = true;
    const _rpoptions = { auth, baseUrl, timeout, uri, json };
    assert.deepStrictEqual(client.wallet, wallet);
    assert.deepStrictEqual(client.fullResponse, fullResponse);
    assert.deepStrictEqual(client._rpoptions, _rpoptions);
  });

  test(".batch()", async () => {
    const requests = [
      { method: "getbestblockhash", id: 1 },
      { method: "help", params: { command: "help" }, id: "custom-id" },
      { method: "getzmqnotifications", params: {}, id: 2 }
    ];
    const response = [
      {
        result:
          "000000000004f7f1ec631acb86a86ef0d97f1294d79f5fba1d0e579c1513b5ea",
        error,
        id: 1
      },
      {
        result:
          'help ( "command" )\n\nList all commands, or get help for a specified command.\n\nArguments:\n1. command    (string, optional, default=all commands) The command to get help on\n\nResult:\n"text"     (string) The help text\n',
        error,
        id: "custom-id"
      },
      { result: [], error, id: 2 }
    ];
    nock(uri)
      .post("/", requests)
      .times(1)
      .basicAuth(auth)
      .reply(200, response);
    const data = await client.batch(requests);
    assert.deepStrictEqual(data, response);
  });

  test(".rpc()", async () => {
    const method = "getbestblockhash";
    const request = { params: {}, method, id, jsonrpc };
    const result =
      "000000000004f7f1ec631acb86a86ef0d97f1294d79f5fba1d0e579c1513b5ea";
    nock(uri)
      .post("/", request)
      .times(1)
      .basicAuth(auth)
      .reply(200, { error, id, result });
    const data = await client.rpc(method);
    assert.deepStrictEqual(data, result);
  });

  test(".rpc() (with fullResponse)", async () => {
    const client = new RPCClient({ port, timeout, pass, fullResponse: true });
    const method = "getbestblockhash";
    const request = { params: {}, method, id, jsonrpc };
    const result =
      "000000000004f7f1ec631acb86a86ef0d97f1294d79f5fba1d0e579c1513b5ea";
    const response = { error, id, result };
    nock(uri)
      .post("/", request)
      .times(1)
      .basicAuth(auth)
      .reply(200, response);
    const data = await client.rpc(method);
    assert.deepStrictEqual(data, response);
  });

  test(".rpc() (with a wallet)", async () => {
    const method = "getnewaddress";
    const params = { label: "newlabel", address_type: "bech32" };
    const request = { params, method, id, jsonrpc };
    const wallet = "wallet123.dat";
    const result = "tb1quchcvzestaj5kfnyu6wz7hwyn0lttdq2949tsj";
    nock(uri)
      .post("/wallet/" + wallet, request)
      .times(1)
      .basicAuth(auth)
      .reply(200, { result, error, id });
    const data = await client.rpc(method, params, wallet);
    assert.deepStrictEqual(data, result);
  });

  suite("Blockchain", () => {
    test(".getbestblockhash()", async () => {
      const request = { params: {}, method: "getbestblockhash", id, jsonrpc };
      const result =
        "000000006e60e2ae7b464e4e38e061cb4aea9dafa605cc1d38d34601fdf77064";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getbestblockhash();
      assert.deepStrictEqual(data, result);
    });

    test(".getblock()", async () => {
      const blockhash =
        "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
      const verbosity: 2 = 2;
      const params = { blockhash, verbosity };
      const request = { params, method: "getblock", id, jsonrpc };
      const result = {
        hash:
          "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c",
        confirmations: 3383,
        strippedsize: 123950,
        size: 178661,
        weight: 550511,
        height: 1580399,
        version: 536870912,
        versionHex: "20000000",
        merkleroot:
          "d3f3bb31c88119d341f9a5598a213655bc0168a83a9d9cb80ac4386485b3c0f5",
        tx: [
          {
            txid:
              "6adb52bcfbc0f88378eed06783d5dbb3edd649f485c3fdc2f38e779e724f612a",
            hash:
              "2b1826bdd156e6f86248404da4f51febd58eaa8abdb85572302bb27af89a4089",
            version: 1,
            size: 197,
            vsize: 170,
            weight: 680,
            locktime: 0,
            vin: [
              {
                coinbase:
                  "036f1d180459fe965d08f80000014b0700000c2f746573746e65747465722f",
                sequence: 0
              }
            ],
            vout: [
              {
                value: 0.53670882,
                n: 0,
                scriptPubKey: {
                  asm:
                    "OP_HASH160 b4316d69836fe185d3d4ca234e90a7a5ce6491ab OP_EQUAL",
                  hex: "a914b4316d69836fe185d3d4ca234e90a7a5ce6491ab87",
                  reqSigs: 1,
                  type: "scripthash",
                  addresses: ["2N9fzq66uZYQXp7uqrPBH6jKBhjrgTzpGCy"]
                }
              },
              {
                value: 0,
                n: 1,
                scriptPubKey: {
                  asm:
                    "OP_RETURN aa21a9ed3116a1d2c6dc9cf601112589ce7d2334acd8a196fb02ceacddf6eed2bf4b72b5",
                  hex:
                    "6a24aa21a9ed3116a1d2c6dc9cf601112589ce7d2334acd8a196fb02ceacddf6eed2bf4b72b5",
                  type: "nulldata"
                }
              }
            ],
            hex:
              "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff1f036f1d180459fe965d08f80000014b0700000c2f746573746e65747465722f0000000002e2f332030000000017a914b4316d69836fe185d3d4ca234e90a7a5ce6491ab870000000000000000266a24aa21a9ed3116a1d2c6dc9cf601112589ce7d2334acd8a196fb02ceacddf6eed2bf4b72b50120000000000000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            txid:
              "5416f86c8d41840ff9c09d997372a7f140e78b765252583fb23f74e0992c6e71",
            hash:
              "5416f86c8d41840ff9c09d997372a7f140e78b765252583fb23f74e0992c6e71",
            version: 1,
            size: 226,
            vsize: 226,
            weight: 904,
            locktime: 0,
            vin: [
              {
                txid:
                  "623145a17de90d190f3b2379672b3bb11f19f73b3be4c412cea1f60f9bbe7344",
                vout: 1,
                scriptSig: {
                  asm:
                    "304502210098a6a7a2329a7373ff838b3e816e8b48f94238dfbe08add7896ff95127ebfc310220541302168ae986ec6abbb0c5eea95f069621166fe841ba965ed6ea3bb351735c[ALL] 0396cfa148d2fc150d225262836aaf4ed98da771a9c2f6bc54da03d402d3f1a384",
                  hex:
                    "48304502210098a6a7a2329a7373ff838b3e816e8b48f94238dfbe08add7896ff95127ebfc310220541302168ae986ec6abbb0c5eea95f069621166fe841ba965ed6ea3bb351735c01210396cfa148d2fc150d225262836aaf4ed98da771a9c2f6bc54da03d402d3f1a384"
                },
                sequence: 4294967295
              }
            ],
            vout: [
              {
                value: 5e-8,
                n: 0,
                scriptPubKey: {
                  asm:
                    "OP_DUP OP_HASH160 ef6639af5e3f5beb577f327f09ec3b0708cb03f1 OP_EQUALVERIFY OP_CHECKSIG",
                  hex: "76a914ef6639af5e3f5beb577f327f09ec3b0708cb03f188ac",
                  reqSigs: 1,
                  type: "pubkeyhash",
                  addresses: ["n3LnFeCEuo6zcRS7kGuKx9URwnLXHaKonL"]
                }
              },
              {
                value: 0.40164686,
                n: 1,
                scriptPubKey: {
                  asm:
                    "OP_DUP OP_HASH160 60ade08bbf58068ccbed250d4ee64c0a827745d3 OP_EQUALVERIFY OP_CHECKSIG",
                  hex: "76a91460ade08bbf58068ccbed250d4ee64c0a827745d388ac",
                  reqSigs: 1,
                  type: "pubkeyhash",
                  addresses: ["mpL9TfWHudvTkWPrtzwkcuD4mKoo7eXJo5"]
                }
              }
            ],
            hex:
              "01000000014473be9b0ff6a1ce12c4e43b3bf7191fb13b2b6779233b0f190de97da1453162010000006b48304502210098a6a7a2329a7373ff838b3e816e8b48f94238dfbe08add7896ff95127ebfc310220541302168ae986ec6abbb0c5eea95f069621166fe841ba965ed6ea3bb351735c01210396cfa148d2fc150d225262836aaf4ed98da771a9c2f6bc54da03d402d3f1a384ffffffff0205000000000000001976a914ef6639af5e3f5beb577f327f09ec3b0708cb03f188ac4edd6402000000001976a91460ade08bbf58068ccbed250d4ee64c0a827745d388ac00000000"
          }
        ],
        time: 1570176600,
        mediantime: 1570170591,
        nonce: 534459415,
        bits: "1d00ffff",
        difficulty: 1,
        chainwork:
          "00000000000000000000000000000000000000000000012b3c804ee0bb6e8fdf",
        nTx: 469,
        previousblockhash:
          "000000006d7da16a58a4e56c790d1aeb4e08bce6dab68e03995f585b187551be",
        nextblockhash:
          "000000005104d2692a021f9b58932c3fa32ea15b97cbff2147e11ad24f9d49af"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblock(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getblockchaininfo()", async () => {
      const request = { params: {}, method: "getblockchaininfo", id, jsonrpc };
      const result = {
        chain: "test",
        blocks: 1583781,
        headers: 1583781,
        bestblockhash:
          "000000003572a2f04d0b30c644ae4281b37e9becde9fc8a17fb54253a1a07397",
        difficulty: 1,
        mediantime: 1571834687,
        verificationprogress: 0.9999861133153368,
        initialblockdownload: false,
        chainwork:
          "00000000000000000000000000000000000000000000012e44a73ad9f48c5bbb",
        size_on_disk: 1004297599,
        pruned: true,
        pruneheight: 1566856,
        automatic_pruning: true,
        prune_target_size: 1073741824,
        softforks: [
          { id: "bip34", version: 2, reject: { status: true } },
          { id: "bip66", version: 3, reject: { status: true } },
          { id: "bip65", version: 4, reject: { status: true } }
        ],
        bip9_softforks: {
          csv: {
            status: "active",
            startTime: 1456790400,
            timeout: 1493596800,
            since: 770112
          },
          segwit: {
            status: "active",
            startTime: 1462060800,
            timeout: 1493596800,
            since: 834624
          }
        },
        warnings: "Warning: unknown new rules activated (versionbit 28)"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblockchaininfo();
      assert.deepStrictEqual(data, result);
    });

    test(".getblockcount()", async () => {
      const request = { params: {}, method: "getblockcount", id, jsonrpc };
      const result = 1583782;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblockcount();
      assert.deepStrictEqual(data, result);
    });

    test(".getblockhash()", async () => {
      const height = 1583782;
      const params = { height };
      const request = { params, method: "getblockhash", id, jsonrpc };
      const result =
        "00000000a4991fe43933f0a0bde13b6b22b4308442453845903151004e9cc0a5";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblockhash(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getblockheader()", async () => {
      const blockhash =
        "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
      const verbose = false;
      const params = { blockhash, verbose };
      const request = { params, method: "getblockheader", id, jsonrpc };
      const result =
        "00000020be5175185b585f99038eb6dae6bc084eeb1a0d796ce5a4586aa17d6d00000000f5c0b3856438c40ab89c9d3aa86801bc5536218a59a5f941d31981c831bbf3d358fe965dffff001d1734db1f";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblockheader(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getblockstats()", async () => {
      const hash_or_height =
        "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
      const stats = ["txs", "time"];
      const params = { hash_or_height, stats };
      const request = { params, method: "getblockstats", id, jsonrpc };
      const result = { time: 1570176600, txs: 469 };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblockstats(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getchaintips()", async () => {
      const request = { params: {}, method: "getchaintips", id, jsonrpc };
      const result = [
        {
          height: 1583784,
          hash:
            "0000000071434abcdf7b2a82fb3005a67fe9f458e542a586313f5a7dc671a0c9",
          branchlen: 0,
          status: "active"
        },
        {
          height: 1580960,
          hash:
            "000000006999656106c726515ccfc34d160a5fa299ddb6bb278598b2feefaa7e",
          branchlen: 1,
          status: "valid-fork"
        },
        {
          height: 1580787,
          hash:
            "0000000029515fe9800761af4c19a087525ad9f3a1e41c4d1b136993711c3f83",
          branchlen: 1,
          status: "valid-fork"
        },
        {
          height: 1414433,
          hash:
            "00000000210004840364b52bc5e455d888f164e4264a4fec06a514b67e9d5722",
          branchlen: 23,
          status: "headers-only"
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getchaintips();
      assert.deepStrictEqual(data, result);
    });

    test(".getchaintxstats()", async () => {
      const nblocks = 2016;
      const blockhash =
        "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c";
      const params = { nblocks, blockhash };
      const request = { params, method: "getchaintxstats", id, jsonrpc };
      const result = {
        time: 1570176600,
        txcount: 52393515,
        window_final_block_hash:
          "000000004182034f427d463b92162d35d0accef9ea0c5354a87e870ca1815b4c",
        window_block_count: 2016,
        window_tx_count: 274713,
        window_interval: 1731648,
        txrate: 0.1586425185719038
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getchaintxstats(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getdifficulty()", async () => {
      const request = { params: {}, method: "getdifficulty", id, jsonrpc };
      const result = 1;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getdifficulty();
      assert.deepStrictEqual(data, result);
    });

    test(".getmempoolancestors()", async () => {
      const verbose = true;
      const txid =
        "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a";
      const params = { verbose, txid };
      const request = { params, method: "getmempoolancestors", id, jsonrpc };
      const result = {
        ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b: {
          fees: {
            base: 0.00000208,
            modified: 0.00000208,
            ancestor: 0.00000208,
            descendant: 0.00000349
          },
          size: 208,
          fee: 0.00000208,
          modifiedfee: 0.00000208,
          time: 1571845913,
          height: 1583786,
          descendantcount: 2,
          descendantsize: 349,
          descendantfees: 349,
          ancestorcount: 1,
          ancestorsize: 208,
          ancestorfees: 208,
          wtxid:
            "4ec7101b17a19ad11c6b738330303f9baa30c0aabc3e56ce8735d019fcff13e7",
          depends: [],
          spentby: [
            "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a"
          ],
          "bip125-replaceable": true
        }
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getmempoolancestors(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getmempooldescendants()", async () => {
      const verbose = true;
      const txid =
        "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b";
      const params = { verbose, txid };
      const request = { params, method: "getmempooldescendants", id, jsonrpc };
      const result = {
        "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a": {
          fees: {
            base: 0.00000141,
            modified: 0.00000141,
            ancestor: 0.00000349,
            descendant: 0.00000141
          },
          size: 141,
          fee: 0.00000141,
          modifiedfee: 0.00000141,
          time: 1571845933,
          height: 1583786,
          descendantcount: 1,
          descendantsize: 141,
          descendantfees: 141,
          ancestorcount: 2,
          ancestorsize: 349,
          ancestorfees: 349,
          wtxid:
            "6a2704699b5935b96a9c008b21518e99990cf099a6977760d56aec350b2d9d66",
          depends: [
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b"
          ],
          spentby: [],
          "bip125-replaceable": true
        }
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getmempooldescendants(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getmempoolentry()", async () => {
      const txid =
        "0629e01f05088728b089715f247de82a160428c06d6c85484adab2aa66574ace";
      const params = { txid };
      const request = { params, method: "getmempoolentry", id, jsonrpc };
      const result = {
        fees: {
          base: 0.00000148,
          modified: 0.00000148,
          ancestor: 0.00000391,
          descendant: 0.00000148
        },
        size: 146,
        fee: 0.00000148,
        modifiedfee: 0.00000148,
        time: 1571846114,
        height: 1583786,
        descendantcount: 1,
        descendantsize: 146,
        descendantfees: 148,
        ancestorcount: 2,
        ancestorsize: 389,
        ancestorfees: 391,
        wtxid:
          "cf5208ea2196816473a315504b5476fb4e75a16fb4584dda92093b72901bde08",
        depends: [
          "f594f57099cd6e1c4d0697ad92795196a1774ea752d1bec481019abd3eef30ee"
        ],
        spentby: [],
        "bip125-replaceable": false
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getmempoolentry(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getmempoolinfo()", async () => {
      const request = { params: {}, method: "getmempoolinfo", id, jsonrpc };
      const result = {
        size: 208,
        bytes: 73712,
        usage: 362416,
        maxmempool: 300000000,
        mempoolminfee: 0.00001,
        minrelaytxfee: 0.00001
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getmempoolinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".getrawmempool()", async () => {
      const verbose = true;
      const params = { verbose };
      const request = { params, method: "getrawmempool", id, jsonrpc };
      const result = {
        "9d4e511e5138b90cf530e1b33e391bf2f04f68a6d5bec3218b03d353655e3769": {
          fees: {
            base: 0.00000543,
            modified: 0.00000543,
            ancestor: 0.00000543,
            descendant: 0.00000543
          },
          size: 149,
          fee: 0.00000543,
          modifiedfee: 0.00000543,
          time: 1571846917,
          height: 1583787,
          descendantcount: 1,
          descendantsize: 149,
          descendantfees: 543,
          ancestorcount: 1,
          ancestorsize: 149,
          ancestorfees: 543,
          wtxid:
            "957c764cede26364705436977e087039f4a8fb9d68c51c9db9e2347dbd12a120",
          depends: [],
          spentby: [],
          "bip125-replaceable": true
        },
        "2275109000640d8e45ec8e23cf74ba8a82850bb5c01993972f1a40dd20fa9484": {
          fees: {
            base: 0.00016797,
            modified: 0.00016797,
            ancestor: 0.00016797,
            descendant: 0.00016797
          },
          size: 166,
          fee: 0.00016797,
          modifiedfee: 0.00016797,
          time: 1571846920,
          height: 1583787,
          descendantcount: 1,
          descendantsize: 166,
          descendantfees: 16797,
          ancestorcount: 1,
          ancestorsize: 166,
          ancestorfees: 16797,
          wtxid:
            "7b05abb26d64d6c39d1f483a2cac992c3ebad77f9240fadeeee90649ffbc9092",
          depends: [],
          spentby: [],
          "bip125-replaceable": false
        }
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getrawmempool(params);
      assert.deepStrictEqual(data, result);
    });

    test(".gettxout()", async () => {
      const txid =
        "d2f6b1d1844e483ce350a4a22fbaef36c31ebe88730415b7408c1f34b834fab5";
      const n = 1;
      const include_mempool = true;
      const params = { txid, n, include_mempool };
      const request = { params, method: "gettxout", id, jsonrpc };
      const result = {
        bestblock:
          "000000000000006b3157f2f7d8cda21be0204863c93521e9afa05615436deb71",
        confirmations: 0,
        value: 76.67255676,
        scriptPubKey: {
          asm: "OP_HASH160 f2420e17b443ea418ec4c6ac97affaafd48eca70 OP_EQUAL",
          hex: "a914f2420e17b443ea418ec4c6ac97affaafd48eca7087",
          reqSigs: 1,
          type: "scripthash",
          addresses: ["2NFLAeHuBzrMfqQHfCtnKErNJSF3fqysUhF"]
        },
        coinbase: false
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.gettxout(params);
      assert.deepStrictEqual(data, result);
    });

    test(".gettxoutproof()", async () => {
      const txids = [
        "e50c4bf07ca16e5089bf8c4f4b4d12b4e6b2bb47b09d533ebaa395342c756b95"
      ];
      const blockhash =
        "000000005a9b7656024e9d1a2a0e559b91dcc5756048ce4904ba877686f0eecc";
      const params = { txids, blockhash };
      const request = { params, method: "gettxoutproof", id, jsonrpc };
      const result =
        "00000020e798ee174759ba2eb4f57c8055eaadb903aeef74a407878265361d00000000005c70c7f197058b8ff6f06d9f144497d1801e057e06735a56b658ac78ff915516fa7ab05dffff001d32384563dd00000009eeeb7a022e70291fe3d8d5186615358d45107c10d71a212459b30fe73174494f956b752c3495a3ba3e539db047bbb2e6b4124d4b4f8cbf89506ea17cf04b0ce5864f91edb21f1918fb1031d5545c7b835fb82d8cdc87f1df76808c599bbcb4e372e0788a9ce2c9b2f1a07305b7bea5e1fca0b19f77d919e51e2e72e438c19df5a953ce7bad42e1c78372ad2df199a08c26153f7846f6cc95c4615572bc997b45803b803c49e6298dec1a9029c32addac44f2abbc8c496def1f47a6ff55d8f90901b66efccdea0dcb52c26d610c4f2ac0b1e699ee4606918ff9901c317919038a5a3f3cedf7d664a2891fe1e116dc52e9ca9166e4e8a6398b10072412ef3893693508204127c87c8c025dded104f34ceeb44958095571907e6787615929cbc8cd03ff0200";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.gettxoutproof(params);
      assert.deepStrictEqual(data, result);
    });

    test(".gettxoutsetinfo()", async () => {
      const request = { params: {}, method: "gettxoutsetinfo", id, jsonrpc };
      const result = {
        height: 1583793,
        bestblock:
          "00000000000000b332c067ccb2cb52aafac5b7de4bec01470b6c634449e6ebbc",
        transactions: 8345507,
        txouts: 22946232,
        bogosize: 1722061178,
        hash_serialized_2:
          "9b4021d53da6689371aa734ef32fe502ed38a47870db2802c48c8cde0a5c191e",
        disk_size: 1256916738,
        total_amount: 20879513.30609612
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.gettxoutsetinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".preciousblock()", async () => {
      const blockhash =
        "00000000000000261a35cf378bf8fa1bf6ac87800d798ce2a11f581f562e92ba";
      const params = { blockhash };
      const request = { params, method: "preciousblock", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.preciousblock(params);
      assert.deepStrictEqual(data, result);
    });

    test(".pruneblockchain()", async () => {
      const height = 1000;
      const params = { height };
      const request = { params, method: "pruneblockchain", id, jsonrpc };
      const result = 1566856;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.pruneblockchain(params);
      assert.deepStrictEqual(data, result);
    });

    test(".savemempool()", async () => {
      const request = { params: {}, method: "savemempool", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.savemempool();
      assert.deepStrictEqual(data, result);
    });

    test(".scantxoutset()", async () => {
      const action = "start";
      const desc1 = "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)";
      const desc =
        "wpkh([d34db33f/84'/0'/0']tpubD6NzVbkrYhZ4YTN7usjEzYmfu4JKqnfp9RCbDmdKH78vTyuwgQat8vRw5cX1YaZZvFfQrkHrM2XsyfA8cZE1thA3guTBfTkKqbhCDpcKFLG/0/*)#8gfuh6ex";
      const range: [number, number] = [1, 20];
      const scanobjects = [desc1, { desc, range }];
      const params: ScanTxOutSetParams = { action, scanobjects };
      const request = { params, method: "scantxoutset", id, jsonrpc };
      const result = {
        success: true,
        searched_items: 22946468,
        unspents: [
          {
            txid:
              "ab78587c07c039d1e55dc0efc959ba872693f98dce9e749a53582125e692f408",
            vout: 1,
            scriptPubKey: "76a914bdad1f4d02035b61fb1d237410e85d8402a1187d88ac",
            desc: "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)#7ca3vlzt",
            amount: 0.08745533,
            height: 1583799
          },
          {
            txid:
              "ed6f71276d0624989e8d572c98386e35c646cdce062c73ae0a1f554887d41aa5",
            vout: 1,
            scriptPubKey: "76a914bdad1f4d02035b61fb1d237410e85d8402a1187d88ac",
            desc: "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)#7ca3vlzt",
            amount: 0,
            height: 1352790
          },
          {
            txid:
              "801d5821586dd0dc10123b17d284983d6c835b8aa616e0ee828721c9073ba7ea",
            vout: 1,
            scriptPubKey: "76a914bdad1f4d02035b61fb1d237410e85d8402a1187d88ac",
            desc: "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)#7ca3vlzt",
            amount: 0,
            height: 1326382
          }
        ],
        total_amount: 0.08745533
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.scantxoutset(params);
      assert.deepStrictEqual(data, result);
    });

    test(".verifychain()", async () => {
      const checklevel = 1;
      const nblocks = 10;
      const params = { checklevel, nblocks };
      const request = { params, method: "verifychain", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.verifychain(params);
      assert.deepStrictEqual(data, result);
    });

    test(".verifytxoutproof()", async () => {
      const proof =
        "00000020ed07b12f0398e45fd403db11dbe894dc3301ce1a7725424e0b5e460c0000000066fca14db436f305aea37b3ae0f8b188cbf112dff3854c3d419f3ff3ebbc821f6c0c975dffff001d8fd5a7d2eb00000009e7acd3f605d1b957d684d9eeca9c472d803d90c0d17e29e5606f9b080b177a4abcd854622ad3900b5bc1ae71e99699a05eb972d46bd439c08eb7fbd20bba6494542222b2d1388f52c6d23ac12b32245ca47b02fc2f0a283a88aabca1f4db43ca8a4da8ffd7d9ae403b0c34ccbf14d2318c34fabb713c48f6d6490c6095250b6f08f26f020275d448dfb9967c62bedefaf29260021671a191f620f7783252788549b1e033dc815e2cd36ff204b398046f834643859f881a4d93b3fc5b91413a009c5069be274e1dcc675183ea2a989ef598422c0ed02e407aade8eaa6ef7ec1120ca4ffdef21b5fd26c4525a27c78cc38026b257f9d23f0d796603b1d3cbf539bdf87ccf9e81954f58e072d67eff2891339f203cbdec68bbbabbbbc0c070cceea03bf0a00";
      const params = { proof };
      const request = { params, method: "verifytxoutproof", id, jsonrpc };
      const result = [
        "6f0b2595600c49d6f6483c71bbfa348c31d214bfcc340c3b40aed9d7ffa84d8a"
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.verifytxoutproof(params);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Control", () => {
    test(".getmemoryinfo()", async () => {
      const params = { mode: "stats" };
      const request = { params, method: "getmemoryinfo", id, jsonrpc };
      const result = {
        locked: {
          used: 194112,
          free: 68032,
          total: 262144,
          locked: 0,
          chunks_used: 6065,
          chunks_free: 3
        }
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getmemoryinfo(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getrpcinfo()", async () => {
      const request = { params: {}, method: "getrpcinfo", id, jsonrpc };
      const result = {
        active_commands: [{ method: "getrpcinfo", duration: 0 }]
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getrpcinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".help()", async () => {
      const params = { command: "getzmqnotifications" };
      const request = { params, method: "help", id, jsonrpc };
      const result =
        'getzmqnotifications\n\nReturns information about the active ZeroMQ notifications.\n\nResult:\n[\n  {                        (json object)\n    "type": "pubhashtx",   (string) Type of notification\n    "address": "...",      (string) Address of the publisher\n    "hwm": n                 (numeric) Outbound message high water mark\n  },\n  ...\n]\n\nExamples:\n> bitcoin-cli getzmqnotifications \n> curl --user myusername --data-binary \'{"jsonrpc": "1.0", "id":"curltest", "method": "getzmqnotifications", "params": [] }\' -H \'content-type: text/plain;\' http://127.0.0.1:8332/\n';
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.help(params);
      assert.deepStrictEqual(data, result);
    });

    test(".logging()", async () => {
      const include = ["net", "rpc"];
      const exclude = ["mempoolrej", "estimatefee"];
      const params = { include, exclude };
      const request = { params, method: "logging", id, jsonrpc };
      const result = {
        net: true,
        tor: false,
        mempool: false,
        http: false,
        bench: false,
        zmq: false,
        db: false,
        rpc: true,
        estimatefee: false,
        addrman: false,
        selectcoins: false,
        reindex: false,
        cmpctblock: false,
        rand: false,
        prune: false,
        proxy: false,
        mempoolrej: false,
        libevent: false,
        coindb: false,
        qt: false,
        leveldb: false
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.logging(params);
      assert.deepStrictEqual(data, result);
    });

    test(".stop()", async () => {
      const request = { params: {}, method: "stop", id, jsonrpc };
      const result = "Bitcoin server stopping";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.stop();
      assert.deepStrictEqual(data, result);
    });

    test(".uptime()", async () => {
      const request = { params: {}, method: "uptime", id, jsonrpc };
      const result = 31;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.uptime();
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Generating", () => {
    test(".generate()", async () => {
      const params = { nblocks: 1, maxtries: 10000 };
      const request = { params, method: "generate", id, jsonrpc };
      const result: string[] = [];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.generate(params);
      assert.deepStrictEqual(data, result);
    });

    test(".generate() (multi-wallet)", async () => {
      const params = { nblocks: 1, maxtries: 10000 };
      const wallet = "bitcoin-core-wallet.dat";
      const request = { params, method: "generate", id, jsonrpc };
      const result: string[] = [];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.generate(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".generate() (default wallet)", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const client = new RPCClient({ port, timeout, pass, wallet });
      const params = { nblocks: 1, maxtries: 10000 };
      const request = { params, method: "generate", id, jsonrpc };
      const result: string[] = [];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.generate(params);
      assert.deepStrictEqual(data, result);
    });

    test(".generatetoaddress()", async () => {
      const address = "tb1qc4gce3kvc8px505r4wurwdytqclkdjta68qlh4";
      const params = { nblocks: 1, maxtries: 10000, address };
      const request = { params, method: "generatetoaddress", id, jsonrpc };
      const result: string[] = [];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.generatetoaddress(params);
      assert.deepStrictEqual(data, result);
    });

    test(".generatetoaddress() (multi-wallet)", async () => {
      const address = "tb1qc4gce3kvc8px505r4wurwdytqclkdjta68qlh4";
      const params = { nblocks: 1, maxtries: 10000, address };
      const wallet = "bitcoin-core-wallet.dat";
      const request = { params, method: "generatetoaddress", id, jsonrpc };
      const result: string[] = [];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.generatetoaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".generatetoaddress() (default wallet)", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const client = new RPCClient({ port, timeout, pass, wallet });
      const address = "tb1qc4gce3kvc8px505r4wurwdytqclkdjta68qlh4";
      const params = { nblocks: 1, maxtries: 10000, address };
      const request = { params, method: "generatetoaddress", id, jsonrpc };
      const result: string[] = [];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.generatetoaddress(params);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Mining", () => {
    test(".getblocktemplate()", async () => {
      const rules = ["segwit"];
      const mode: "template" = "template";
      const capabilities = ["serverlist", "proposal"];
      const template_request = { rules, mode, capabilities };
      const params = { template_request };
      const request = { params, method: "getblocktemplate", id, jsonrpc };
      const result = {
        capabilities: ["proposal"],
        version: 536870912,
        rules: ["csv", "segwit"],
        vbavailable: {},
        vbrequired: 0,
        previousblockhash:
          "00000000001eae7e020859bd4e814194768171fafa32ec0ff29a7f7718c68e3e",
        transactions: [
          {
            data:
              "02000000011dee34a06e97aa79e62a962deaaf36af4ade5cfa9d368e59b5f07d7a95f56a9c000000006a4730440220122a6742b92f4f7028d180a8439cd28923ac786c7014a511ff6a43a0b1f0a19c02201cef3090451ce5c40a11e511e00e906ff44547a21d96ba639b6f56bf43cdf88a012103842711dd54b0e087bc458952e482ef9b7605a74e02267d8e613e90c900b46b2ffeffffff029fe50a000000000017a914c6953707c8fe999f1597445182a316efc8c9a4f087480504000000000017a914895227f5e3b944768038354203245e3c8934acf8870e2b1800",
            txid:
              "304df7393fd7a5fa6ca3010f52c19a1b11294deb51040645ebc09c76f0c39e16",
            hash:
              "304df7393fd7a5fa6ca3010f52c19a1b11294deb51040645ebc09c76f0c39e16",
            depends: [],
            fee: 22361,
            sigops: 0,
            weight: 884
          },
          {
            data:
              "02000000000101e451d098b58f159d1879155f3b358ac3f1c9bca1b899c1f11556cfe97dd38109010000001716001490f5c95ca55492835d7b96f205122954496520b2feffffff02eb5c8e210200000017a914dff56b87c21831d6bc8a84407ceedb43ac700b8b87febc37000000000017a914c8847d0cced847080f0bd1811af48f0cde3b8ed38702473044022039395e975051eb8b302fd0bc21b82b336571f6251afe9ecf59da8a5810cfb15802201b005281279f93f3945985c9419cb6d6fb5f2a8e57309f125e71edd6be07383c012102d63dbd2425c008dc5af42f75e35cb14ab12f2d79444dc722aacd7d0b6da8a2260e2b1800",
            txid:
              "be76e368477a3de6c2f4ee69c578019384dfaf05e69b4481bbc84997691175b5",
            hash:
              "23f676d0e98ff7c0ab6b118ca2fcf9f073cf7e916a5c61673eb36fb1c4f79221",
            depends: [],
            fee: 16796,
            sigops: 1,
            weight: 661
          }
        ],
        coinbaseaux: { flags: "" },
        coinbasevalue: 39633673,
        longpollid:
          "00000000001eae7e020859bd4e814194768171fafa32ec0ff29a7f7718c68e3e1596",
        target:
          "0000000000000175ed0000000000000000000000000000000000000000000000",
        mintime: 1571918831,
        mutable: ["time", "transactions", "prevblock"],
        noncerange: "00000000ffffffff",
        sigoplimit: 80000,
        sizelimit: 4000000,
        weightlimit: 4000000,
        curtime: 1571924701,
        bits: "1a0175ed",
        height: 1583887,
        default_witness_commitment:
          "6a24aa21a9ed78a54605e10113365da2095badf375ae434b5abcda3d864a73c91477bd480676"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getblocktemplate(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getmininginfo()", async () => {
      const request = { params: {}, method: "getmininginfo", id, jsonrpc };
      const result = {
        blocks: 1583887,
        currentblockweight: 235257,
        currentblocktx: 134,
        difficulty: 1,
        networkhashps: 26197621661352.18,
        pooledtx: 101,
        chain: "test",
        warnings: "Warning: unknown new rules activated (versionbit 28)"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getmininginfo();
      assert.deepStrictEqual(data, result);
    });

    test(".getnetworkhashps()", async () => {
      const params = { nblocks: 100, height: 100 };
      const request = { params, method: "getnetworkhashps", id, jsonrpc };
      const result = 40893390.77406456;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getnetworkhashps(params);
      assert.deepStrictEqual(data, result);
    });

    test(".prioritisetransaction()", async () => {
      const txid =
        "9b0fc92260312ce44e74ef369f5c66bbb85848f2eddd5a7a1cde251e54ccfdd5";
      const fee_delta = 100;
      const params = { txid, fee_delta };
      const request = { params, method: "prioritisetransaction", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.prioritisetransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".submitblock()", async () => {
      const params = { hexdata: "PreviosBlockHex" };
      const request = { params, method: "submitblock", id, jsonrpc };
      const result = "duplicate";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.submitblock(params);
      assert.deepStrictEqual(data, result);
    });

    test(".submitheader()", async () => {
      const params = { hexdata: "PreviosBlockHeaderHex" };
      const request = { params, method: "submitheader", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.submitheader(params);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Network", () => {
    test(".addnode()", async () => {
      const command: "onetry" = "onetry";
      const params = { node: "192.168.0.6:8333", command };
      const request = { params, method: "addnode", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.addnode(params);
      assert.deepStrictEqual(data, result);
    });

    test(".clearbanned()", async () => {
      const request = { params: {}, method: "clearbanned", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.clearbanned();
      assert.deepStrictEqual(data, result);
    });

    test(".disconnectnode()", async () => {
      const params = { address: "92.53.89.123:18333" };
      const request = { params, method: "disconnectnode", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.disconnectnode(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getaddednodeinfo()", async () => {
      const params = { node: "92.53.89.123:18333" };
      const request = { params, method: "getaddednodeinfo", id, jsonrpc };
      const result = [
        {
          addednode: "92.53.89.123:18333",
          connected: true,
          addresses: [{ address: "92.53.89.123:18333", connected: "outbound" }]
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getaddednodeinfo(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getconnectioncount()", async () => {
      const request = { params: {}, method: "getconnectioncount", id, jsonrpc };
      const result = 9;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getconnectioncount();
      assert.deepStrictEqual(data, result);
    });

    test(".getnettotals()", async () => {
      const request = { params: {}, method: "getnettotals", id, jsonrpc };
      const result = {
        totalbytesrecv: 54576627,
        totalbytessent: 1420766,
        timemillis: 1571931082122,
        uploadtarget: {
          timeframe: 86400,
          target: 0,
          target_reached: false,
          serve_historical_blocks: true,
          bytes_left_in_cycle: 0,
          time_left_in_cycle: 0
        }
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getnettotals();
      assert.deepStrictEqual(data, result);
    });

    test(".getnetworkinfo()", async () => {
      const request = { params: {}, method: "getnetworkinfo", id, jsonrpc };
      const result = {
        version: 180100,
        subversion: "/Satoshi:0.18.1/",
        protocolversion: 70015,
        localservices: "000000000000040c",
        localrelay: true,
        timeoffset: -2,
        networkactive: true,
        connections: 9,
        networks: [
          {
            name: "ipv4",
            limited: false,
            reachable: true,
            proxy: "",
            proxy_randomize_credentials: false
          },
          {
            name: "ipv6",
            limited: false,
            reachable: true,
            proxy: "",
            proxy_randomize_credentials: false
          },
          {
            name: "onion",
            limited: true,
            reachable: false,
            proxy: "",
            proxy_randomize_credentials: false
          }
        ],
        relayfee: 0.00001,
        incrementalfee: 0.00001,
        localaddresses: [],
        warnings: "Warning: unknown new rules activated (versionbit 28)"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getnetworkinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".getnodeaddresses()", async () => {
      const params = { count: 2 };
      const request = { params, method: "getnodeaddresses", id, jsonrpc };
      const result = [
        {
          time: 1569474479,
          services: 1036,
          address: "188.162.132.87",
          port: 18333
        },
        {
          time: 1569557642,
          services: 1037,
          address: "174.138.24.48",
          port: 18333
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getnodeaddresses(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getpeerinfo()", async () => {
      const request = { params: {}, method: "getpeerinfo", id, jsonrpc };
      const result = [
        {
          id: 3,
          addr: "89.163.139.151:18333",
          addrlocal: "178.252.127.208:56815",
          addrbind: "192.168.1.110:56815",
          services: "000000000000040d",
          relaytxes: true,
          lastsend: 1571931713,
          lastrecv: 1571931697,
          bytessent: 98502,
          bytesrecv: 395446,
          conntime: 1571920343,
          timeoffset: -3,
          pingtime: 0.042976,
          minping: 0.042912,
          version: 70015,
          subver: "/Satoshi:0.17.0/",
          inbound: false,
          addnode: false,
          startingheight: 1583882,
          banscore: 0,
          synced_headers: 1583893,
          synced_blocks: 1583893,
          inflight: [],
          whitelisted: false,
          minfeefilter: 0.00001,
          bytessent_per_msg: {
            addr: 275,
            feefilter: 32,
            getaddr: 24,
            getdata: 25990,
            getheaders: 1085,
            headers: 106,
            inv: 60540,
            ping: 3072,
            pong: 3040,
            sendcmpct: 99,
            sendheaders: 24,
            tx: 4065,
            verack: 24,
            version: 126
          },
          bytesrecv_per_msg: {
            addr: 30192,
            cmpctblock: 16205,
            feefilter: 32,
            getdata: 549,
            getheaders: 1085,
            headers: 212,
            inv: 53955,
            ping: 3040,
            pong: 3072,
            reject: 77,
            sendcmpct: 66,
            sendheaders: 24,
            tx: 286787,
            verack: 24,
            version: 126
          }
        },
        {
          id: 5,
          addr: "165.227.30.200:18333",
          addrlocal: "178.252.127.208:56817",
          addrbind: "192.168.1.110:56817",
          services: "000000000000040d",
          relaytxes: true,
          lastsend: 1571931697,
          lastrecv: 1571931711,
          bytessent: 103195,
          bytesrecv: 238387,
          conntime: 1571920344,
          timeoffset: -2,
          pingtime: 0.174904,
          minping: 0.174861,
          version: 70015,
          subver: "/Satoshi:0.18.0/",
          inbound: false,
          addnode: false,
          startingheight: 1583882,
          banscore: 0,
          synced_headers: 1583893,
          synced_blocks: 1583893,
          inflight: [],
          whitelisted: false,
          minfeefilter: 0.00001,
          bytessent_per_msg: {
            addr: 55,
            feefilter: 32,
            getaddr: 24,
            getdata: 15268,
            getheaders: 1085,
            headers: 636,
            inv: 69856,
            ping: 3072,
            pong: 3040,
            sendcmpct: 66,
            sendheaders: 24,
            tx: 9887,
            verack: 24,
            version: 126
          },
          bytesrecv_per_msg: {
            addr: 30107,
            feefilter: 32,
            getdata: 1378,
            getheaders: 1085,
            headers: 1272,
            inv: 47253,
            ping: 3040,
            pong: 3072,
            reject: 77,
            sendcmpct: 66,
            sendheaders: 24,
            tx: 150831,
            verack: 24,
            version: 126
          }
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getpeerinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".listbanned()", async () => {
      const request = { params: {}, method: "listbanned", id, jsonrpc };
      const result = [
        {
          address: "92.53.89.123/32",
          banned_until: 1571932132,
          ban_created: 1571932032,
          ban_reason: "manually added"
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listbanned();
      assert.deepStrictEqual(data, result);
    });

    test(".ping()", async () => {
      const request = { params: {}, method: "ping", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.ping();
      assert.deepStrictEqual(data, result);
    });

    test(".setban()", async () => {
      const subnet = "92.53.89.123";
      const command: "add" = "add";
      const bantime = 1581599503;
      const absolute = true;
      const params = { subnet, command, bantime, absolute };
      const request = { params, method: "setban", id, jsonrpc };
      const result = [
        {
          time: 1569474479,
          services: 1036,
          address: "188.162.132.87",
          port: 18333
        },
        {
          time: 1569557642,
          services: 1037,
          address: "174.138.24.48",
          port: 18333
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.setban(params);
      assert.deepStrictEqual(data, result);
    });

    test(".setnetworkactive()", async () => {
      const params = { state: true };
      const request = { params, method: "setnetworkactive", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.setnetworkactive(params);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Rawtransactions", () => {
    test(".analyzepsbt()", async () => {
      const psbt =
        "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
      const params = { psbt };
      const request = { params, method: "analyzepsbt", id, jsonrpc };
      const result = {
        inputs: [
          { has_utxo: false, is_final: false, next: "updater" },
          { has_utxo: false, is_final: false, next: "updater" }
        ],
        next: "updater"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.analyzepsbt(params);
      assert.deepStrictEqual(data, result);
    });

    test(".combinepsbt()", async () => {
      const txs = [
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAAA",
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQABAR/HgTsAAAAAABYAFDNBVvuJV65T//o2rr6AhKSwDPt9AQhrAkcwRAIgWyFL8FdWh0kB8CbKL2GsVPQU2Wgb9E4YvOwJ9KLseMgCIHBdaP/zuYg7Y4cL5B+gjsOUB4PFss6+dnACpn/+U9UjASEDTi3KTyZW9vKWtxYxflo5B7l1PHSqn0GUlf8AsXkGfvQAAA=="
      ];
      const params = { txs };
      const request = { params, method: "combinepsbt", id, jsonrpc };
      const result =
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAEBH8eBOwAAAAAAFgAUM0FW+4lXrlP/+jauvoCEpLAM+30BCGsCRzBEAiBbIUvwV1aHSQHwJsovYaxU9BTZaBv0Thi87An0oux4yAIgcF1o//O5iDtjhwvkH6COw5QHg8Wyzr52cAKmf/5T1SMBIQNOLcpPJlb28pa3FjF+WjkHuXU8dKqfQZSV/wCxeQZ+9AAA";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.combinepsbt(params);
      assert.deepStrictEqual(data, result);
    });

    test(".combinerawtransaction()", async () => {
      const txs = [
        "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69000247304402201596d19c0eec785d301dad21ecc8bad1d808d4bd15615df1a5a1b9e930404066022038126c82743ccf5bc225b61a38ddd7ae651f12d27a730817de79279df8fd0ab88121028cc283639d0254c3f3091659d66f7681189de1ade326d36eefa50217956b057b00000000",
        "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69024730440220451546bae0bc61270eec966f1ca0a5cb16a93c5f88a800094240e61fb3f6fdd7022021a0065ec25e06f9e0b3a4d87b06d13adc2bd620dd8f2ecf7a40366ceaa93e998121039a3d49d8d6a2ca7ff2ea6657d3c8c19ba20ab67f529edb522030928b5f4894d20000000000"
      ];
      const params = { txs };
      const request = { params, method: "combinerawtransaction", id, jsonrpc };
      const result =
        "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69024730440220451546bae0bc61270eec966f1ca0a5cb16a93c5f88a800094240e61fb3f6fdd7022021a0065ec25e06f9e0b3a4d87b06d13adc2bd620dd8f2ecf7a40366ceaa93e998121039a3d49d8d6a2ca7ff2ea6657d3c8c19ba20ab67f529edb522030928b5f4894d20247304402201596d19c0eec785d301dad21ecc8bad1d808d4bd15615df1a5a1b9e930404066022038126c82743ccf5bc225b61a38ddd7ae651f12d27a730817de79279df8fd0ab88121028cc283639d0254c3f3091659d66f7681189de1ade326d36eefa50217956b057b00000000";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.combinerawtransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".converttopsbt()", async () => {
      const hexstring =
        "0200000002d552146118cdc257daac21cbc889188d58ff3788a8142d1ff3810bd589e26c7b0100000000fdffffff6b369c50b221b64f465c5ead75eeda0b84f74735680daeafe89b7273fd8f75ff0000000000fdffffff02d8470300000000001600146f709183bc76478188b2325f2ee692e8c043cb8fa086010000000000160014b7137dfed18ffe396fbe0b1678608cebdd45b1eb01000000";
      const permitsigdata = true;
      const iswitness = true;
      const params = { hexstring, permitsigdata, iswitness };
      const request = { params, method: "converttopsbt", id, jsonrpc };
      const result =
        "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.converttopsbt(params);
      assert.deepStrictEqual(data, result);
    });

    test(".createpsbt()", async () => {
      const inputs = [
        {
          txid:
            "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
          vout: 1
        },
        {
          txid:
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
          vout: 0
        }
      ];
      const out1: { [address: string]: number } = {
        tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su: 0.00215
      };
      const out2: { [address: string]: number } = {
        tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs: 0.001
      };
      const outputs = [out1, out2];
      const locktime = 1;
      const replaceable = true;
      const params = { inputs, outputs, locktime, replaceable };
      const request = { params, method: "createpsbt", id, jsonrpc };
      const result =
        "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.createpsbt(params);
      assert.deepStrictEqual(data, result);
    });

    test(".createrawtransaction()", async () => {
      const inputs = [
        {
          txid:
            "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
          vout: 1
        },
        {
          txid:
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
          vout: 0
        }
      ];
      const out1: { [address: string]: number } = {
        tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su: 0.00215
      };
      const out2: { [address: string]: number } = {
        tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs: 0.001
      };
      const outputs = [out1, out2];
      const locktime = 1;
      const replaceable = true;
      const params = { inputs, outputs, locktime, replaceable };
      const request = { params, method: "createrawtransaction", id, jsonrpc };
      const result =
        "0200000002d552146118cdc257daac21cbc889188d58ff3788a8142d1ff3810bd589e26c7b0100000000fdffffff6b369c50b221b64f465c5ead75eeda0b84f74735680daeafe89b7273fd8f75ff0000000000fdffffff02d8470300000000001600146f709183bc76478188b2325f2ee692e8c043cb8fa086010000000000160014b7137dfed18ffe396fbe0b1678608cebdd45b1eb01000000";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.createrawtransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".decodepsbt()", async () => {
      const psbt =
        "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
      const params = { psbt };
      const request = { params, method: "decodepsbt", id, jsonrpc };
      const result = {
        tx: {
          txid:
            "22ff139b2aaa971e3d8ed94dc8a70d82097b59ddc8f35d0e744461e96a4e9f1d",
          hash:
            "22ff139b2aaa971e3d8ed94dc8a70d82097b59ddc8f35d0e744461e96a4e9f1d",
          version: 2,
          size: 154,
          vsize: 154,
          weight: 616,
          locktime: 1,
          vin: [
            {
              txid:
                "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
              vout: 1,
              scriptSig: { asm: "", hex: "" },
              sequence: 4294967293
            },
            {
              txid:
                "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
              vout: 0,
              scriptSig: { asm: "", hex: "" },
              sequence: 4294967293
            }
          ],
          vout: [
            {
              value: 0.00215,
              n: 0,
              scriptPubKey: {
                asm: "0 6f709183bc76478188b2325f2ee692e8c043cb8f",
                hex: "00146f709183bc76478188b2325f2ee692e8c043cb8f",
                reqSigs: 1,
                type: "witness_v0_keyhash",
                addresses: ["tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su"]
              }
            },
            {
              value: 0.001,
              n: 1,
              scriptPubKey: {
                asm: "0 b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
                hex: "0014b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
                reqSigs: 1,
                type: "witness_v0_keyhash",
                addresses: ["tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs"]
              }
            }
          ]
        },
        unknown: {},
        inputs: [{}, {}],
        outputs: [{}, {}]
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.decodepsbt(params);
      assert.deepStrictEqual(data, result);
    });

    test(".decoderawtransaction()", async () => {
      const hexstring =
        "0200000002d552146118cdc257daac21cbc889188d58ff3788a8142d1ff3810bd589e26c7b0100000000fdffffff6b369c50b221b64f465c5ead75eeda0b84f74735680daeafe89b7273fd8f75ff0000000000fdffffff02d8470300000000001600146f709183bc76478188b2325f2ee692e8c043cb8fa086010000000000160014b7137dfed18ffe396fbe0b1678608cebdd45b1eb01000000";
      const iswitness = true;
      const params = { hexstring, iswitness };
      const request = { params, method: "decoderawtransaction", id, jsonrpc };
      const result = {
        txid:
          "22ff139b2aaa971e3d8ed94dc8a70d82097b59ddc8f35d0e744461e96a4e9f1d",
        hash:
          "22ff139b2aaa971e3d8ed94dc8a70d82097b59ddc8f35d0e744461e96a4e9f1d",
        version: 2,
        size: 154,
        vsize: 154,
        weight: 616,
        locktime: 1,
        vin: [
          {
            txid:
              "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
            vout: 1,
            scriptSig: { asm: "", hex: "" },
            sequence: 4294967293
          },
          {
            txid:
              "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
            vout: 0,
            scriptSig: { asm: "", hex: "" },
            sequence: 4294967293
          }
        ],
        vout: [
          {
            value: 0.00215,
            n: 0,
            scriptPubKey: {
              asm: "0 6f709183bc76478188b2325f2ee692e8c043cb8f",
              hex: "00146f709183bc76478188b2325f2ee692e8c043cb8f",
              reqSigs: 1,
              type: "witness_v0_keyhash",
              addresses: ["tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su"]
            }
          },
          {
            value: 0.001,
            n: 1,
            scriptPubKey: {
              asm: "0 b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
              hex: "0014b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
              reqSigs: 1,
              type: "witness_v0_keyhash",
              addresses: ["tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs"]
            }
          }
        ]
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.decoderawtransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".decodescript()", async () => {
      const hexstring =
        "5221031e925dbe43ca87bce874f4fb77ac0d6bb2dc1a9db93868fa27611b687775bd0b2102ffb8b66ba266797f1e33e5d177a6f9c72839992ccf11e97837054a8d3a8284bc21025bf696347321a5276aad08dfefff19dd09d3717bfc2ce521060f4247d31c37b553ae";
      const params = { hexstring };
      const request = { params, method: "decodescript", id, jsonrpc };
      const result = {
        asm:
          "2 031e925dbe43ca87bce874f4fb77ac0d6bb2dc1a9db93868fa27611b687775bd0b 02ffb8b66ba266797f1e33e5d177a6f9c72839992ccf11e97837054a8d3a8284bc 025bf696347321a5276aad08dfefff19dd09d3717bfc2ce521060f4247d31c37b5 3 OP_CHECKMULTISIG",
        reqSigs: 2,
        type: "multisig",
        addresses: [
          "miY4Gn8gzbU7SMNzTqRMgU78FVaLCEUnrd",
          "mkeLiKDk5MZX19e8P2CrKA2mwNgWLwzUoW",
          "mucT5ReiLujp3bA1mRSud7eAF6aRfS3v3D"
        ],
        p2sh: "2NFnZXZPkTfKPmBbDY6EhmVZc4tNK3eyLcr",
        segwit: {
          asm:
            "0 cc753b00fe0605f9f01bacd56c716c14d12676f40ec9e46e2de742b1d9175517",
          hex:
            "0020cc753b00fe0605f9f01bacd56c716c14d12676f40ec9e46e2de742b1d9175517",
          reqSigs: 1,
          type: "witness_v0_scripthash",
          addresses: [
            "tb1qe36nkq87qczlnuqm4n2kcutvzngjvah5pmy7gm3duaptrkgh25ts0p4m5w"
          ],
          "p2sh-segwit": "2Mzt4Uc77wz8rGk3Yad2kgJuj47ax5soMCJ"
        }
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.decodescript(params);
      assert.deepStrictEqual(data, result);
    });

    test(".finalizepsbt()", async () => {
      const psbt =
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAEBH8eBOwAAAAAAFgAUM0FW+4lXrlP/+jauvoCEpLAM+30BCGsCRzBEAiBbIUvwV1aHSQHwJsovYaxU9BTZaBv0Thi87An0oux4yAIgcF1o//O5iDtjhwvkH6COw5QHg8Wyzr52cAKmf/5T1SMBIQNOLcpPJlb28pa3FjF+WjkHuXU8dKqfQZSV/wCxeQZ+9AAA";
      const extract = true;
      const params = { psbt, extract };
      const request = { params, method: "finalizepsbt", id, jsonrpc };
      const result = {
        hex:
          "020000000001027f9115bb880cf88190de6e6b4be7515670c2f6e79c367c09ae19eb2def432aa70000000000fdffffff29455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960100000000fdffffff0160823b00000000001600148035bc99c1327407ba8faa9592a251042986c81502473044022007a70711f0889028f4cb7fd01d20b1f96bb8a7def745b4394696fe032a4f5de102206b72cbe094466fc4358a2a130b02b539da774c6fa7006a7802feeea6a30c231801210283450124a3ca764e4d321fe9b3a700d5d446ee7343d786a5401c075c79ebdfea0247304402205b214bf05756874901f026ca2f61ac54f414d9681bf44e18bcec09f4a2ec78c80220705d68fff3b9883b63870be41fa08ec3940783c5b2cebe767002a67ffe53d5230121034e2dca4f2656f6f296b716317e5a3907b9753c74aa9f419495ff00b179067ef401000000",
        complete: true
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.finalizepsbt(params);
      assert.deepStrictEqual(data, result);
    });

    test(".fundrawtransaction()", async () => {
      const hexstring =
        "020000000129455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960000000000fdffffff0140420f00000000001600148470e04e616ab6552d72e8284a32a293ff8a959b00000000";
      const replaceable = true;
      const changeAddress = "tb1q80h3kvp98fgkz293we3p75hs0aq4cecz3qtgkg";
      const options = { replaceable, changeAddress };
      const iswitness = true;
      const wallet = "wallet123.dat";
      const params = { hexstring, options, iswitness };
      const request = { params, method: "fundrawtransaction", id, jsonrpc };
      const result = {
        hex:
          "020000000229455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960000000000fdffffffa95716e643eed9055510fb925eb59b536ff496c642b2904ed5260c03574751d10000000000fdffffff02d4c52d00000000001600143bef1b30253a516128b176621f52f07f415c670240420f00000000001600148470e04e616ab6552d72e8284a32a293ff8a959b00000000",
        fee: 0.00000236,
        changepos: 0
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.fundrawtransaction(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getrawtransaction()", async () => {
      const txid =
        "a32ddaed3387a2bc0bb9a4f90bc6e84e5589335b97142848ad144efd38420eb2";
      const verbose = true;
      const blockhash =
        "00000000480351c0fc7047af37756bbae30996a018e94d9ca8156dccea032018";
      const params = { txid, verbose, blockhash };
      const request = { params, method: "getrawtransaction", id, jsonrpc };
      const result = {
        in_active_chain: true,
        txid:
          "a32ddaed3387a2bc0bb9a4f90bc6e84e5589335b97142848ad144efd38420eb2",
        hash:
          "a32ddaed3387a2bc0bb9a4f90bc6e84e5589335b97142848ad144efd38420eb2",
        version: 1,
        size: 190,
        vsize: 190,
        weight: 760,
        locktime: 0,
        vin: [
          {
            txid:
              "2250db8ac157f4523e18ec9521bfb3c3249752d112dab14d4742ddce4ceb3189",
            vout: 1,
            scriptSig: {
              asm:
                "3045022100d21fffc9343da1b2ec190c7084f8a69d201adcd88b880beb013fa4e0ab4158ad02205e0c362f844cc63539467b37d583128c7d2f7754864d08efe29cef98272688e2[ALL] 039c17e0e4ebd61c753fda99392658a692dbfdab430399b1e12221da6a4cda5dd9",
              hex:
                "483045022100d21fffc9343da1b2ec190c7084f8a69d201adcd88b880beb013fa4e0ab4158ad02205e0c362f844cc63539467b37d583128c7d2f7754864d08efe29cef98272688e20121039c17e0e4ebd61c753fda99392658a692dbfdab430399b1e12221da6a4cda5dd9"
            },
            sequence: 4294967295
          }
        ],
        vout: [
          {
            value: 0.53015771,
            n: 0,
            scriptPubKey: {
              asm:
                "OP_HASH160 5629021f7668d4ec310ac5e99701a6d6cf95eb8f OP_EQUAL",
              hex: "a9145629021f7668d4ec310ac5e99701a6d6cf95eb8f87",
              reqSigs: 1,
              type: "scripthash",
              addresses: ["2N16oE62ZjAPup985dFBQYAuy5zpDraH7Hk"]
            }
          }
        ],
        hex:
          "01000000018931eb4ccedd42474db1da12d1529724c3b3bf2195ec183e52f457c18adb5022010000006b483045022100d21fffc9343da1b2ec190c7084f8a69d201adcd88b880beb013fa4e0ab4158ad02205e0c362f844cc63539467b37d583128c7d2f7754864d08efe29cef98272688e20121039c17e0e4ebd61c753fda99392658a692dbfdab430399b1e12221da6a4cda5dd9ffffffff01dbf428030000000017a9145629021f7668d4ec310ac5e99701a6d6cf95eb8f8700000000",
        blockhash:
          "00000000480351c0fc7047af37756bbae30996a018e94d9ca8156dccea032018",
        confirmations: 3204,
        time: 1570540739,
        blocktime: 1570540739
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getrawtransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".joinpsbts()", async () => {
      const txs = [
        "cHNidP8BAFICAAAAAdVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////AdhHAwAAAAAAFgAUb3CRg7x2R4GIsjJfLuaS6MBDy48BAAAAAAAA",
        "cHNidP8BAFICAAAAAWs2nFCyIbZPRlxerXXu2guE90c1aA2ur+ibcnP9j3X/AAAAAAD9////AaCGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAA"
      ];
      const params = { txs };
      const request = { params, method: "joinpsbts", id, jsonrpc };
      const result =
        "cHNidP8BAJoCAAAAAtVSFGEYzcJX2qwhy8iJGI1Y/zeIqBQtH/OBC9WJ4mx7AQAAAAD9////azacULIhtk9GXF6tde7aC4T3RzVoDa6v6Jtyc/2Pdf8AAAAAAP3///8C2EcDAAAAAAAWABRvcJGDvHZHgYiyMl8u5pLowEPLj6CGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAAAAA=";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.joinpsbts(params);
      assert.deepStrictEqual(data, result);
    });

    test(".sendrawtransaction()", async () => {
      const hexstring =
        "020000000001027f9115bb880cf88190de6e6b4be7515670c2f6e79c367c09ae19eb2def432aa70000000000fdffffff29455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960100000000fdffffff0160823b00000000001600148035bc99c1327407ba8faa9592a251042986c81502473044022007a70711f0889028f4cb7fd01d20b1f96bb8a7def745b4394696fe032a4f5de102206b72cbe094466fc4358a2a130b02b539da774c6fa7006a7802feeea6a30c231801210283450124a3ca764e4d321fe9b3a700d5d446ee7343d786a5401c075c79ebdfea0247304402205b214bf05756874901f026ca2f61ac54f414d9681bf44e18bcec09f4a2ec78c80220705d68fff3b9883b63870be41fa08ec3940783c5b2cebe767002a67ffe53d5230121034e2dca4f2656f6f296b716317e5a3907b9753c74aa9f419495ff00b179067ef401000000";
      const allowhighfees = true;
      const params = { hexstring, allowhighfees };
      const request = { params, method: "sendrawtransaction", id, jsonrpc };
      const result =
        "d1514757030c26d54e90b242c696f46f539bb55e92fb105505d9ee43e61657a9";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.sendrawtransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".signrawtransactionwithkey()", async () => {
      const hexstring =
        "02000000029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e6900000000";
      const privkeys = [
        "cSo9pNKNPhPhebybLJaE2BdqAtYjMGJHpxujScKd2ZTrgxCD28r6",
        "cQeGBYp4NiFj2L2d1ivgan4UMsba3oWQKiBf98tq1QXjPiKQMQeB"
      ];
      const sighashtype: "ALL|ANYONECANPAY" = "ALL|ANYONECANPAY";
      const params = { hexstring, privkeys, sighashtype };
      const request = {
        params,
        method: "signrawtransactionwithkey",
        id,
        jsonrpc
      };
      const result = {
        hex:
          "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69024730440220451546bae0bc61270eec966f1ca0a5cb16a93c5f88a800094240e61fb3f6fdd7022021a0065ec25e06f9e0b3a4d87b06d13adc2bd620dd8f2ecf7a40366ceaa93e998121039a3d49d8d6a2ca7ff2ea6657d3c8c19ba20ab67f529edb522030928b5f4894d20247304402201596d19c0eec785d301dad21ecc8bad1d808d4bd15615df1a5a1b9e930404066022038126c82743ccf5bc225b61a38ddd7ae651f12d27a730817de79279df8fd0ab88121028cc283639d0254c3f3091659d66f7681189de1ade326d36eefa50217956b057b00000000",
        complete: true
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.signrawtransactionwithkey(params);
      assert.deepStrictEqual(data, result);
    });

    test(".testmempoolaccept()", async () => {
      const rawtxs = [
        "020000000001027f9115bb880cf88190de6e6b4be7515670c2f6e79c367c09ae19eb2def432aa70000000000fdffffff29455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960100000000fdffffff0160823b00000000001600148035bc99c1327407ba8faa9592a251042986c81502473044022007a70711f0889028f4cb7fd01d20b1f96bb8a7def745b4394696fe032a4f5de102206b72cbe094466fc4358a2a130b02b539da774c6fa7006a7802feeea6a30c231801210283450124a3ca764e4d321fe9b3a700d5d446ee7343d786a5401c075c79ebdfea0247304402205b214bf05756874901f026ca2f61ac54f414d9681bf44e18bcec09f4a2ec78c80220705d68fff3b9883b63870be41fa08ec3940783c5b2cebe767002a67ffe53d5230121034e2dca4f2656f6f296b716317e5a3907b9753c74aa9f419495ff00b179067ef401000000"
      ];
      const allowhighfees = true;
      const params = { rawtxs, allowhighfees };
      const request = { params, method: "testmempoolaccept", id, jsonrpc };
      const result = [
        {
          txid:
            "d1514757030c26d54e90b242c696f46f539bb55e92fb105505d9ee43e61657a9",
          allowed: true
        }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.testmempoolaccept(params);
      assert.deepStrictEqual(data, result);
    });

    test(".utxoupdatepsbt()", async () => {
      const psbt =
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAAA";
      const params = { psbt };
      const request = { params, method: "utxoupdatepsbt", id, jsonrpc };
      const result =
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQEIawJHMEQCIAenBxHwiJAo9Mt/0B0gsflruKfe90W0OUaW/gMqT13hAiBrcsvglEZvxDWKKhMLArU52ndMb6cAangC/u6mowwjGAEhAoNFASSjynZOTTIf6bOnANXURu5zQ9eGpUAcB1x569/qAAEBH8eBOwAAAAAAFgAUM0FW+4lXrlP/+jauvoCEpLAM+30AAA==";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.utxoupdatepsbt(params);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Util", () => {
    test(".createmultisig()", async () => {
      const nrequired = 2;
      const keys = [
        "03789ed0bb717d88f7d321a368d905e7430207ebbd82bd342cf11ae157a7ace5fd",
        "03dbc6764b8884a92e871274b87583e6d5c2a58819473e17e107ef3f6aa5a61626"
      ];
      const address_type: "bech32" = "bech32";
      const params = { nrequired, keys, address_type };
      const request = { params, method: "createmultisig", id, jsonrpc };
      const result = {
        address:
          "tb1q0jnggjwnn22a4ywxc2pcw86c0d6tghqkgk3hlryrxl7nmxkylmnqdcdsu7",
        redeemScript:
          "522103789ed0bb717d88f7d321a368d905e7430207ebbd82bd342cf11ae157a7ace5fd2103dbc6764b8884a92e871274b87583e6d5c2a58819473e17e107ef3f6aa5a6162652ae"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.createmultisig(params);
      assert.deepStrictEqual(data, result);
    });

    test(".deriveaddresses()", async () => {
      const descriptor =
        "wpkh([d34db33f/84'/0'/0']tpubD6NzVbkrYhZ4YTN7usjEzYmfu4JKqnfp9RCbDmdKH78vTyuwgQat8vRw5cX1YaZZvFfQrkHrM2XsyfA8cZE1thA3guTBfTkKqbhCDpcKFLG/0/*)#8gfuh6ex";
      const range: [number, number] = [0, 2];
      const params = { descriptor, range };
      const request = { params, method: "deriveaddresses", id, jsonrpc };
      const result = [
        "tb1q7as9cz0t8rfng5f0xdklfgyp0x6ya0tu6ckaqs",
        "tb1q0aducdmz77tfu4dhfez8ayycmp2pz6jwy85hhn",
        "tb1qsdqewd8upv66txx48qssr0an5r3llaxtwqzytk"
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.deriveaddresses(params);
      assert.deepStrictEqual(data, result);
    });

    test(".estimatesmartfee()", async () => {
      const estimate_mode: "ECONOMICAL" = "ECONOMICAL";
      const params = { conf_target: 2, estimate_mode };
      const request = { params, method: "estimatesmartfee", id, jsonrpc };
      const result = { feerate: 0.00001, blocks: 2 };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.estimatesmartfee(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getdescriptorinfo()", async () => {
      const descriptor =
        "wpkh([d34db33f/84h/0h/0h]0279be667ef9dcbbac55a06295Ce870b07029Bfcdb2dce28d959f2815b16f81798)";
      const params = { descriptor };
      const request = { params, method: "getdescriptorinfo", id, jsonrpc };
      const result = {
        descriptor:
          "wpkh([d34db33f/84'/0'/0']0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798)#n9g43y4k",
        isrange: false,
        issolvable: true,
        hasprivatekeys: false
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getdescriptorinfo(params);
      assert.deepStrictEqual(data, result);
    });

    test(".signmessagewithprivkey()", async () => {
      const privkey = "cPGLkRL4zvHfpcEkjPb93GEHth8WZpTJH2YCCoYWS7kHcFFarn8U";
      const message = "Hello World";
      const params = { privkey, message };
      const request = { params, method: "signmessagewithprivkey", id, jsonrpc };
      const result =
        "IIXi7nhOGKbW2uOW2cmV/BbOvlIDzVu0KTZdvntP634/BRL2DmFSvtwifkDMa+pDKd+eRrTbEi6XVAc82JKTiwA=";
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.signmessagewithprivkey(params);
      assert.deepStrictEqual(data, result);
    });

    test(".validateaddress()", async () => {
      const params = { address: "tb1qmv634mfk34sks9z3tcwwncd9ug0why3a0pl4px" };
      const request = { params, method: "validateaddress", id, jsonrpc };
      const result = {
        isvalid: true,
        address: "tb1qmv634mfk34sks9z3tcwwncd9ug0why3a0pl4px",
        scriptPubKey: "0014db351aed368d616814515e1ce9e1a5e21eeb923d",
        isscript: false,
        iswitness: true,
        witness_version: 0,
        witness_program: "db351aed368d616814515e1ce9e1a5e21eeb923d"
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.validateaddress(params);
      assert.deepStrictEqual(data, result);
    });

    test(".verifymessage()", async () => {
      const address = "myv3xs1BBBhaDVU62LFNBho2zSp4KLBkgK";
      const signature =
        "H14/QyrMj8e63GyEXBDDWnWrplXK3OORnMc3B+fEOOisbNFEAQuNB9myAH9qs7h1VNJb1xq1ytPQqiLcmSwwPv8=";
      const message = "Hello World";
      const params = { address, signature, message };
      const request = { params, method: "verifymessage", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.verifymessage(params);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Wallet", () => {
    test(".abandontransaction()", async () => {
      const txid =
        "d1514757030c26d54e90b242c696f46f539bb55e92fb105505d9ee43e61657a9";
      const params = { txid };
      const wallet = "bitcoin-core-wallet.dat";
      const request = { params, method: "abandontransaction", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.abandontransaction(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".abortrescan()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const request = { params: {}, method: "abortrescan", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.abortrescan(wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".addmultisigaddress()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const nrequired = 2;
      const keys = [
        "030b0f444121f91cf323ad599ee8ced39dcbb136905e8ac42f9bdb4756142c716f",
        "02ea2e2847de9386b704cacb5c730c272c4f3e7b14a586ca6122cdacff5dea59e9"
      ];
      const label = "NewMultiSigAddress";
      const address_type: "bech32" = "bech32";
      const params = { nrequired, keys, label, address_type };
      const request = { params, method: "addmultisigaddress", id, jsonrpc };
      const result = {
        address:
          "tb1qylfjvzx7a7wkntajyvek2wur2qnmt3gxqnevhjkw957fw0ggw9nqczpy6l",
        redeemScript:
          "5221030b0f444121f91cf323ad599ee8ced39dcbb136905e8ac42f9bdb4756142c716f2102ea2e2847de9386b704cacb5c730c272c4f3e7b14a586ca6122cdacff5dea59e952ae"
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.addmultisigaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".backupwallet()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const destination = "D:/Crypto/wallets/myWalletBackup.dat";
      const params = { destination };
      const request = { params, method: "backupwallet", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.backupwallet(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".bumpfee()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const txid =
        "92dee32122b5f270c2c28eb4bdccd767f897b613ee51157bfcc4b53c5106acf1";
      const totalFee = 839;
      const replaceable = true;
      const estimate_mode: "CONSERVATIVE" = "CONSERVATIVE";
      const options = { totalFee, replaceable, estimate_mode };
      const params = { txid, options };
      const request = { params, method: "bumpfee", id, jsonrpc };
      const result = {
        txid:
          "e540d4c27e148c193979dc5bb7e86110f818311a51223e6ba5f5d9e8daaf5e3d",
        origfee: 0.00000144,
        fee: 0.00000839,
        errors: []
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.bumpfee(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".createwallet()", async () => {
      const wallet_name = "bitcoin-core-wallet.dat";
      const disable_private_keys = true;
      const blank = true;
      const params = { wallet_name, disable_private_keys, blank };
      const request = { params, method: "createwallet", id, jsonrpc };
      const result = { name: "bitcoin-core-wallet.dat", warning: "" };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.createwallet(params);
      assert.deepStrictEqual(data, result);
    });

    test(".dumpprivkey()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const address = "tb1qaja4q2pq8neunch5lwhrg653kjyztreww23u82";
      const params = { address };
      const request = { params, method: "dumpprivkey", id, jsonrpc };
      const result = "cP5xfMhFMPztvBc2UYusUuKU7yaSr1pS1k54gfPAHei6KPjgma2W";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.dumpprivkey(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".dumpwallet()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const filename = "myWalletDump.dat";
      const params = { filename };
      const request = { params, method: "dumpwallet", id, jsonrpc };
      const result = {
        filename: "D:\\Wallets\\Bitcoin Core\\myWalletDump.dat"
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.dumpwallet(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".encryptwallet()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const passphrase = "VerySecretPassphraseDoNotTellAnyone";
      const params = { passphrase };
      const request = { params, method: "encryptwallet", id, jsonrpc };
      const result =
        "wallet encrypted; The keypool has been flushed and a new HD seed was generated (if you are using HD). You need to make a new backup.";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.encryptwallet(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getaddressesbylabel()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const label = "SomeLabel";
      const params = { label };
      const request = { params, method: "getaddressesbylabel", id, jsonrpc };
      const result = {
        tb1qxwqd5gance6rk9xel5uwuxxdj79wfwgaxsrnn0: { purpose: "receive" },
        tb1qds5qv262690uvsh6wytp0aq8xey29jfuegv4pj: { purpose: "receive" }
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getaddressesbylabel(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getaddressinfo()", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const address = "tb1qds5qv262690uvsh6wytp0aq8xey29jfuegv4pj";
      const params = { address };
      const request = { params, method: "getaddressinfo", id, jsonrpc };
      const result = {
        address: "tb1qds5qv262690uvsh6wytp0aq8xey29jfuegv4pj",
        scriptPubKey: "00146c28062b4ad15fc642fa711617f4073648a2c93c",
        ismine: true,
        solvable: true,
        desc:
          "wpkh([2f8f8c1b/0'/0'/25']028f8e5afd6c3dd82e7fa75cd6558c35cc56d3c1403e6659a3ddec71cac6382a7d)#xgmuj4mj",
        iswatchonly: false,
        isscript: false,
        iswitness: true,
        witness_version: 0,
        witness_program: "6c28062b4ad15fc642fa711617f4073648a2c93c",
        pubkey:
          "028f8e5afd6c3dd82e7fa75cd6558c35cc56d3c1403e6659a3ddec71cac6382a7d",
        label: "SomeLabel",
        ischange: false,
        timestamp: 1570725096,
        hdkeypath: "m/0'/0'/25'",
        hdseedid: "d43760fda85e35a75e0bed11233185630f8d1279",
        hdmasterfingerprint: "2f8f8c1b",
        labels: [{ name: "SomeLabel", purpose: "receive" }]
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getaddressinfo(params, wallet);
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Zmq", () => {
    test(".getzmqnotifications()", async () => {
      const params = {};
      const request = { params, method: "getzmqnotifications", id, jsonrpc };
      const result = [
        {
          type: "pubhashblock",
          address: "tcp://127.0.0.1:3333",
          hwm: 1000
        },
        { type: "pubhashtx", address: "tcp://127.0.0.1:3333", hwm: 1000 },
        {
          type: "pubrawblock",
          address: "tcp://127.0.0.1:3333",
          hwm: 1000
        },
        { type: "pubrawtx", address: "tcp://127.0.0.1:3333", hwm: 1000 }
      ];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getzmqnotifications();
      assert.deepStrictEqual(data, result);
    });
  });
});
