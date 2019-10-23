import { RPCClient, GetBlockParams } from "../.";
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
      const verbosity = 2;
      const params: GetBlockParams = { blockhash, verbosity };
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
  });
});
