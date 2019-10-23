import { RPCClient } from "../.";
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
});
