import { RPCClient, ScanTxOutSetParams } from "../.";
import * as nock from "nock";
import * as assert from "assert";

const port = 18332;
const timeout = 20000;
const pass = "rpcpassword";
const auth = { user: "", pass };
const uri = "http://localhost:" + port;
const client = new RPCClient({ port, timeout, pass });
const wallet = "bitcoin-core-wallet.dat";

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
      { method: "getzmqnotifications", params: {}, id: 2 },
    ];
    const response = [
      {
        result:
          "000000000004f7f1ec631acb86a86ef0d97f1294d79f5fba1d0e579c1513b5ea",
        error,
        id: 1,
      },
      {
        result:
          'help ( "command" )\n\nList all commands, or get help for a specified command.\n\nArguments:\n1. command    (string, optional, default=all commands) The command to get help on\n\nResult:\n"text"     (string) The help text\n',
        error,
        id: "custom-id",
      },
      { result: [], error, id: 2 },
    ];
    nock(uri).post("/", requests).times(1).basicAuth(auth).reply(200, response);
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
    nock(uri).post("/", request).times(1).basicAuth(auth).reply(200, response);
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

  test(".rpc() (404 error)", async () => {
    const method = "foo";
    const params = { label: "newlabel", address_type: "bech32" };
    const request = { params, method, id, jsonrpc };
    const result = null;
    const error = { code: -32601, message: "Method not found" };
    nock(uri)
      .post("/", request)
      .times(1)
      .basicAuth(auth)
      .reply(404, { result, error, id });
    try {
      await client.rpc(method, params);
    } catch (err) {
      assert.deepStrictEqual(err, error);
    }
  });

  test(".rpc() (500 error)", async () => {
    const method = "foo";
    const params = { label: "newlabel", address_type: "badtype" };
    const request = { params, method, id, jsonrpc };
    const result = null;
    const error = { code: -5, message: "Unknown address type 'badtype'" };
    nock(uri)
      .post("/wallet/" + wallet, request)
      .times(1)
      .basicAuth(auth)
      .reply(500, { result, error, id });
    try {
      await client.rpc(method, params, wallet);
    } catch (err) {
      assert.deepStrictEqual(err, error);
    }
  });

  test(".rpc() (500 error) (with fullResponse)", async () => {
    const client = new RPCClient({ port, timeout, pass, fullResponse: true });
    const method = "foo";
    const params = { label: "newlabel", address_type: "badtype" };
    const request = { params, method, id, jsonrpc };
    const result = null;
    const error = { code: -5, message: "Unknown address type 'badtype'" };
    const response = { result, error, id };
    nock(uri)
      .post("/wallet/" + wallet, request)
      .times(1)
      .basicAuth(auth)
      .reply(500, response);
    try {
      await client.rpc(method, params, wallet);
    } catch (err) {
      assert.deepStrictEqual(err, response);
    }
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
                sequence: 0,
              },
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
                  addresses: ["2N9fzq66uZYQXp7uqrPBH6jKBhjrgTzpGCy"],
                },
              },
              {
                value: 0,
                n: 1,
                scriptPubKey: {
                  asm:
                    "OP_RETURN aa21a9ed3116a1d2c6dc9cf601112589ce7d2334acd8a196fb02ceacddf6eed2bf4b72b5",
                  hex:
                    "6a24aa21a9ed3116a1d2c6dc9cf601112589ce7d2334acd8a196fb02ceacddf6eed2bf4b72b5",
                  type: "nulldata",
                },
              },
            ],
            hex:
              "010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff1f036f1d180459fe965d08f80000014b0700000c2f746573746e65747465722f0000000002e2f332030000000017a914b4316d69836fe185d3d4ca234e90a7a5ce6491ab870000000000000000266a24aa21a9ed3116a1d2c6dc9cf601112589ce7d2334acd8a196fb02ceacddf6eed2bf4b72b50120000000000000000000000000000000000000000000000000000000000000000000000000",
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
                    "48304502210098a6a7a2329a7373ff838b3e816e8b48f94238dfbe08add7896ff95127ebfc310220541302168ae986ec6abbb0c5eea95f069621166fe841ba965ed6ea3bb351735c01210396cfa148d2fc150d225262836aaf4ed98da771a9c2f6bc54da03d402d3f1a384",
                },
                sequence: 4294967295,
              },
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
                  addresses: ["n3LnFeCEuo6zcRS7kGuKx9URwnLXHaKonL"],
                },
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
                  addresses: ["mpL9TfWHudvTkWPrtzwkcuD4mKoo7eXJo5"],
                },
              },
            ],
            hex:
              "01000000014473be9b0ff6a1ce12c4e43b3bf7191fb13b2b6779233b0f190de97da1453162010000006b48304502210098a6a7a2329a7373ff838b3e816e8b48f94238dfbe08add7896ff95127ebfc310220541302168ae986ec6abbb0c5eea95f069621166fe841ba965ed6ea3bb351735c01210396cfa148d2fc150d225262836aaf4ed98da771a9c2f6bc54da03d402d3f1a384ffffffff0205000000000000001976a914ef6639af5e3f5beb577f327f09ec3b0708cb03f188ac4edd6402000000001976a91460ade08bbf58068ccbed250d4ee64c0a827745d388ac00000000",
          },
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
          "000000005104d2692a021f9b58932c3fa32ea15b97cbff2147e11ad24f9d49af",
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
          { id: "bip65", version: 4, reject: { status: true } },
        ],
        bip9_softforks: {
          csv: {
            status: "active",
            startTime: 1456790400,
            timeout: 1493596800,
            since: 770112,
          },
          segwit: {
            status: "active",
            startTime: 1462060800,
            timeout: 1493596800,
            since: 834624,
          },
        },
        warnings: "Warning: unknown new rules activated (versionbit 28)",
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
          status: "active",
        },
        {
          height: 1580960,
          hash:
            "000000006999656106c726515ccfc34d160a5fa299ddb6bb278598b2feefaa7e",
          branchlen: 1,
          status: "valid-fork",
        },
        {
          height: 1580787,
          hash:
            "0000000029515fe9800761af4c19a087525ad9f3a1e41c4d1b136993711c3f83",
          branchlen: 1,
          status: "valid-fork",
        },
        {
          height: 1414433,
          hash:
            "00000000210004840364b52bc5e455d888f164e4264a4fec06a514b67e9d5722",
          branchlen: 23,
          status: "headers-only",
        },
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
        txrate: 0.1586425185719038,
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
            descendant: 0.00000349,
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
            "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a",
          ],
          "bip125-replaceable": true,
        },
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
            descendant: 0.00000141,
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
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
          ],
          spentby: [],
          "bip125-replaceable": true,
        },
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
          descendant: 0.00000148,
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
          "f594f57099cd6e1c4d0697ad92795196a1774ea752d1bec481019abd3eef30ee",
        ],
        spentby: [],
        "bip125-replaceable": false,
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
        minrelaytxfee: 0.00001,
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
            descendant: 0.00000543,
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
          "bip125-replaceable": true,
        },
        "2275109000640d8e45ec8e23cf74ba8a82850bb5c01993972f1a40dd20fa9484": {
          fees: {
            base: 0.00016797,
            modified: 0.00016797,
            ancestor: 0.00016797,
            descendant: 0.00016797,
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
          "bip125-replaceable": false,
        },
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
          addresses: ["2NFLAeHuBzrMfqQHfCtnKErNJSF3fqysUhF"],
        },
        coinbase: false,
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
        "e50c4bf07ca16e5089bf8c4f4b4d12b4e6b2bb47b09d533ebaa395342c756b95",
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
        total_amount: 20879513.30609612,
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
            height: 1583799,
          },
          {
            txid:
              "ed6f71276d0624989e8d572c98386e35c646cdce062c73ae0a1f554887d41aa5",
            vout: 1,
            scriptPubKey: "76a914bdad1f4d02035b61fb1d237410e85d8402a1187d88ac",
            desc: "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)#7ca3vlzt",
            amount: 0,
            height: 1352790,
          },
          {
            txid:
              "801d5821586dd0dc10123b17d284983d6c835b8aa616e0ee828721c9073ba7ea",
            vout: 1,
            scriptPubKey: "76a914bdad1f4d02035b61fb1d237410e85d8402a1187d88ac",
            desc: "addr(mxosQ4CvQR8ipfWdRktyB3u16tauEdamGc)#7ca3vlzt",
            amount: 0,
            height: 1326382,
          },
        ],
        total_amount: 0.08745533,
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
        "6f0b2595600c49d6f6483c71bbfa348c31d214bfcc340c3b40aed9d7ffa84d8a",
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
          chunks_free: 3,
        },
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
        active_commands: [{ method: "getrpcinfo", duration: 0 }],
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
        leveldb: false,
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
            weight: 884,
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
            weight: 661,
          },
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
          "6a24aa21a9ed78a54605e10113365da2095badf375ae434b5abcda3d864a73c91477bd480676",
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
        warnings: "Warning: unknown new rules activated (versionbit 28)",
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
          addresses: [{ address: "92.53.89.123:18333", connected: "outbound" }],
        },
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
          time_left_in_cycle: 0,
        },
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
            proxy_randomize_credentials: false,
          },
          {
            name: "ipv6",
            limited: false,
            reachable: true,
            proxy: "",
            proxy_randomize_credentials: false,
          },
          {
            name: "onion",
            limited: true,
            reachable: false,
            proxy: "",
            proxy_randomize_credentials: false,
          },
        ],
        relayfee: 0.00001,
        incrementalfee: 0.00001,
        localaddresses: [],
        warnings: "Warning: unknown new rules activated (versionbit 28)",
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
          port: 18333,
        },
        {
          time: 1569557642,
          services: 1037,
          address: "174.138.24.48",
          port: 18333,
        },
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
            version: 126,
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
            version: 126,
          },
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
            version: 126,
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
            version: 126,
          },
        },
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
          ban_reason: "manually added",
        },
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
          port: 18333,
        },
        {
          time: 1569557642,
          services: 1037,
          address: "174.138.24.48",
          port: 18333,
        },
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
          { has_utxo: false, is_final: false, next: "updater" },
        ],
        next: "updater",
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
        "cHNidP8BAHsCAAAAAn+RFbuIDPiBkN5ua0vnUVZwwvbnnDZ8Ca4Z6y3vQyqnAAAAAAD9////KUVYeBVxQc4IZCvsc2WohVhZanD54jy11Gxxn4YRtpYBAAAAAP3///8BYII7AAAAAAAWABSANbyZwTJ0B7qPqpWSolEEKYbIFQEAAAAAAQEfIAMAAAAAAAAWABRCHnul3Lf2vUn4GUU9mrnGLnTHsQABAR/HgTsAAAAAABYAFDNBVvuJV65T//o2rr6AhKSwDPt9AQhrAkcwRAIgWyFL8FdWh0kB8CbKL2GsVPQU2Wgb9E4YvOwJ9KLseMgCIHBdaP/zuYg7Y4cL5B+gjsOUB4PFss6+dnACpn/+U9UjASEDTi3KTyZW9vKWtxYxflo5B7l1PHSqn0GUlf8AsXkGfvQAAA==",
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
        "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69024730440220451546bae0bc61270eec966f1ca0a5cb16a93c5f88a800094240e61fb3f6fdd7022021a0065ec25e06f9e0b3a4d87b06d13adc2bd620dd8f2ecf7a40366ceaa93e998121039a3d49d8d6a2ca7ff2ea6657d3c8c19ba20ab67f529edb522030928b5f4894d20000000000",
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
          vout: 1,
        },
        {
          txid:
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
          vout: 0,
        },
      ];
      const out1: { [address: string]: number } = {
        tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su: 0.00215,
      };
      const out2: { [address: string]: number } = {
        tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs: 0.001,
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
          vout: 1,
        },
        {
          txid:
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
          vout: 0,
        },
      ];
      const out1: { [address: string]: number } = {
        tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su: 0.00215,
      };
      const out2: { [address: string]: number } = {
        tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs: 0.001,
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
              sequence: 4294967293,
            },
            {
              txid:
                "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
              vout: 0,
              scriptSig: { asm: "", hex: "" },
              sequence: 4294967293,
            },
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
                addresses: ["tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su"],
              },
            },
            {
              value: 0.001,
              n: 1,
              scriptPubKey: {
                asm: "0 b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
                hex: "0014b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
                reqSigs: 1,
                type: "witness_v0_keyhash",
                addresses: ["tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs"],
              },
            },
          ],
        },
        unknown: {},
        inputs: [{}, {}],
        outputs: [{}, {}],
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
            sequence: 4294967293,
          },
          {
            txid:
              "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
            vout: 0,
            scriptSig: { asm: "", hex: "" },
            sequence: 4294967293,
          },
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
              addresses: ["tb1qdacfrqauwercrz9jxf0jae5jarqy8ju0ywt8su"],
            },
          },
          {
            value: 0.001,
            n: 1,
            scriptPubKey: {
              asm: "0 b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
              hex: "0014b7137dfed18ffe396fbe0b1678608cebdd45b1eb",
              reqSigs: 1,
              type: "witness_v0_keyhash",
              addresses: ["tb1qkufhmlk33llrjma7pvt8scyva0w5tv0tvuy6zs"],
            },
          },
        ],
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
          "mucT5ReiLujp3bA1mRSud7eAF6aRfS3v3D",
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
            "tb1qe36nkq87qczlnuqm4n2kcutvzngjvah5pmy7gm3duaptrkgh25ts0p4m5w",
          ],
          "p2sh-segwit": "2Mzt4Uc77wz8rGk3Yad2kgJuj47ax5soMCJ",
        },
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
        complete: true,
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
        changepos: 0,
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
                "483045022100d21fffc9343da1b2ec190c7084f8a69d201adcd88b880beb013fa4e0ab4158ad02205e0c362f844cc63539467b37d583128c7d2f7754864d08efe29cef98272688e20121039c17e0e4ebd61c753fda99392658a692dbfdab430399b1e12221da6a4cda5dd9",
            },
            sequence: 4294967295,
          },
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
              addresses: ["2N16oE62ZjAPup985dFBQYAuy5zpDraH7Hk"],
            },
          },
        ],
        hex:
          "01000000018931eb4ccedd42474db1da12d1529724c3b3bf2195ec183e52f457c18adb5022010000006b483045022100d21fffc9343da1b2ec190c7084f8a69d201adcd88b880beb013fa4e0ab4158ad02205e0c362f844cc63539467b37d583128c7d2f7754864d08efe29cef98272688e20121039c17e0e4ebd61c753fda99392658a692dbfdab430399b1e12221da6a4cda5dd9ffffffff01dbf428030000000017a9145629021f7668d4ec310ac5e99701a6d6cf95eb8f8700000000",
        blockhash:
          "00000000480351c0fc7047af37756bbae30996a018e94d9ca8156dccea032018",
        confirmations: 3204,
        time: 1570540739,
        blocktime: 1570540739,
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
        "cHNidP8BAFICAAAAAWs2nFCyIbZPRlxerXXu2guE90c1aA2ur+ibcnP9j3X/AAAAAAD9////AaCGAQAAAAAAFgAUtxN9/tGP/jlvvgsWeGCM691FsesBAAAAAAAA",
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
        "cQeGBYp4NiFj2L2d1ivgan4UMsba3oWQKiBf98tq1QXjPiKQMQeB",
      ];
      const sighashtype: "ALL|ANYONECANPAY" = "ALL|ANYONECANPAY";
      const params = { hexstring, privkeys, sighashtype };
      const request = {
        params,
        method: "signrawtransactionwithkey",
        id,
        jsonrpc,
      };
      const result = {
        hex:
          "020000000001029a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0000000000fdffffff9a2b645e97cfde604d0b65aa174fb4747f8b99152f581d12d42055f3388c123e0100000000fdffffff0180250000000000001600143d366a85a8c07a44b5eed0a622197d6784c07e69024730440220451546bae0bc61270eec966f1ca0a5cb16a93c5f88a800094240e61fb3f6fdd7022021a0065ec25e06f9e0b3a4d87b06d13adc2bd620dd8f2ecf7a40366ceaa93e998121039a3d49d8d6a2ca7ff2ea6657d3c8c19ba20ab67f529edb522030928b5f4894d20247304402201596d19c0eec785d301dad21ecc8bad1d808d4bd15615df1a5a1b9e930404066022038126c82743ccf5bc225b61a38ddd7ae651f12d27a730817de79279df8fd0ab88121028cc283639d0254c3f3091659d66f7681189de1ade326d36eefa50217956b057b00000000",
        complete: true,
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
        "020000000001027f9115bb880cf88190de6e6b4be7515670c2f6e79c367c09ae19eb2def432aa70000000000fdffffff29455878157141ce08642bec7365a88558596a70f9e23cb5d46c719f8611b6960100000000fdffffff0160823b00000000001600148035bc99c1327407ba8faa9592a251042986c81502473044022007a70711f0889028f4cb7fd01d20b1f96bb8a7def745b4394696fe032a4f5de102206b72cbe094466fc4358a2a130b02b539da774c6fa7006a7802feeea6a30c231801210283450124a3ca764e4d321fe9b3a700d5d446ee7343d786a5401c075c79ebdfea0247304402205b214bf05756874901f026ca2f61ac54f414d9681bf44e18bcec09f4a2ec78c80220705d68fff3b9883b63870be41fa08ec3940783c5b2cebe767002a67ffe53d5230121034e2dca4f2656f6f296b716317e5a3907b9753c74aa9f419495ff00b179067ef401000000",
      ];
      const allowhighfees = true;
      const params = { rawtxs, allowhighfees };
      const request = { params, method: "testmempoolaccept", id, jsonrpc };
      const result = [
        {
          txid:
            "d1514757030c26d54e90b242c696f46f539bb55e92fb105505d9ee43e61657a9",
          allowed: true,
        },
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
        "03dbc6764b8884a92e871274b87583e6d5c2a58819473e17e107ef3f6aa5a61626",
      ];
      const address_type: "bech32" = "bech32";
      const params = { nrequired, keys, address_type };
      const request = { params, method: "createmultisig", id, jsonrpc };
      const result = {
        address:
          "tb1q0jnggjwnn22a4ywxc2pcw86c0d6tghqkgk3hlryrxl7nmxkylmnqdcdsu7",
        redeemScript:
          "522103789ed0bb717d88f7d321a368d905e7430207ebbd82bd342cf11ae157a7ace5fd2103dbc6764b8884a92e871274b87583e6d5c2a58819473e17e107ef3f6aa5a6162652ae",
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
        "tb1qsdqewd8upv66txx48qssr0an5r3llaxtwqzytk",
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
        hasprivatekeys: false,
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
        witness_program: "db351aed368d616814515e1ce9e1a5e21eeb923d",
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
      const nrequired = 2;
      const keys = [
        "030b0f444121f91cf323ad599ee8ced39dcbb136905e8ac42f9bdb4756142c716f",
        "02ea2e2847de9386b704cacb5c730c272c4f3e7b14a586ca6122cdacff5dea59e9",
      ];
      const label = "NewMultiSigAddress";
      const address_type: "bech32" = "bech32";
      const params = { nrequired, keys, label, address_type };
      const request = { params, method: "addmultisigaddress", id, jsonrpc };
      const result = {
        address:
          "tb1qylfjvzx7a7wkntajyvek2wur2qnmt3gxqnevhjkw957fw0ggw9nqczpy6l",
        redeemScript:
          "5221030b0f444121f91cf323ad599ee8ced39dcbb136905e8ac42f9bdb4756142c716f2102ea2e2847de9386b704cacb5c730c272c4f3e7b14a586ca6122cdacff5dea59e952ae",
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
        errors: [],
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
      const filename = "myWalletDump.dat";
      const params = { filename };
      const request = { params, method: "dumpwallet", id, jsonrpc };
      const result = {
        filename: "D:\\Wallets\\Bitcoin Core\\myWalletDump.dat",
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
      const label = "SomeLabel";
      const params = { label };
      const request = { params, method: "getaddressesbylabel", id, jsonrpc };
      const result = {
        tb1qxwqd5gance6rk9xel5uwuxxdj79wfwgaxsrnn0: { purpose: "receive" },
        tb1qds5qv262690uvsh6wytp0aq8xey29jfuegv4pj: { purpose: "receive" },
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
        labels: [{ name: "SomeLabel", purpose: "receive" }],
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getaddressinfo(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getbalance()", async () => {
      const minconf = 6;
      const include_watchonly = true;
      const params = { minconf, include_watchonly };
      const request = { params, method: "getbalance", id, jsonrpc };
      const result = 0.0000863;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getbalance(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getnewaddress()", async () => {
      const label = "SomeLabel";
      const address_type: "bech32" = "bech32";
      const params = { label, address_type };
      const request = { params, method: "getnewaddress", id, jsonrpc };
      const result = "tb1q522hdye3p7ftzwsk0y7v3svsnk7rpxpc9zx73q";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getnewaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getrawchangeaddress()", async () => {
      const address_type: "bech32" = "bech32";
      const params = { address_type };
      const request = { params, method: "getrawchangeaddress", id, jsonrpc };
      const result = "tb1qrl0a2zrqjtc3rw6w8ccxp9g3g2lju8vqqsp07n";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getrawchangeaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getreceivedbyaddress()", async () => {
      const address =
        "tb1qg9nfs5ll5h3xl3h8xqhw8wg4sj6j6g6666cstmeg7v2q4ty0ccsqg5du3n";
      const minconf = 6;
      const params = { address, minconf };
      const request = { params, method: "getreceivedbyaddress", id, jsonrpc };
      const result = 0.001;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getreceivedbyaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getreceivedbylabel()", async () => {
      const label = "SomeLabel";
      const minconf = 6;
      const params = { label, minconf };
      const request = { params, method: "getreceivedbylabel", id, jsonrpc };
      const result = 0;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getreceivedbylabel(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".gettransaction()", async () => {
      const txid =
        "2c06449191f86594ceb059363da55e6587963fc8d801fdecf73f9a42d64dfe95";
      const include_watchonly = true;
      const params = { txid, include_watchonly };
      const request = { params, method: "gettransaction", id, jsonrpc };
      const result = {
        amount: 0,
        fee: -0.00000141,
        confirmations: 76,
        blockhash:
          "0000000000000165757641aa760f436f367abc72e40bcaa8e598cc44992db8f9",
        blockindex: 54,
        blocktime: 1572280467,
        txid:
          "2c06449191f86594ceb059363da55e6587963fc8d801fdecf73f9a42d64dfe95",
        walletconflicts: [],
        time: 1572280467,
        timereceived: 1572281743,
        "bip125-replaceable": "no",
        details: [],
        hex:
          "02000000000101a95716e643eed9055510fb925eb59b536ff496c642b2904ed5260c03574751d10000000000feffffff02a086010000000000160014aacf5a9d6c52c5ffe8006182a72486baf2e8bf3333fb390000000000160014e87724699668d3abff7311cb18a62b0c8de1038502473044022026a9618c21c3eab177877c6f8f8890610ad0ac93b8e243c4ea32dadf52728dae02206817f8aaa7fabf728853415bdae7b4e2fc02fc72630cba23952224fad374bcc3012102a00a9973ab15acaac69b591dcebed3fcf44ab76950d962671391fd1c1c3f0015742c1800",
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.gettransaction(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getunconfirmedbalance()", async () => {
      const request = {
        params: {},
        method: "getunconfirmedbalance",
        id,
        jsonrpc,
      };
      const result = 0;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getunconfirmedbalance(wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".getwalletinfo()", async () => {
      const request = { params: {}, method: "getwalletinfo", id, jsonrpc };
      const result = {
        walletname: "bitcoin-core-wallet.dat",
        walletversion: 169900,
        balance: 0.0421393,
        unconfirmed_balance: 0,
        immature_balance: 0,
        txcount: 29,
        keypoololdest: 1570725098,
        keypoolsize: 1000,
        keypoolsize_hd_internal: 999,
        paytxfee: 0,
        hdseedid: "d43760fda85e35a75e0bed11233185630f8d1279",
        private_keys_enabled: true,
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.getwalletinfo(wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".importaddress()", async () => {
      const address = "tb1qk57dcv7rs2ap6k82xu58957qz6zherj4vm54lw";
      const label = "ImportedAddress";
      const rescan = false;
      const p2sh = false;
      const params = { address, label, rescan, p2sh };
      const request = { params, method: "importaddress", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.importaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".importmulti()", async () => {
      const timestamp: "now" = "now";
      const range: [number, number] = [2, 5];
      const requests = [
        {
          desc:
            "wpkh(tpubD6NzVbkrYhZ4Wk5MMULiQd4XkBe3KeG6GCUNrWcXu27PJwqFfHF7geuTPfPZcViUpV7ny6MHVnbvxdCSfkooFb7bBJiQgKXCVM58XZiVyHu/0/*)#9tk43hcd",
          range,
          internal: true,
          watchonly: true,
          timestamp: 0,
        },
        {
          scriptPubKey: {
            address: "tb1q0pjl9cy0t38uvyfs75t7av7ujrhs65xx0nfjmf",
          },
          timestamp,
        },
        {
          scriptPubKey: {
            address: "tb1qxqt28qy3uvj8qeucm60dnrzty3cccx88hp9car",
          },
          keys: ["cQfkAynVm54Je8mXYH6zkKKjug7ehheUeMx5jnWTvy94M73X2Vdj"],
          timestamp,
        },
      ];
      const options = { rescan: false };
      const params = { requests, options };
      const request = { params, method: "importmulti", id, jsonrpc };
      const result = [{ success: true }, { success: true }, { success: true }];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.importmulti(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".importprivkey()", async () => {
      const privkey = "cQnahvawMKvZXLWCdrBvXdvDoTHm4xeQq9iWqLC2JzmicFVd5Mdz";
      const label = "Imported";
      const rescan = false;
      const params = { privkey, label, rescan };
      const request = { params, method: "importprivkey", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.importprivkey(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".importprunedfunds()", async () => {
      const rawtransaction =
        "0200000000010422647b4fc186385b15a01cc6cd6d7864399b4ff536f370f86ecc5e2f4281d7d50000000017160014013b2e1e130cd463f3be9fce311cfbf6f862d224fdffffffc61430e9a56a5ebba761828078c9a5f03571da6fbf40f4f87f7d72cbcbaf6f5e0000000000fdffffffe399e3ebf69237d36ba6f5d7ccb8f2d79923e19733fb4b7fc58f11b789f89653000000006a47304402204ea849bac52e0f76b7df9b196cad692cc8e253778c999d67627f2a9c487067e00220245e9446863037949dac77cb34f532376749507e6d499418fe51144c6e950725012103bb1add1e1e6093caa59f127ff3d477f8ac210f2ca1f8c81ff8c1602d9a5bacd0fdffffffd37c62273bfaeffee551ccaa1e06a6daa1e9d32248798821e33c6623ea17b9910000000000fdffffff022785400000000000160014740535b933895ac1caf3ba92976993f7fd9d2e99a086010000000000160014000243d945554d568a6858f5f243d9510258d75c0247304402207400692ba5ecfeda204468905b138c0f7e6cf2d02be119094864db1c48c21f7c022008ccad54fb2cdc107a96c8a56b3e80867e4cfa8c904e9a78f27f10fc8071fb430121026c9b6d74350725506d14613cabade7f447fb67eb416c8ef34323da77f7299c2302473044022024d43ee736fe458b739f32866c35a6dfe7ca352acd7b76a25472c4a8246a5ead022073db04ee5a894a6eb949ab56046416fd5090f44f65fe3a6ab68b4a5b540bb6b20121028ff8402568eea88e93d30b4b2e6c7125bdb894cbf27c87a2101e35e0b1f5ff2e000247304402205e9b129b0a0c2c0fb458c1f397d462fd4db46cf7fffd19dc9189e421f1f61fac0220424e8cbfa9a01160033cae4955bc44c6f958d3afc7ccc67aef0a23c5f95bf37e012102228f0d709aacaa24fb4712c8fca4b10c9f4cfb60dcaa4d34b58660080a8bd8435e1e1800";
      const txoutproof =
        "000040205853c9a97816b63b9bb539f7b4cfb8c8a36ee0d9b6e1c59df102000000000000ab93331e4cae84da202131b6418e61e30095a81108edb09376ad7d02768d72c348ff9a5d74c4031a712e7b5614000000040cce7e642af08fd68ddcf0b7630ad88c4110c91fcdb7f792f6253bef56181bf201d52b2f5696dd23973b09dd34c2447aadeeb31ada2ff4b1d88d238c8cb2081a0a6331dd8ded7863f79cd3574812d032d5bc7c96df137ddb0d3b794ac2a26f199b66a00a8b8376f3bd0b1c7f9827b403242976d1dc16ed8bc6ec7e11c1f028bf02dd00";
      const params = { rawtransaction, txoutproof };
      const request = { params, method: "importprunedfunds", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.importprunedfunds(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".importpubkey()", async () => {
      const pubkey =
        "023ef8f5fa2a18c07d714d942e4aa933827df7d5fba43a513be22581fc0ce83207";
      const label = "SomeAddress";
      const rescan = false;
      const params = { pubkey, label, rescan };
      const request = { params, method: "importpubkey", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.importpubkey(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".importwallet()", async () => {
      const filename = "myWalletDump.dat";
      const params = { filename };
      const request = { params, method: "importwallet", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.importwallet(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".keypoolrefill()", async () => {
      const newsize = 123;
      const params = { newsize };
      const request = { params, method: "keypoolrefill", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.keypoolrefill(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listaddressgroupings()", async () => {
      const params = {};
      const request = { params, method: "listaddressgroupings", id, jsonrpc };
      const result = [
        [
          ["tb1q8hdflcavy6cqekcz89nyeknn0jgp6jrffchkru", 0],
          ["tb1qd6kfch0myeleugs5egs9dwmn94zc0wjjaxhecw", 0, ""],
        ],
        [["tb1qjnldyxvhr8gxsrlplxy9yt0pyc9y4qup7v7jv5", 0, ""]],
      ];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listaddressgroupings(wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listlabels()", async () => {
      const purpose: "receive" = "receive";
      const params = { purpose };
      const request = { params, method: "listlabels", id, jsonrpc };
      const result = ["", "SomeLabel"];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listlabels(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listlockunspent()", async () => {
      const request = { params: {}, method: "listlockunspent", id, jsonrpc };
      const result = [
        {
          txid:
            "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a",
          vout: 0,
        },
        {
          txid:
            "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
          vout: 1,
        },
      ];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listlockunspent(wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listreceivedbyaddress()", async () => {
      const minconf = 6;
      const include_empty = false;
      const include_watchonly = false;
      const address_filter = "tb1qyferlkpvr7v3r5ne7jh2avjuvnxkf08lqhpqe9";
      const params = {
        minconf,
        include_empty,
        include_watchonly,
        address_filter,
      };
      const request = { params, method: "listreceivedbyaddress", id, jsonrpc };
      const result = [
        {
          address: "tb1qyferlkpvr7v3r5ne7jh2avjuvnxkf08lqhpqe9",
          amount: 0.00001,
          confirmations: 3739,
          label: "",
          txids: [
            "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
          ],
        },
      ];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listreceivedbyaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listreceivedbylabel()", async () => {
      const minconf = 6;
      const include_empty = true;
      const include_watchonly = true;
      const params = { minconf, include_empty, include_watchonly };
      const request = { params, method: "listreceivedbylabel", id, jsonrpc };
      const result = [
        { amount: 0.18296788, confirmations: 73, label: "" },
        {
          involvesWatchonly: true,
          amount: 0.00001234,
          confirmations: 3835,
          label: "MultiSig",
        },
        { amount: 0, confirmations: 0, label: "SomeLabel" },
      ];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listreceivedbylabel(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listsinceblock()", async () => {
      const blockhash =
        "00000000001ad9877c5a839c65371a18e1392a2be83378915e01342a368caaef";
      const target_confirmations = 6;
      const include_watchonly = true;
      const include_removed = false;
      const params = {
        blockhash,
        target_confirmations,
        include_watchonly,
        include_removed,
      };
      const request = { params, method: "listsinceblock", id, jsonrpc };
      const result = {
        transactions: [
          {
            address: "mmHGoznJqAjpokaBNpNYc35o8D3hZhkgkY",
            category: "send",
            amount: -0.0001,
            label: "",
            vout: 1,
            fee: -0.00000839,
            confirmations: 80,
            blockhash:
              "0000000000006b542e808cfbbb3bcfb32ae1ca2e44c79bbca2a5e68bcae1fbfd",
            blockindex: 64,
            blocktime: 1572357316,
            txid:
              "e540d4c27e148c193979dc5bb7e86110f818311a51223e6ba5f5d9e8daaf5e3d",
            walletconflicts: [
              "92dee32122b5f270c2c28eb4bdccd767f897b613ee51157bfcc4b53c5106acf1",
            ],
            time: 1572356102,
            timereceived: 1572356102,
            "bip125-replaceable": "no",
            replaces_txid:
              "92dee32122b5f270c2c28eb4bdccd767f897b613ee51157bfcc4b53c5106acf1",
            abandoned: false,
          },
          {
            address: "tb1qjnldyxvhr8gxsrlplxy9yt0pyc9y4qup7v7jv5",
            category: "send",
            amount: -0.00001,
            label: "",
            vout: 0,
            fee: -0.00000141,
            confirmations: 76,
            blockhash:
              "000000000021e0f4b5e16a972fc29cc75b046c18af7c90491056810e55e5dd25",
            blockindex: 215,
            blocktime: 1572361706,
            txid:
              "237859c44d45b8d6631883064542d697958cc17a023459967bd1308b81246b45",
            walletconflicts: [],
            time: 1572360790,
            timereceived: 1572360790,
            "bip125-replaceable": "no",
            abandoned: false,
          },
          {
            address: "tb1qjnldyxvhr8gxsrlplxy9yt0pyc9y4qup7v7jv5",
            category: "receive",
            amount: 0.00001,
            label: "",
            vout: 0,
            confirmations: 76,
            blockhash:
              "000000000021e0f4b5e16a972fc29cc75b046c18af7c90491056810e55e5dd25",
            blockindex: 215,
            blocktime: 1572361706,
            txid:
              "237859c44d45b8d6631883064542d697958cc17a023459967bd1308b81246b45",
            walletconflicts: [],
            time: 1572360790,
            timereceived: 1572360790,
            "bip125-replaceable": "no",
          },
          {
            address: "tb1qtektjrzjl28dhh8hgftv4f66ukh566sm62vg27",
            category: "send",
            amount: -0.0009989,
            label: "",
            vout: 0,
            fee: -0.0000011,
            confirmations: 81,
            blockhash:
              "00000000000000559e344c0cacef0caf7b2a93d0bc0546285dcacd86d6d13e89",
            blockindex: 45,
            blocktime: 1572356089,
            txid:
              "2be2abd68218bbd0595f7a88fe11dc84d57942a5d888bd6223f95cf992adde75",
            walletconflicts: [],
            time: 1572355952,
            timereceived: 1572355952,
            "bip125-replaceable": "no",
            abandoned: false,
          },
          {
            address: "mmHGoznJqAjpokaBNpNYc35o8D3hZhkgkY",
            category: "send",
            amount: -0.0001,
            label: "",
            vout: 1,
            fee: -0.00000144,
            confirmations: -80,
            trusted: false,
            txid:
              "92dee32122b5f270c2c28eb4bdccd767f897b613ee51157bfcc4b53c5106acf1",
            walletconflicts: [
              "e540d4c27e148c193979dc5bb7e86110f818311a51223e6ba5f5d9e8daaf5e3d",
            ],
            time: 1572356081,
            timereceived: 1572356081,
            "bip125-replaceable": "yes",
            replaced_by_txid:
              "e540d4c27e148c193979dc5bb7e86110f818311a51223e6ba5f5d9e8daaf5e3d",
            abandoned: false,
          },
        ],
        lastblock:
          "0000000000000063d9b6e5d9ca6692dec30afab32615b0717ac88f39bc199339",
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listsinceblock(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listtransactions()", async () => {
      const label = "SomeLabel";
      const count = 2;
      const skip = 4;
      const include_watchonly = true;
      const params = { label, count, skip, include_watchonly };
      const request = { params, method: "listtransactions", id, jsonrpc };
      const result = [
        {
          address: "tb1qsq6mexwpxf6q0w50422e9gj3qs5cdjq4x6eusz",
          category: "send",
          amount: -0.039,
          label: "SomeLabel",
          vout: 0,
          fee: -0.00000647,
          confirmations: 408,
          blockhash:
            "0000000000102f5b67e1b946d40354ddd93060db3220b5fda7e4aad013738e6b",
          blockindex: 137,
          blocktime: 1572031381,
          txid:
            "d1514757030c26d54e90b242c696f46f539bb55e92fb105505d9ee43e61657a9",
          walletconflicts: [],
          time: 1572030277,
          timereceived: 1572030277,
          "bip125-replaceable": "no",
          abandoned: false,
        },
        {
          address: "tb1qtektjrzjl28dhh8hgftv4f66ukh566sm62vg27",
          category: "send",
          amount: -0.0009989,
          label: "SomeLabel",
          vout: 0,
          fee: -0.0000011,
          confirmations: 81,
          blockhash:
            "00000000000000559e344c0cacef0caf7b2a93d0bc0546285dcacd86d6d13e89",
          blockindex: 45,
          blocktime: 1572356089,
          txid:
            "2be2abd68218bbd0595f7a88fe11dc84d57942a5d888bd6223f95cf992adde75",
          walletconflicts: [],
          time: 1572355952,
          timereceived: 1572355952,
          "bip125-replaceable": "no",
          abandoned: false,
        },
      ];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listtransactions(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listunspent()", async () => {
      const minconf = 1;
      const maxconf = 4000;
      const addresses = [
        "tb1qg9nfs5ll5h3xl3h8xqhw8wg4sj6j6g6666cstmeg7v2q4ty0ccsqg5du3n",
        "tb1q8vd7hh77afe2aans7vywyt8txvz84r3pwkmny4",
      ];
      const include_unsafe = false;
      const query_options = {
        minimumAmount: 0.0001,
        maximumAmount: 0.01,
        maximumCount: 3,
        minimumSumAmount: 10,
      };
      const params = {
        minconf,
        maxconf,
        addresses,
        include_unsafe,
        query_options,
      };
      const request = { params, method: "listunspent", id, jsonrpc };
      const result = [
        {
          txid:
            "96b611869f716cd4b53ce2f9706a595885a86573ec2b6408ce41711578584529",
          vout: 0,
          address:
            "tb1qg9nfs5ll5h3xl3h8xqhw8wg4sj6j6g6666cstmeg7v2q4ty0ccsqg5du3n",
          label: "",
          witnessScript:
            "5221026544d2de6d868276cdfb8d2cdd020119162440fe98eac1add12fa354e7fef83821024a8638218164e64ac6ef560ebc18356a8773697aaeea37bc2c5707cca598b8c752ae",
          scriptPubKey:
            "002041669853ffa5e26fc6e7302ee3b91584b52d235ad6b105ef28f3140aac8fc620",
          amount: 0.001,
          confirmations: 422,
          spendable: true,
          solvable: true,
          desc:
            "wsh(multi(2,[2f8f8c1b/0'/0'/11']026544d2de6d868276cdfb8d2cdd020119162440fe98eac1add12fa354e7fef838,[2f8f8c1b/0'/0'/10']024a8638218164e64ac6ef560ebc18356a8773697aaeea37bc2c5707cca598b8c7))#v4j2pdsn",
          safe: true,
        },
        {
          txid:
            "ff758ffd73729be8afae0d683547f7840bdaee75ad5e5c464fb621b2509c366b",
          vout: 0,
          address: "tb1q8vd7hh77afe2aans7vywyt8txvz84r3pwkmny4",
          scriptPubKey: "00143b1bebdfdeea72aef670f308e22ceb33047a8e21",
          amount: 0.00314192,
          confirmations: 615,
          spendable: true,
          solvable: true,
          desc:
            "wpkh([2f8f8c1b/0'/1'/0']023efde40c10ded46eeb2ccbe4ece98ccffc9921e6e2cbb82f21965b5563dc59a3)#vc3pfv5a",
          safe: true,
        },
      ];
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listunspent(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".listwalletdir()", async () => {
      const request = { params: {}, method: "listwalletdir", id, jsonrpc };
      const result = {
        wallets: [{ name: "bitcoin-core-wallet.dat" }, { name: "" }],
      };
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listwalletdir();
      assert.deepStrictEqual(data, result);
    });

    test(".listwallets()", async () => {
      const request = { params: {}, method: "listwallets", id, jsonrpc };
      const result = ["", "wallet123.dat"];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.listwallets();
      assert.deepStrictEqual(data, result);
    });

    test(".loadwallet()", async () => {
      const filename = "bitcoin-core-wallet.dat";
      const params = { filename };
      const request = { params, method: "loadwallet", id, jsonrpc };
      const result = ["", "wallet123.dat"];
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.loadwallet(params);
      assert.deepStrictEqual(data, result);
    });

    test(".lockunspent()", async () => {
      const unlock = false;
      const transactions = [
        {
          txid:
            "7b6ce289d50b81f31f2d14a88837ff588d1889c8cb21acda57c2cd18611452d5",
          vout: 1,
        },
        {
          txid:
            "3e128c38f35520d4121d582f15998b7f74b44f17aa650b4d60decf975e642b9a",
          vout: 0,
        },
      ];
      const params = { unlock, transactions };
      const request = { params, method: "lockunspent", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.lockunspent(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".removeprunedfunds()", async () => {
      const txid =
        "196fa2c24a793b0ddb7d13df967cbcd532d0124857d39cf76378ed8ddd31630a";
      const params = { txid };
      const request = { params, method: "removeprunedfunds", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.removeprunedfunds(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".rescanblockchain()", async () => {
      const start_height = 1566870;
      const stop_height = 1566970;
      const params = { start_height, stop_height };
      const request = { params, method: "rescanblockchain", id, jsonrpc };
      const result = { start_height: 1566870, stop_height: 1566970 };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.rescanblockchain(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".sendmany()", async () => {
      const amounts = {
        tb1qh4v0nuuglwfvzjhhjwn2mm8xa5n9mmg6azq237: 0.00002,
        tb1qm0m54hj4hmgw4ncufh7g6gx8lp7294rgjr8vz3: "0.00003",
      };
      const minconf = 6;
      const comment = "SomeComment";
      const subtractfeefrom = ["tb1qh4v0nuuglwfvzjhhjwn2mm8xa5n9mmg6azq237"];
      const replaceable = true;
      const conf_target = 20;
      const estimate_mode: "ECONOMICAL" = "ECONOMICAL";
      const params = {
        amounts,
        minconf,
        comment,
        subtractfeefrom,
        replaceable,
        conf_target,
        estimate_mode,
      };
      const request = { params, method: "sendmany", id, jsonrpc };
      const result =
        "42f917140aae060fb88acac3dc63dcee5a72b0f367ba155c56b790c1fea20b59";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.sendmany(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".sendtoaddress()", async () => {
      const address = "tb1qzvfvg6hfyf9kuzhmr2prtrnmxeqrt2pgapv89f";
      const amount = 0.0001;
      const comment = "SomePayment";
      const comment_to = "Someone";
      const subtractfeefromamount = true;
      const replaceable = true;
      const conf_target = 20;
      const estimate_mode: "CONSERVATIVE" = "CONSERVATIVE";
      const params = {
        address,
        amount,
        comment,
        comment_to,
        subtractfeefromamount,
        replaceable,
        conf_target,
        estimate_mode,
      };
      const request = { params, method: "sendtoaddress", id, jsonrpc };
      const result =
        "aded742165201973dce8b13216669f4241851c26a566ae2deb1b5262570b94ba";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.sendtoaddress(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".sethdseed()", async () => {
      const newkeypool = true;
      const seed = "cUFvQRAsGvyTVBPX5vowrghWmYXTvNw7nQvkKPtiACsdzRKWZM2P";
      const params = { newkeypool, seed };
      const request = { params, method: "sethdseed", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.sethdseed(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".setlabel()", async () => {
      const address = "tb1qfnavaywj2k45893p4p4lacqxylmuzmp6tnq42u";
      const label = "SomeLabel";
      const params = { address, label };
      const request = { params, method: "setlabel", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.setlabel(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".settxfee()", async () => {
      const amount = 0.000011;
      const params = { amount };
      const request = { params, method: "settxfee", id, jsonrpc };
      const result = true;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.settxfee(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".signmessage()", async () => {
      const address = "muQN4LGGwtD9bqPeCexKGpksvygnRAnTA3";
      const message = "Hello World!";
      const params = { address, message };
      const request = { params, method: "signmessage", id, jsonrpc };
      const result =
        "IMUNA/b71CYq7CLeLcGoKkPFMXFRpowXRlkCZ52TAEWwQPSSCC9HmqMcGnkjmavzKy1lqSAmGlKQI/tzcM3Xadc=";
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.signmessage(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".signrawtransactionwithwallet()", async () => {
      const hexstring =
        "02000000011e6de9ecf189d7101655489338d8b6437366a2694f3536080507143b06073c7a0000000000fdffffff0118a66900000000001600141b5eaac3aca51241ffa5a10cfd85b38c0035e7b100000000";
      const prevtxs = [
        {
          txid:
            "7a3c07063b1407050836354f69a2667343b6d8389348551610d789f1ece96d1e",
          vout: 0,
          scriptPubKey: "0014c92776d7c9e5c7d74f9c8093335de1928862e8ac",
          amount: 0.06924013,
        },
      ];
      const sighashtype: "ALL|ANYONECANPAY" = "ALL|ANYONECANPAY";
      const params = { hexstring, prevtxs, sighashtype };
      const request = {
        params,
        method: "signrawtransactionwithwallet",
        id,
        jsonrpc,
      };
      const result = {
        hex:
          "020000000001011e6de9ecf189d7101655489338d8b6437366a2694f3536080507143b06073c7a0000000000fdffffff0118a66900000000001600141b5eaac3aca51241ffa5a10cfd85b38c0035e7b102473044022035b072acf1e166e9d20999adbd40fd4fe6d76947cc395b1450e96a5e5c3d677602203622d8827e5c4396bbdd390fd29d7a93992273e5028a4c8a76329af45496848d812103bcde895db85d99e39b1eb4689671798c689435b6e131891aad026aed31f4a8f700000000",
        complete: true,
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.signrawtransactionwithwallet(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".unloadwallet()", async () => {
      const request = { params: {}, method: "unloadwallet", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.unloadwallet();
      assert.deepStrictEqual(data, result);
    });

    test(".unloadwallet() (multi wallet)", async () => {
      const wallet_name = "newWallet.dat";
      const params = { wallet_name };
      const request = { params, method: "unloadwallet", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/", request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.unloadwallet(params);
      assert.deepStrictEqual(data, result);
    });

    test(".unloadwallet() (default wallet)", async () => {
      const client = new RPCClient({ port, timeout, pass, wallet });
      const request = { params: {}, method: "unloadwallet", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.unloadwallet();
      assert.deepStrictEqual(data, result);
    });

    test(".walletcreatefundedpsbt()", async () => {
      const inputs = [
        {
          txid:
            "5396f889b7118fc57f4bfb3397e12399d7f2b8ccd7f5a66bd33792f6ebe399e3",
          vout: 0,
        },
      ];
      const outputs = [
        {
          tb1qu7jphg0km5mrl7kx8txy3xuky9tlpvmxmehz8m: 0.001466,
        },
      ];
      const locktime = 1;
      const estimate_mode: "ECONOMICAL" = "ECONOMICAL";
      const options = {
        changeAddress: "tb1qc0vz2vryuadyvcux09pswnl7ng2r9fzzd3cwnf",
        changePosition: 1,
        includeWatching: false,
        lockUnspents: false,
        subtractFeeFromOutputs: [],
        replaceable: true,
        conf_target: 20,
        estimate_mode,
      };
      const bip32derivs = true;
      const params = {
        inputs,
        outputs,
        locktime,
        options,
        bip32derivs,
      };
      const request = { params, method: "walletcreatefundedpsbt", id, jsonrpc };
      const result = {
        psbt:
          "cHNidP8BAFICAAAAAeOZ4+v2kjfTa6b118y48teZI+GXM/tLf8WPEbeJ+JZTAAAAAAD9////Aag8AgAAAAAAFgAU56QbofbdNj/6xjrMSJuWIVfws2YBAAAAAAEA4QEAAAAB7KfSdMCo0aVk+cIkbmlgddOFp+1riB5jCVwBZ0Cgaq4BAAAAakcwRAIgAeAUrBBpoUPgr8A4ysywkv0B8WdgsxfNhAvFpbw/Ki0CIE8GFYALdKLWw2jdwVfLiMFFsy024Toj7Po0/ds/35XCASEDr3vX6YlRh/pfO+KjhQRMg9cfwiFHITID8mKFdFu1gBv/////Asw9AgAAAAAAGXapFIujKvHonUGL+2VSyu2XWvBQ7l63iKxfx5AAAAAAABl2qRQYJu+2OZ47eXi0rxco8eAHp2y2PoisAAAAACIGA7sa3R4eYJPKpZ8Sf/PUd/isIQ8sofjIH/jBYC2aW6zQEPnXKHwAAACAAAAAgAIAAIAAIgIC6aO2I6xv+jeXEqj2kFvHlIt21Rso0GDglJsE2UOs36wQJaaBjQAAAIAAAACABQAAgAA=",
        fee: 0.00000292,
        changepos: -1,
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.walletcreatefundedpsbt(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".walletlock()", async () => {
      const request = { params: {}, method: "walletlock", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.walletlock(wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".walletpassphrase()", async () => {
      const passphrase = "VerySecretPassphraseDoNotTellAnyone";
      const timeout = 600;
      const params = { passphrase, timeout };
      const request = { params, method: "walletpassphrase", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.walletpassphrase(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".walletpassphrasechange()", async () => {
      const oldpassphrase = "SecretPassphraseDoNotTellAnyone";
      const newpassphrase = "VerySecretPassphraseDoNotTellAnyone";
      const params = { oldpassphrase, newpassphrase };
      const request = { params, method: "walletpassphrasechange", id, jsonrpc };
      const result = null;
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.walletpassphrasechange(params, wallet);
      assert.deepStrictEqual(data, result);
    });

    test(".walletprocesspsbt()", async () => {
      const psbt =
        "cHNidP8BAFICAAAAAesycXqP/ZnHQ42fCokY4ws3HyKokiDXfsosfWt2t83wAAAAAAD9////ASBFQAAAAAAAFgAUYN55MzrCRphAffpgyBh5daiXrAcBAAAAAAAA";
      const sign = true;
      const sighashtype: "ALL|ANYONECANPAY" = "ALL|ANYONECANPAY";
      const bip32derivs = true;
      const params = { psbt, sign, sighashtype, bip32derivs };
      const request = { params, method: "walletprocesspsbt", id, jsonrpc };
      const result = {
        psbt:
          "cHNidP8BAFICAAAAAesycXqP/ZnHQ42fCokY4ws3HyKokiDXfsosfWt2t83wAAAAAAD9////ASBFQAAAAAAAFgAUYN55MzrCRphAffpgyBh5daiXrAcBAAAAAAEBH1NHQAAAAAAAFgAUpOVc1oxzfkX57QvwzkDs8f75ppsBCGsCRzBEAiBCMoeFpGtSbsUWbGubHEmIvyDmKr9KHTB1nbuI9HgIsgIgLj4HuddO7hZ9F7FiqzGo+vLXkY0G2+3VGwgO5qp+LMCBIQKeXII7c4+9Decuri9xUBRtIRde/fOL2WLc6UnN9/qomwAiAgM4FaCpxCh+XmYDxo7+zZXN1BaI1l+HBJzFUnQBUFWfWhCl/jeMAAAAgAAAAIACAACAAA==",
        complete: true,
      };
      nock(uri)
        .post("/wallet/" + wallet, request)
        .times(1)
        .basicAuth(auth)
        .reply(200, { result, error, id });
      const data = await client.walletprocesspsbt(params, wallet);
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
          hwm: 1000,
        },
        { type: "pubhashtx", address: "tcp://127.0.0.1:3333", hwm: 1000 },
        {
          type: "pubrawblock",
          address: "tcp://127.0.0.1:3333",
          hwm: 1000,
        },
        { type: "pubrawtx", address: "tcp://127.0.0.1:3333", hwm: 1000 },
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
