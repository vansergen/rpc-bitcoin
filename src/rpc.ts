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

export type Verbosity = { verbosity: 0 | 1 | 2 };

export type Height = { height: number };

export type Blockhash = { blockhash: string };

export type GetBlockParams = Verbosity & Blockhash;

export type GetBlockHeaderParams = Blockhash & { verbose: boolean };

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
}
