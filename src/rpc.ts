import { RESTClient, RESTIniOptions } from "./rest";

export type RPCIniOptions = RESTIniOptions & {
  user?: string;
  pass: string;
  wallet?: string;
  fullResponse?: boolean;
};

export type JSONRPC = {
  jsonrpc?: string | number;
  id?: string | number;
  method: string;
  params?: any;
};

export type Verbosity = { verbosity?: 0 | 1 | 2 };

export type Verbose = { verbose?: boolean };

export type Height = { height: number };

export type Blockhash = { blockhash: string };

export type TxId = { txid: string };

export type GetBlockParams = Verbosity & Blockhash;

export type GetBlockHeaderParams = Blockhash & Verbose;

export type GetBlockStatsParams = {
  hash_or_height: string | number;
  stats?: string[];
};

export type GetChainTxStatsParams = {
  nblocks?: number;
  blockhash?: string;
};

export type GetMemPoolParams = TxId & Verbose;

export type GetTxOutParams = TxId & {
  n: number;
  include_mempool?: boolean;
};

export type GetTxOutProofParams = { txids: string[]; blockhash?: string };

export class RPCClient extends RESTClient {
  wallet?: string;
  fullResponse?: boolean;

  constructor({
    user = "",
    pass,
    wallet,
    fullResponse,
    ...options
  }: RPCIniOptions) {
    super({ ...options, auth: { user, pass }, uri: "/" });
    this.fullResponse = fullResponse ? true : false;
    if (wallet) {
      this.wallet = wallet;
    }
  }

  async batch(body: JSONRPC | JSONRPC[], uri = "/") {
    return super.post({ body, uri });
  }

  async rpc(method: string, params = {}, wallet?: string) {
    const uri = !wallet ? "/" : "wallet/" + wallet;
    const body = { method, params, jsonrpc: 1.0, id: "rpc-bitcoin" };
    const response = await this.batch(body, uri);
    return this.fullResponse ? response : response.result;
  }

  /**
   * @description Returns the hash of the best (tip) block in the longest blockchain.
   */
  async getbestblockhash() {
    return this.rpc("getbestblockhash");
  }

  /**
   * @description If verbosity is 0, returns a string that is serialized, hex-encoded data for block 'hash'. If verbosity is 1, returns an Object with information about block <hash>. If verbosity is 2, returns an Object with information about block <hash> and information about each transaction.
   */
  async getblock({ blockhash, verbosity = 1 }: GetBlockParams) {
    return this.rpc("getblock", { blockhash, verbosity });
  }

  /**
   * @description Returns an object containing various state info regarding blockchain processing.
   */
  async getblockchaininfo() {
    return this.rpc("getblockchaininfo");
  }

  /**
   * @description Returns the number of blocks in the longest blockchain.
   */
  async getblockcount() {
    return this.rpc("getblockcount");
  }

  /**
   * @description Returns hash of block in best-block-chain at height provided.
   */
  async getblockhash({ height }: Height) {
    return this.rpc("getblockhash", { height });
  }

  /**
   * @description If verbose is `false`, returns a string that is serialized, hex-encoded data for blockheader 'hash'. If verbose is `true`, returns an Object with information about blockheader <hash>.
   */
  async getblockheader({ blockhash, verbose = true }: GetBlockHeaderParams) {
    return this.rpc("getblockheader", { blockhash, verbose });
  }

  /**
   * @description Compute per block statistics for a given window.
   */
  async getblockstats({ hash_or_height, stats = [] }: GetBlockStatsParams) {
    return this.rpc("getblockstats", { hash_or_height, stats });
  }

  /**
   * @description Return information about all known tips in the block tree, including the main chain as well as orphaned branches.
   */
  async getchaintips() {
    return this.rpc("getchaintips");
  }

  /**
   * @description Compute statistics about the total number and rate of transactions in the chain.
   */
  async getchaintxstats({ nblocks, blockhash }: GetChainTxStatsParams) {
    return this.rpc("getchaintxstats", { nblocks, blockhash });
  }

  /**
   * @description Returns the proof-of-work difficulty as a multiple of the minimum difficulty.
   */
  async getdifficulty() {
    return this.rpc("getdifficulty");
  }

  /**
   * @description If txid is in the mempool, returns all in-mempool ancestors.
   */
  async getmempoolancestors({ txid, verbose = false }: GetMemPoolParams) {
    return this.rpc("getmempoolancestors", { txid, verbose });
  }

  /**
   * @description If txid is in the mempool, returns all in-mempool descendants.
   */
  async getmempooldescendants({ txid, verbose = false }: GetMemPoolParams) {
    return this.rpc("getmempooldescendants", { txid, verbose });
  }

  /**
   * @description Returns mempool data for given transaction
   */
  async getmempoolentry({ txid }: TxId) {
    return this.rpc("getmempoolentry", { txid });
  }

  /**
   * @description Returns details on the active state of the TX memory pool.
   */
  async getmempoolinfo() {
    return this.rpc("getmempoolinfo");
  }

  /**
   * @description Returns all transaction ids in memory pool as a json array of string transaction ids.
   */
  async getrawmempool({ verbose = false }: Verbose = {}) {
    return this.rpc("getrawmempool", { verbose });
  }

  /**
   * @description Returns details about an unspent transaction output.
   */
  async gettxout({ txid, n, include_mempool = true }: GetTxOutParams) {
    return this.rpc("gettxout", { txid, n, include_mempool });
  }

  /**
   * @description Returns a hex-encoded proof that "txid" was included in a block.
   */
  async gettxoutproof({ txids, blockhash }: GetTxOutProofParams) {
    return this.rpc("gettxoutproof", { txids, blockhash });
  }

  /**
   * @description Returns statistics about the unspent transaction output set.
   */
  async gettxoutsetinfo() {
    return this.rpc("gettxoutsetinfo");
  }

  /**
   * @description Treats a block as if it were received before others with the same work.
   */
  async preciousblock({ blockhash }: Blockhash) {
    return this.rpc("preciousblock", { blockhash });
  }

  /**
   * @description Prune the blockchain.
   */
  async pruneblockchain({ height }: Height) {
    return this.rpc("pruneblockchain", { height });
  }

  /**
   * @description Dumps the mempool to disk. It will fail until the previous dump is fully loaded.
   */
  async savemempool() {
    return this.rpc("savemempool");
  }
}
