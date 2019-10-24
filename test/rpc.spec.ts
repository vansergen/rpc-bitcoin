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
    const response = { error, id, result };
    nock(uri)
      .post("/", request)
      .times(1)
      .basicAuth(auth)
      .reply(200, response);
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
    const response = { result, error, id };
    nock(uri)
      .post("/wallet/" + wallet, request)
      .times(1)
      .basicAuth(auth)
      .reply(200, response);
    const data = await client.rpc(method, params, wallet);
    assert.deepStrictEqual(data, result);
  });

  suite("Blockchain", () => {
    test(".getbestblockhash()", async () => {
      const request = { params: {}, method: "getbestblockhash", id, jsonrpc };
      const result =
        "000000006e60e2ae7b464e4e38e061cb4aea9dafa605cc1d38d34601fdf77064";
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getblockchaininfo();
      assert.deepStrictEqual(data, result);
    });

    test(".getblockcount()", async () => {
      const request = { params: {}, method: "getblockcount", id, jsonrpc };
      const result = 1583782;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getblockcount();
      assert.deepStrictEqual(data, result);
    });

    test(".getblockhash()", async () => {
      const height = 1583782;
      const params = { height };
      const request = { params, method: "getblockhash", id, jsonrpc };
      const result =
        "00000000a4991fe43933f0a0bde13b6b22b4308442453845903151004e9cc0a5";
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getchaintxstats(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getdifficulty()", async () => {
      const request = { params: {}, method: "getdifficulty", id, jsonrpc };
      const result = 1;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.gettxoutsetinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".preciousblock()", async () => {
      const blockhash =
        "00000000000000261a35cf378bf8fa1bf6ac87800d798ce2a11f581f562e92ba";
      const params = { blockhash };
      const request = { params, method: "preciousblock", id, jsonrpc };
      const result = null;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.preciousblock(params);
      assert.deepStrictEqual(data, result);
    });

    test(".pruneblockchain()", async () => {
      const height = 1000;
      const params = { height };
      const request = { params, method: "pruneblockchain", id, jsonrpc };
      const result = 1566856;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.pruneblockchain(params);
      assert.deepStrictEqual(data, result);
    });

    test(".savemempool()", async () => {
      const request = { params: {}, method: "savemempool", id, jsonrpc };
      const result = null;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.scantxoutset(params);
      assert.deepStrictEqual(data, result);
    });

    test(".verifychain()", async () => {
      const checklevel = 1;
      const nblocks = 10;
      const params = { checklevel, nblocks };
      const request = { params, method: "verifychain", id, jsonrpc };
      const result = true;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getmemoryinfo(params);
      assert.deepStrictEqual(data, result);
    });

    test(".getrpcinfo()", async () => {
      const request = { params: {}, method: "getrpcinfo", id, jsonrpc };
      const result = {
        active_commands: [{ method: "getrpcinfo", duration: 0 }]
      };
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getrpcinfo();
      assert.deepStrictEqual(data, result);
    });

    test(".help()", async () => {
      const params = { command: "getzmqnotifications" };
      const request = { params, method: "help", id, jsonrpc };
      const result =
        'getzmqnotifications\n\nReturns information about the active ZeroMQ notifications.\n\nResult:\n[\n  {                        (json object)\n    "type": "pubhashtx",   (string) Type of notification\n    "address": "...",      (string) Address of the publisher\n    "hwm": n                 (numeric) Outbound message high water mark\n  },\n  ...\n]\n\nExamples:\n> bitcoin-cli getzmqnotifications \n> curl --user myusername --data-binary \'{"jsonrpc": "1.0", "id":"curltest", "method": "getzmqnotifications", "params": [] }\' -H \'content-type: text/plain;\' http://127.0.0.1:8332/\n';
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.logging(params);
      assert.deepStrictEqual(data, result);
    });

    test(".stop()", async () => {
      const request = { params: {}, method: "stop", id, jsonrpc };
      const result = "Bitcoin server stopping";
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.stop();
      assert.deepStrictEqual(data, result);
    });

    test(".uptime()", async () => {
      const request = { params: {}, method: "uptime", id, jsonrpc };
      const result = 31;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.uptime();
      assert.deepStrictEqual(data, result);
    });
  });

  suite("Generating", () => {
    test(".generate()", async () => {
      const params = { nblocks: 1, maxtries: 10000 };
      const request = { params, method: "generate", id, jsonrpc };
      const result: any[] = [];
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.generate(params);
      assert.deepStrictEqual(data, result);
    });

    test(".generate() (multi-wallet)", async () => {
      const params = { nblocks: 1, maxtries: 10000 };
      const wallet = "bitcoin-core-wallet.dat";
      const request = { params, method: "generate", id, jsonrpc };
      const result: any[] = [];
      const response = { result, error, id };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.generate(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".generate() (default wallet)", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const client = new RPCClient({ port, timeout, pass, wallet });
      const params = { nblocks: 1, maxtries: 10000 };
      const request = { params, method: "generate", id, jsonrpc };
      const result: any[] = [];
      const response = { result, error, id };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.generate(params);
      assert.deepStrictEqual(data, result);
    });

    test(".generatetoaddress()", async () => {
      const address = "tb1qc4gce3kvc8px505r4wurwdytqclkdjta68qlh4";
      const params = { nblocks: 1, maxtries: 10000, address };
      const request = { params, method: "generatetoaddress", id, jsonrpc };
      const result: any[] = [];
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.generatetoaddress(params);
      assert.deepStrictEqual(data, result);
    });

    test(".generatetoaddress() (multi-wallet)", async () => {
      const address = "tb1qc4gce3kvc8px505r4wurwdytqclkdjta68qlh4";
      const params = { nblocks: 1, maxtries: 10000, address };
      const wallet = "bitcoin-core-wallet.dat";
      const request = { params, method: "generatetoaddress", id, jsonrpc };
      const result: any[] = [];
      const response = { result, error, id };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.generatetoaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".generatetoaddress() (default wallet)", async () => {
      const wallet = "bitcoin-core-wallet.dat";
      const client = new RPCClient({ port, timeout, pass, wallet });
      const address = "tb1qc4gce3kvc8px505r4wurwdytqclkdjta68qlh4";
      const params = { nblocks: 1, maxtries: 10000, address };
      const request = { params, method: "generatetoaddress", id, jsonrpc };
      const result: any[] = [];
      const response = { result, error, id };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getmininginfo();
      assert.deepStrictEqual(data, result);
    });

    test(".getnetworkhashps()", async () => {
      const params = { nblocks: 100, height: 100 };
      const request = { params, method: "getnetworkhashps", id, jsonrpc };
      const result = 40893390.77406456;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.prioritisetransaction(params);
      assert.deepStrictEqual(data, result);
    });

    test(".submitblock()", async () => {
      const params = { hexdata: "PreviosBlockHex" };
      const request = { params, method: "submitblock", id, jsonrpc };
      const result = "duplicate";
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.submitblock(params);
      assert.deepStrictEqual(data, result);
    });

    test(".submitheader()", async () => {
      const params = { hexdata: "PreviosBlockHeaderHex" };
      const request = { params, method: "submitheader", id, jsonrpc };
      const result = null;
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.addnode(params);
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
      const response = { result, error, id };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, response);
      const data = await client.getzmqnotifications();
      assert.deepStrictEqual(data, result);
    });
  });
});
