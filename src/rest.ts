import { RPC, RPCOptions } from "rpc-request";

export type formatParam = { format?: "json" | "hex" | "bin" };

export type BlockParams = formatParam & { hash: string };

export type BlockHeightParams = formatParam & { height: number };

export type Outpoint = { txid: string; n: number };

export type UtxosParams = formatParam & {
  checkmempool?: boolean;
  outpoints: Outpoint[] | Outpoint;
};

export type HeaderParams = BlockParams & { count?: number };

export type TxParams = formatParam & { txid: string };

export type RESTIniOptions = RPCOptions & { url?: string };

export class RESTClient extends RPC {
  /**
   * @param {object} [params]
   * @param {string} [params.url='http://localhost']
   * @param {number} [params.port=8332]
   * @param {number} [params.timeout=30000]
   * @param {...*} [params.options]
   */
  constructor({
    url = "http://localhost",
    port = 8332,
    timeout = 30000,
    ...options
  }: RESTIniOptions = {}) {
    super({ ...options, baseUrl: `${url}:${port}`, timeout, json: true });
  }

  /**
   * @description Get a block with a particular header hash
   * @param {object} [params]
   * @param {string} params.hash - The hash of the header of the block to get
   * @param {string} [params.format='json'] - Set to 'json' for decoded block contents in JSON, or 'bin' or 'hex' for a serialized block in binary or hex
   */
  getBlock({ hash, format = "json" }: BlockParams) {
    return this.get({ uri: `/rest/block/${hash}.${format}` });
  }

  /**
   * @description Get a block with a particular header hash (includes TXIDs for transactions within the block rather than the complete transactions)
   * @param {object} [params]
   * @param {string} params.hash - The hash of the header of the block to get
   * @param {string} [params.format='json'] - Set to 'json' for decoded block contents in JSON, or 'bin' or 'hex' for a serialized block in binary or hex
   */
  getBlockNoTxDetails({ hash, format = "json" }: BlockParams) {
    return this.get({ uri: `/rest/block/notxdetails/${hash}.${format}` });
  }

  /**
   * @description Get the hash of the block in the current best blockchain based on its height.
   * @param {object} [params]
   * @param {number} params.height - The height of the block
   * @param {string} [params.format='json'] - Set to `json`, `bin` or `hex`.
   */
  getBlockHashByHeight({ height, format = "json" }: BlockHeightParams) {
    return this.get({ uri: `/rest/blockhashbyheight/${height}.${format}` });
  }

  /**
   * @description Get information about the current state of the block chain.
   */
  getChainInfo() {
    return this.get({ uri: "rest/chaininfo.json" });
  }

  /**
   * @description Get an UTXO set given a set of outpoints.
   * @param {object} [params]
   * @param {boolean} [params.checkmempool=true] - Set to `true` to include transactions that are currently in the memory pool to the calculation
   * @param {Object|Object[]} params.outpoints - The list of outpoints to be queried.
   * @param {string} [params.format='json'] - Set to `json`, `bin` or `hex`.
   */
  getUtxos({ checkmempool = true, outpoints, format = "json" }: UtxosParams) {
    let uri = `rest/getutxos${checkmempool ? "/checkmempool" : ""}`;
    outpoints = !Array.isArray(outpoints) ? [outpoints] : outpoints;
    for (const { txid, n } of outpoints) {
      uri += `/${txid}-${n}`;
    }
    return this.get({ uri: uri + "." + format });
  }

  /**
   * @description Get a specified amount of block headers in upward direction.
   * @param {object} [params]
   * @param {number} [params.count=1] - The amount of block headers in upward direction to return
   * @param {string} params.hash - The hash of the header of the block to get
   * @param {string} [params.format='json'] - Set to `json`, `bin` or `hex`.
   */
  getHeaders({ count, hash, format = "json" }: HeaderParams) {
    return this.get({ uri: `rest/headers/${count}/${hash}.${format}` });
  }

  /**
   * @description Get all transaction in the memory pool with detailed information.
   */
  getMemPoolContents() {
    return this.get({ uri: "rest/mempool/contents.json" });
  }

  /**
   * @description Get information about the node’s current transaction memory pool.
   */
  getMemPoolInfo() {
    return this.get({ uri: "rest/mempool/info.json" });
  }

  /**
   * @description Gets a hex-encoded serialized transaction or a JSON object describing the transaction.
   * @param {object} [params]
   * @param {string} params.txid - The TXID of the transaction to get.
   * @param {string} [params.format='json'] - Set to `json`, `bin` or `hex`.
   */
  getTx({ txid, format = "json" }: TxParams) {
    return this.get({ uri: `rest/tx/${txid}.${format}` });
  }
}
