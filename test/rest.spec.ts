import * as nock from "nock";
import { RESTClient } from "../.";
import * as assert from "assert";

const port = 18332;
const timeout = 20000;
const client = new RESTClient({ port, timeout });

suite("RESTClient", () => {
  suiteSetup(() => {
    nock.cleanAll();
    nock.load("./test/mocks/rest.json");
  });

  test(".constructor()", () => {
    const url = "http://www.example.com";
    const port = 15978;
    const timeout = 32154;
    const baseUrl = url + ":" + port;
    const json = true;
    const client = new RESTClient({ url, port, timeout });
    assert.deepStrictEqual(client._rpoptions, { baseUrl, timeout, json });
  });

  test(".getBlock()", async () => {
    const hash =
      "00000000099de420b319c7804c4bfee5357d3f5ddbfd3c71c15b3625347792bf";
    const format = "hex";
    await client.getBlock({ hash, format });
  });

  test(".getBlockNoTxDetails()", async () => {
    const hash =
      "00000000099de420b319c7804c4bfee5357d3f5ddbfd3c71c15b3625347792bf";
    const format = "hex";
    await client.getBlockNoTxDetails({ hash, format });
  });

  test(".getBlockHashByHeight()", async () => {
    const height = 1;
    const format = "hex";
    await client.getBlockHashByHeight({ height, format });
  });

  test(".getChainInfo()", async () => {
    await client.getChainInfo();
  });

  test(".getUtxos()", async () => {
    const checkmempool = true;
    const outpoints = [
      {
        txid:
          "e346be6c1ef4d24f3a26ea8e1b45a2645d339fbee9da8b9dc03aeef1c4179716",
        n: 0,
      },
      {
        txid:
          "e346be6c1ef4d24f3a26ea8e1b45a2645d339fbee9da8b9dc03aeef1c4179716",
        n: 1,
      },
    ];
    const format = "hex";
    await client.getUtxos({ checkmempool, outpoints, format });
  });

  test(".getHeaders()", async () => {
    const count = 5;
    const hash =
      "00000000000001f0be142e57e99d3528212e1204157209c6c10bd11326cc5b35";
    const format = "hex";
    await client.getHeaders({ count, hash, format });
  });

  test(".getMemPoolContents()", async () => {
    await client.getMemPoolContents();
  });

  test(".getMemPoolInfo()", async () => {
    await client.getMemPoolInfo();
  });

  test(".getTx()", async () => {
    const txid =
      "93520a51cc6c694e79913f1daf0288cb10e0d7946723c06b4e7b6c2e5b057933";
    const format = "hex";
    await client.getTx({ txid, format });
  });
});
