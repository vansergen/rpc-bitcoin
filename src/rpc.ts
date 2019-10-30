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
  params?: object;
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

export type Descriptor =
  | string
  | {
      desc: string;
      range: number | [number, number];
    };

export type ScanTxOutSetParams = {
  action: "start" | "abort" | "status";
  scanobjects: Descriptor[];
};

export type HelpParams = {
  command?: string;
};

export type LoggingParams = {
  include?: string[] | "all" | "none" | 0 | 1;
  exclude?: string[] | "all" | "none" | 0 | 1;
};

export type GenerateParams = {
  nblocks: number;
  maxtries?: number;
};

export type GenerateToAddressParams = GenerateParams & {
  address: string;
};

export type GetBlockTemplateParams = {
  template_request: {
    mode?: "template" | "proposal";
    capabilities?: string[];
    rules: string[];
  };
};

export type PrioritiseTransactionParams = TxId & {
  fee_delta: number;
};

export type HexData = {
  hexdata: string;
};

export type AddNodeParams = {
  node: string;
  command: "add" | "remove" | "onetry";
};

export type DisconnectNodeParams = { address: string } | { nodeid: number };

export type SetBanParams = {
  subnet: string;
  command: "add" | "remove";
  bantime?: number;
  absolute?: boolean;
};

export type AddressType = "legacy" | "p2sh-segwit" | "bech32";

export type CreateMultiSigParams = {
  nrequired: number;
  keys: string[];
  address_type?: AddressType;
};

export type DeriveAddressesParams = {
  descriptor: string;
  range?: number | [number, number];
};

export type EstimateMode = {
  estimate_mode?: "UNSET" | "ECONOMICAL" | "CONSERVATIVE";
};

export type EstimateSmartFeeParams = EstimateMode & {
  conf_target: number;
};

export type SignMessageWithPrivKeyParams = {
  privkey: string;
  message: string;
};

export type VerifyMessageParams = {
  address: string;
  signature: string;
  message: string;
};

export type HexString = { hexstring: string };

export type ConvertToPsbtParams = HexString & {
  permitsigdata?: boolean;
  iswitness?: boolean;
};

export type BaseTransactionInput = { txid: string; vout: number };

export type TransactionInput = BaseTransactionInput & {
  sequence?: number;
};

export type TransactionOutput =
  | { [address: string]: string | number }
  | { data: string };

export type BaseCreateTransaction = {
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  locktime?: number;
};

export type CreateTransactionParams = BaseCreateTransaction & {
  replaceable?: boolean;
};

export type DecodeRawTransactionParams = HexString & { iswitness?: boolean };

export type FinalizePsbtParams = { psbt: string; extract?: boolean };

export type BaseFundOptions = {
  options?: EstimateMode & {
    changeAddress?: string;
    changePosition?: number;
    change_type?: string;
    includeWatching?: boolean;
    lockUnspents?: boolean;
    feeRate?: number | string;
    subtractFeeFromOutputs?: number[];
    replaceable?: boolean;
    conf_target?: number;
  };
};

export type FundRawTransactionParams = HexString & {
  options?: BaseFundOptions;
  iswitness?: boolean;
};

export type GetRawTransactionParams = TxId & Verbose & { blockhash?: string };

export type SendRawTransactionParams = HexString & { allowhighfees?: boolean };

export type PrevTx = {
  txid: string;
  vout: number;
  scriptPubKey: string;
  redeemScript?: string;
  witnessScript?: string;
  amount: number | string;
};

export type SigHashType =
  | "ALL"
  | "NONE"
  | "SINGLE"
  | "ALL|ANYONECANPAY"
  | "NONE|ANYONECANPAY"
  | "SINGLE|ANYONECANPAY";

export type SignRawTransactionWithWalletParams = HexString & {
  prevtxs?: PrevTx[];
  sighashtype?: SigHashType;
};

export type SignRawTransactionWithKeyParams = {
  privkeys: string[];
} & SignRawTransactionWithWalletParams;

export type TestmemPoolAcceptParams = {
  rawtxs: string[];
  allowhighfees?: boolean;
};

export type Label = { label?: string };

export type AddMultiSigAddressParams = CreateMultiSigParams & Label;

export type BumpFeeParams = {
  txid: string;
  options?: EstimateMode & { replaceable?: boolean } & (
      | { confTarget?: number }
      | { totalFee?: number });
};

export type CreateWalletParams = {
  wallet_name: string;
  disable_private_keys?: boolean;
  blank?: boolean;
};

export type GetBalanceParams = {
  minconf?: number;
  include_watchonly?: boolean;
};

export type GetNewAddressParams = { address_type?: AddressType } & Label;

export type GetReceivedByAddressParams = {
  address: string;
  minconf?: number;
};

export type GetReceivedByLabelParams = {
  label: string;
  minconf?: number;
};

export type GetTransactionParams = TxId & { include_watchonly?: boolean };

export type ImportAddressParams = {
  address: string;
  label?: string;
  rescan?: boolean;
  p2sh?: boolean;
};

export type ImportMultiRequest = {
  timestamp: number | "now";
  internal?: boolean;
  watchonly?: boolean;
  label?: string;
  keypool?: boolean;
} & (
  | {
      desc: string;
      range?: number | [number, number];
    }
  | {
      scriptPubKey: { address: string } | string;
      redeemscript?: string;
      witnessscript?: string;
      pubkeys?: string[];
      keys?: string[];
    });

export type ImportMultiParams = {
  requests: ImportMultiRequest[];
  options?: {
    rescan?: boolean;
  };
};

export type ImportPrivKeyParams = {
  privkey: string;
  label?: string;
  rescan?: boolean;
};

export type ImportPrunedFundsParams = {
  rawtransaction: string;
  txoutproof: string;
};

export type ImportPubKeyParams = {
  pubkey: string;
  label?: string;
  rescan?: boolean;
};

export type ListLabelsParams = { purpose: "receive" | "send" };

export type ListReceivedByAddressParams = ListReceivedByLabelParams & {
  address_filter?: string;
};

export type ListReceivedByLabelParams = {
  minconf?: number;
  include_empty?: boolean;
  include_watchonly?: boolean;
};

export type ListSinceBlockParams = {
  blockhash?: string;
  target_confirmations?: number;
  include_watchonly?: boolean;
  include_removed?: boolean;
};

export type ListTransactionsParams = {
  label?: string;
  count?: number;
  skip?: number;
  include_watchonly?: boolean;
};

export type ListUnspentParams = {
  minconf?: number;
  maxconf?: number;
  addresses?: string[];
  include_unsafe?: boolean;
  query_options?: {
    minimumAmount?: number | string;
    maximumAmount?: number | string;
    maximumCount?: number;
    minimumSumAmount?: number | string;
  };
};

export type LockUnspentParams = {
  unlock: boolean;
  transactions?: BaseTransactionInput[];
};

export type RescanBlockchainParams = {
  start_height?: number;
  stop_height?: number;
};

export type BaseSendParams = EstimateMode & {
  comment?: string;
  replaceable?: boolean;
  conf_target?: number;
};

export type SendManyParams = BaseSendParams & {
  amounts: { [address: string]: number | string };
  minconf?: number;
  subtractfeefrom?: string[];
};

export type SendToAddressParams = BaseSendParams & {
  address: string;
  amount: string | number;
  comment_to?: string;
  subtractfeefromamount?: boolean;
};

export type SetHDSeedParams = { newkeypool?: boolean; seed?: string };

export type SetLabelParams = { address: string; label: string };

export type SignMessageParams = { address: string; message: string };

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

  /**
   * @description Scans the unspent transaction output set for entries that match certain output descriptors.
   */
  async scantxoutset({ action, scanobjects }: ScanTxOutSetParams) {
    return this.rpc("scantxoutset", { action, scanobjects });
  }

  /**
   * @description Verifies blockchain database.
   */
  async verifychain({ checklevel = 3, nblocks = 6 } = {}) {
    return this.rpc("verifychain", { checklevel, nblocks });
  }

  /**
   * @description Verifies that a proof points to a transaction in a block, returning the transaction it commits to and throwing an RPC error if the block is not in our best chain.
   */
  async verifytxoutproof({ proof }: { proof: string }) {
    return this.rpc("verifytxoutproof", { proof });
  }

  /**
   * @description Returns an object containing information about memory usage.
   */
  async getmemoryinfo({ mode = "stats" } = {}) {
    return this.rpc("getmemoryinfo", { mode });
  }

  /**
   * @description Returns details of the RPC server.
   */
  async getrpcinfo() {
    return this.rpc("getrpcinfo");
  }

  /**
   * @description List all commands, or get help for a specified command.
   */
  async help({ command }: HelpParams = {}) {
    return this.rpc("help", { command });
  }

  /**
   * @description Gets and sets the logging configuration.
   */
  async logging({ include, exclude }: LoggingParams = {}) {
    return this.rpc("logging", { include, exclude });
  }

  /**
   * @description Stop Bitcoin server.
   */
  async stop() {
    return this.rpc("stop");
  }

  /**
   * @description Returns the total uptime of the server.
   */
  async uptime() {
    return this.rpc("uptime");
  }

  /**
   * @description Mine up to nblocks blocks immediately (before the RPC call returns) to an address in the wallet.
   */
  async generate(
    { nblocks, maxtries = 1000000 }: GenerateParams,
    wallet?: string
  ) {
    return this.rpc("generate", { nblocks, maxtries }, wallet || this.wallet);
  }

  /**
   * @description Mine blocks immediately to a specified address (before the RPC call returns)
   */
  async generatetoaddress(
    { nblocks, address, maxtries = 1000000 }: GenerateToAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "generatetoaddress",
      { nblocks, maxtries, address },
      wallet || this.wallet
    );
  }

  /**
   * @description It returns data needed to construct a block to work on.
   */
  async getblocktemplate({ template_request }: GetBlockTemplateParams) {
    return this.rpc("getblocktemplate", { template_request });
  }

  /**
   * @description Returns a json object containing mining-related information.
   */
  async getmininginfo() {
    return this.rpc("getmininginfo");
  }

  /**
   * @description Returns the estimated network hashes per second based on the last `n` blocks.
   */
  async getnetworkhashps({ nblocks = 120, height = -1 } = {}) {
    return this.rpc("getnetworkhashps", { nblocks, height });
  }

  /**
   * @description Accepts the transaction into mined blocks at a higher (or lower) priority
   */
  async prioritisetransaction({
    txid,
    fee_delta
  }: PrioritiseTransactionParams) {
    return this.rpc("prioritisetransaction", { txid, fee_delta });
  }

  /**
   * @description Attempts to submit new block to network.
   */
  async submitblock({ hexdata }: HexData) {
    return this.rpc("submitblock", { hexdata });
  }

  /**
   * @description Decode the given hexdata as a header and submit it as a candidate chain tip if valid.
   */
  async submitheader({ hexdata }: HexData) {
    return this.rpc("submitheader", { hexdata });
  }

  /**
   * @description Attempts to add or remove a node from the addnode list.
   */
  async addnode({ node, command }: AddNodeParams) {
    return this.rpc("addnode", { node, command });
  }

  /**
   * @description Clear all banned IPs.
   */
  async clearbanned() {
    return this.rpc("clearbanned");
  }

  /**
   * @description Immediately disconnects from the specified peer node.
   */
  async disconnectnode(params: DisconnectNodeParams) {
    if ("address" in params) {
      return this.rpc("disconnectnode", { address: params.address });
    }
    return this.rpc("disconnectnode", { nodeid: params.nodeid });
  }

  /**
   * @description Returns information about the given added node, or all added nodes
   */
  async getaddednodeinfo({ node }: { node?: string } = {}) {
    return this.rpc("getaddednodeinfo", { node });
  }

  /**
   * @description Returns the number of connections to other nodes.
   */
  async getconnectioncount() {
    return this.rpc("getconnectioncount");
  }

  /**
   * @description Returns information about network traffic, including bytes in, bytes out, and current time.
   */
  async getnettotals() {
    return this.rpc("getnettotals");
  }

  /**
   * @description Returns an object containing various state info regarding P2P networking.
   */
  async getnetworkinfo() {
    return this.rpc("getnetworkinfo");
  }

  /**
   * @description Return known addresses which can potentially be used to find new nodes in the network
   */
  async getnodeaddresses({ count = 1 } = {}) {
    return this.rpc("getnodeaddresses", { count });
  }

  /**
   * @description Returns data about each connected network node as a json array of objects.
   */
  async getpeerinfo() {
    return this.rpc("getpeerinfo");
  }

  /**
   * @description List all banned IPs/Subnets.
   */
  async listbanned() {
    return this.rpc("listbanned");
  }

  /**
   * @description Requests that a ping be sent to all other nodes, to measure ping time.
   */
  async ping() {
    return this.rpc("ping");
  }

  /**
   * @description Attempts to add or remove an IP/Subnet from the banned list
   */
  async setban({
    subnet,
    command,
    bantime = 0,
    absolute = false
  }: SetBanParams) {
    return this.rpc("setban", { subnet, command, bantime, absolute });
  }

  /**
   * @description Disable/enable all p2p network activity.
   */
  async setnetworkactive({ state }: { state: boolean }) {
    return this.rpc("setnetworkactive", { state });
  }

  /**
   * @description Analyzes and provides information about the current status of a PSBT and its inputs
   */
  async analyzepsbt({ psbt }: { psbt: string }) {
    return this.rpc("analyzepsbt", { psbt });
  }

  /**
   * @description Combine multiple partially signed Bitcoin transactions into one transaction.
   */
  async combinepsbt({ txs }: { txs: string[] }) {
    return this.rpc("combinepsbt", { txs });
  }

  /**
   * @description Combine multiple partially signed transactions into one transaction.
   */
  async combinerawtransaction({ txs }: { txs: string[] }) {
    return this.rpc("combinerawtransaction", { txs });
  }

  /**
   * @description Converts a network serialized transaction to a PSBT.
   */
  async converttopsbt({
    hexstring,
    permitsigdata = false,
    iswitness
  }: ConvertToPsbtParams) {
    return this.rpc("converttopsbt", {
      hexstring,
      permitsigdata,
      iswitness
    });
  }

  /**
   * @description Creates a transaction in the Partially Signed Transaction format.
   */
  async createpsbt({
    inputs,
    outputs,
    locktime = 0,
    replaceable = false
  }: CreateTransactionParams) {
    return this.rpc("createpsbt", {
      inputs,
      outputs,
      locktime,
      replaceable
    });
  }

  /**
   * @description Create a transaction spending the given inputs and creating new outputs.
   */
  async createrawtransaction({
    inputs,
    outputs,
    locktime = 0,
    replaceable = false
  }: CreateTransactionParams) {
    return this.rpc("createrawtransaction", {
      inputs,
      outputs,
      locktime,
      replaceable
    });
  }

  /**
   * @description Return a JSON object representing the serialized, base64-encoded partially signed Bitcoin transaction.
   */
  async decodepsbt({ psbt }: { psbt: string }) {
    return this.rpc("decodepsbt", { psbt });
  }

  /**
   * @description Return a JSON object representing the serialized, hex-encoded transaction.
   */
  async decoderawtransaction({
    hexstring,
    iswitness
  }: DecodeRawTransactionParams) {
    return this.rpc("decoderawtransaction", { hexstring, iswitness });
  }

  /**
   * @description Decode a hex-encoded script.
   */
  async decodescript({ hexstring }: HexString) {
    return this.rpc("decodescript", { hexstring });
  }

  /**
   * @description Finalize the inputs of a PSBT.
   */
  async finalizepsbt({ psbt, extract = false }: FinalizePsbtParams) {
    return this.rpc("finalizepsbt", { psbt, extract });
  }

  /**
   * @description Add inputs to a transaction until it has enough in value to meet its out value.
   */
  async fundrawtransaction(
    { hexstring, options, iswitness }: FundRawTransactionParams,
    wallet?: string
  ) {
    return this.rpc(
      "fundrawtransaction",
      {
        hexstring,
        options,
        iswitness
      },
      wallet || this.wallet
    );
  }

  /**
   * @description Return the raw transaction data.
   */
  async getrawtransaction({
    txid,
    verbose = false,
    blockhash
  }: GetRawTransactionParams) {
    return this.rpc("getrawtransaction", { txid, verbose, blockhash });
  }

  /**
   * @description Joins multiple distinct PSBTs with different inputs and outputs into one PSBT with inputs and outputs from all of the PSBTs.
   */
  async joinpsbts({ txs }: { txs: string[] }) {
    return this.rpc("joinpsbts", { txs });
  }

  /**
   * @description Submits raw transaction (serialized, hex-encoded) to local node and network.
   */
  async sendrawtransaction({
    hexstring,
    allowhighfees = false
  }: SendRawTransactionParams) {
    return this.rpc("sendrawtransaction", { hexstring, allowhighfees });
  }

  /**
   * @description Sign inputs for raw transaction
   */
  async signrawtransactionwithkey({
    hexstring,
    privkeys,
    prevtxs,
    sighashtype = "ALL"
  }: SignRawTransactionWithKeyParams) {
    return this.rpc("signrawtransactionwithkey", {
      hexstring,
      privkeys,
      prevtxs,
      sighashtype
    });
  }

  /**
   * @description Returns result of mempool acceptance tests indicating if raw transaction (serialized, hex-encoded) would be accepted by mempool.
   */
  async testmempoolaccept({
    rawtxs,
    allowhighfees = false
  }: TestmemPoolAcceptParams) {
    return this.rpc("testmempoolaccept", { rawtxs, allowhighfees });
  }

  /**
   * @description Updates a PSBT with witness UTXOs retrieved from the UTXO set or the mempool.
   */
  async utxoupdatepsbt({ psbt }: { psbt: string }) {
    return this.rpc("utxoupdatepsbt", { psbt });
  }

  /**
   * @description Creates a multi-signature address with n signature of m keys required.
   */
  async createmultisig({
    nrequired,
    keys,
    address_type = "legacy"
  }: CreateMultiSigParams) {
    return this.rpc("createmultisig", { nrequired, keys, address_type });
  }

  /**
   * @description Derives one or more addresses corresponding to an output descriptor.
   */
  async deriveaddresses({ descriptor, range }: DeriveAddressesParams) {
    return this.rpc("deriveaddresses", { descriptor, range });
  }

  /**
   * @description Estimates the approximate fee per kilobyte needed for a transaction to begin confirmation within `conf_target` blocks if possible and return the number of blocks for which the estimate is valid.
   */
  async estimatesmartfee({
    conf_target,
    estimate_mode = "CONSERVATIVE"
  }: EstimateSmartFeeParams) {
    return this.rpc("estimatesmartfee", { conf_target, estimate_mode });
  }

  /**
   * @description Analyses a descriptor.
   */
  async getdescriptorinfo({ descriptor }: { descriptor: string }) {
    return this.rpc("getdescriptorinfo", { descriptor });
  }

  /**
   * @description Sign a message with the private key of an address.
   */
  async signmessagewithprivkey({
    privkey,
    message
  }: SignMessageWithPrivKeyParams) {
    return this.rpc("signmessagewithprivkey", { privkey, message });
  }

  /**
   * @description Return information about the given bitcoin address.
   */
  async validateaddress({ address }: { address: string }) {
    return this.rpc("validateaddress", { address });
  }

  /**
   * @description Verify a signed message
   */
  async verifymessage({ address, signature, message }: VerifyMessageParams) {
    return this.rpc("verifymessage", { address, signature, message });
  }

  /**
   * @description Mark in-wallet transaction `txid` as abandoned
   */
  async abandontransaction({ txid }: TxId, wallet?: string) {
    return this.rpc("abandontransaction", { txid }, wallet || this.wallet);
  }

  /**
   * @description Stops current wallet rescan triggered by an RPC call
   */
  async abortrescan(wallet?: string) {
    return this.rpc("abortrescan", undefined, wallet || this.wallet);
  }

  /**
   * @description Add a nrequired-to-sign multisignature address to the wallet.
   */
  async addmultisigaddress(
    { nrequired, keys, label, address_type }: AddMultiSigAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "addmultisigaddress",
      { nrequired, keys, label, address_type },
      wallet || this.wallet
    );
  }

  /**
   * @description Safely copies current wallet file to destination.
   */
  async backupwallet(
    { destination }: { destination: string },
    wallet?: string
  ) {
    return this.rpc("backupwallet", { destination }, wallet || this.wallet);
  }

  /**
   * @description Bumps the fee of an opt-in-RBF transaction T, replacing it with a new transaction B.
   */
  async bumpfee({ txid, options }: BumpFeeParams, wallet?: string) {
    return this.rpc("bumpfee", { txid, options }, wallet || this.wallet);
  }

  /**
   * @description Creates and loads a new wallet.
   */
  async createwallet({
    wallet_name,
    disable_private_keys = false,
    blank = false
  }: CreateWalletParams) {
    return this.rpc("createwallet", {
      wallet_name,
      disable_private_keys,
      blank
    });
  }

  /**
   * @description Reveals the private key corresponding to 'address'.
   */
  async dumpprivkey({ address }: { address: string }, wallet?: string) {
    return this.rpc("dumpprivkey", { address }, wallet || this.wallet);
  }

  /**
   * @description Dumps all wallet keys in a human-readable format to a server-side file.
   */
  async dumpwallet({ filename }: { filename: string }, wallet?: string) {
    return this.rpc("dumpwallet", { filename }, wallet || this.wallet);
  }

  /**
   * @description Encrypts the wallet with 'passphrase'.
   */
  async encryptwallet({ passphrase }: { passphrase: string }, wallet?: string) {
    return this.rpc("encryptwallet", { passphrase }, wallet || this.wallet);
  }

  /**
   * @description Returns the list of addresses assigned the specified label.
   */
  async getaddressesbylabel({ label }: { label: string }, wallet?: string) {
    return this.rpc("getaddressesbylabel", { label }, wallet || this.wallet);
  }

  /**
   * @description Return information about the given bitcoin address.
   */
  async getaddressinfo({ address }: { address: string }, wallet?: string) {
    return this.rpc("getaddressinfo", { address }, wallet || this.wallet);
  }

  /**
   * @description Returns the total available balance.
   */
  async getbalance(
    { minconf, include_watchonly = false }: GetBalanceParams,
    wallet?: string
  ) {
    return this.rpc(
      "getbalance",
      { minconf, include_watchonly },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns a new Bitcoin address for receiving payments.
   */
  async getnewaddress(
    { label = "", address_type }: GetNewAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "getnewaddress",
      { label, address_type },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns a new Bitcoin address, for receiving change.
   */
  async getrawchangeaddress(
    { address_type }: { address_type?: AddressType },
    wallet?: string
  ) {
    return this.rpc(
      "getrawchangeaddress",
      { address_type },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns the total amount received by the given address in transactions with at least minconf confirmations.
   */
  async getreceivedbyaddress(
    { address, minconf = 1 }: GetReceivedByAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "getreceivedbyaddress",
      { address, minconf },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns the total amount received by addresses with `label` in transactions with at least `minconf` confirmations.
   */
  async getreceivedbylabel(
    { label, minconf = 1 }: GetReceivedByLabelParams,
    wallet?: string
  ) {
    return this.rpc(
      "getreceivedbylabel",
      { label, minconf },
      wallet || this.wallet
    );
  }

  /**
   * @description Get detailed information about in-wallet transaction `txid`
   */
  async gettransaction(
    { txid, include_watchonly = false }: GetTransactionParams,
    wallet?: string
  ) {
    return this.rpc(
      "gettransaction",
      { txid, include_watchonly },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns the server's total unconfirmed balance
   */
  async getunconfirmedbalance(wallet?: string) {
    return this.rpc("getunconfirmedbalance", undefined, wallet || this.wallet);
  }

  /**
   * @description Returns an object containing various wallet state info.
   */
  async getwalletinfo(wallet?: string) {
    return this.rpc("getwalletinfo", undefined, wallet || this.wallet);
  }

  /**
   * @description Adds an address or script (in hex) that can be watched as if it were in your wallet but cannot be used to spend.
   */
  async importaddress(
    { address, label = "", rescan = true, p2sh = false }: ImportAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "importaddress",
      { address, label, rescan, p2sh },
      wallet || this.wallet
    );
  }

  /**
   * @description Import addresses/scripts (with private or public keys, redeem script (P2SH)), optionally rescanning the blockchain from the earliest creation time of the imported scripts.
   */
  async importmulti({ requests, options }: ImportMultiParams, wallet?: string) {
    return this.rpc(
      "importmulti",
      { requests, options },
      wallet || this.wallet
    );
  }

  /**
   * @description Adds a private key (as returned by `dumpprivkey`) to your wallet.
   */
  async importprivkey(
    { privkey, label, rescan }: ImportPrivKeyParams,
    wallet?: string
  ) {
    return this.rpc(
      "importprivkey",
      { privkey, label, rescan },
      wallet || this.wallet
    );
  }

  /**
   * @description Imports funds without rescan. Corresponding address or script must previously be included in wallet.
   */
  async importprunedfunds(
    { rawtransaction, txoutproof }: ImportPrunedFundsParams,
    wallet?: string
  ) {
    return this.rpc(
      "importprunedfunds",
      { rawtransaction, txoutproof },
      wallet || this.wallet
    );
  }

  /**
   * @description Adds a public key (in hex) that can be watched as if it were in your wallet but cannot be used to spend.
   */
  async importpubkey(
    { pubkey, label = "", rescan = true }: ImportPubKeyParams,
    wallet?: string
  ) {
    return this.rpc(
      "importpubkey",
      { pubkey, label, rescan },
      wallet || this.wallet
    );
  }

  /**
   * @description Imports keys from a wallet dump file (see `dumpwallet`).
   */
  async importwallet({ filename }: { filename: string }, wallet?: string) {
    return this.rpc("importwallet", { filename }, wallet || this.wallet);
  }

  /**
   * @description Fills the keypool.
   */
  async keypoolrefill(
    { newsize = 100 }: { newsize?: number },
    wallet?: string
  ) {
    return this.rpc("keypoolrefill", { newsize }, wallet || this.wallet);
  }

  /**
   * @description Lists groups of addresses which have had their common ownership made public by common use as inputs or as the resulting change in past transactions
   */
  async listaddressgroupings(wallet?: string) {
    return this.rpc("listaddressgroupings", undefined, wallet || this.wallet);
  }

  /**
   * @description Returns the list of all labels, or labels that are assigned to addresses with a specific purpose.
   */
  async listlabels({ purpose }: ListLabelsParams, wallet?: string) {
    return this.rpc("listlabels", { purpose }, wallet || this.wallet);
  }

  /**
   * @description Returns list of temporarily unspendable outputs.
   */
  async listlockunspent(wallet?: string) {
    return this.rpc("listlockunspent", undefined, wallet || this.wallet);
  }

  /**
   * @description List balances by receiving address.
   */
  async listreceivedbyaddress(
    {
      minconf = 1,
      include_empty = false,
      include_watchonly = false,
      address_filter
    }: ListReceivedByAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "listreceivedbyaddress",
      { minconf, include_empty, include_watchonly, address_filter },
      wallet || this.wallet
    );
  }

  /**
   * @description List received transactions by label.
   */
  async listreceivedbylabel(
    {
      minconf = 1,
      include_empty = false,
      include_watchonly = false
    }: ListReceivedByLabelParams,
    wallet?: string
  ) {
    return this.rpc(
      "listreceivedbylabel",
      { minconf, include_empty, include_watchonly },
      wallet || this.wallet
    );
  }

  /**
   * @description Get all transactions in blocks since block `blockhash`, or all transactions if omitted.
   */
  async listsinceblock(
    {
      blockhash,
      target_confirmations = 1,
      include_watchonly = false,
      include_removed = true
    }: ListSinceBlockParams,
    wallet?: string
  ) {
    return this.rpc(
      "listsinceblock",
      { blockhash, target_confirmations, include_watchonly, include_removed },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns up to `count` most recent transactions skipping the first `skip` transactions.
   */
  async listtransactions(
    {
      label,
      count = 10,
      skip = 0,
      include_watchonly = false
    }: ListTransactionsParams,
    wallet?: string
  ) {
    return this.rpc(
      "listtransactions",
      { label, count, skip, include_watchonly },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns array of unspent transaction outputs with between `minconf` and `maxconf` (inclusive) confirmations.
   */
  async listunspent(
    {
      minconf = 1,
      maxconf = 9999999,
      addresses,
      include_unsafe = true,
      query_options
    }: ListUnspentParams,
    wallet?: string
  ) {
    return this.rpc(
      "listunspent",
      { minconf, maxconf, addresses, include_unsafe, query_options },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns a list of wallets in the wallet directory.
   */
  async listwalletdir() {
    return this.rpc("listwalletdir");
  }

  /**
   * @description Returns a list of currently loaded wallets.
   */
  async listwallets() {
    return this.rpc("listwallets");
  }

  /**
   * @description Loads a wallet from a wallet file or directory.
   */
  async loadwallet({ filename }: { filename: string }) {
    return this.rpc("loadwallet", { filename });
  }

  /**
   * @description Updates list of temporarily unspendable outputs.
   */
  async lockunspent(
    { unlock, transactions }: LockUnspentParams,
    wallet?: string
  ) {
    return this.rpc(
      "lockunspent",
      { unlock, transactions },
      wallet || this.wallet
    );
  }

  /**
   * @description Deletes the specified transaction from the wallet.
   */
  async removeprunedfunds({ txid }: TxId, wallet?: string) {
    return this.rpc("removeprunedfunds", { txid }, wallet || this.wallet);
  }

  /**
   * @description Rescan the local blockchain for wallet related transactions.
   */
  async rescanblockchain(
    { start_height = 0, stop_height }: RescanBlockchainParams,
    wallet?: string
  ) {
    return this.rpc(
      "rescanblockchain",
      { start_height, stop_height },
      wallet || this.wallet
    );
  }

  /**
   * @description Send multiple times.
   */
  async sendmany(
    {
      amounts,
      minconf = 1,
      comment,
      subtractfeefrom,
      replaceable,
      conf_target,
      estimate_mode = "UNSET"
    }: SendManyParams,
    wallet?: string
  ) {
    return this.rpc(
      "sendmany",
      {
        amounts,
        minconf,
        comment,
        subtractfeefrom,
        replaceable,
        conf_target,
        estimate_mode
      },
      wallet || this.wallet
    );
  }

  /**
   * @description Send an amount to a given address.
   */
  async sendtoaddress(
    {
      address,
      amount,
      comment,
      comment_to,
      subtractfeefromamount = false,
      replaceable,
      conf_target,
      estimate_mode = "UNSET"
    }: SendToAddressParams,
    wallet?: string
  ) {
    return this.rpc(
      "sendtoaddress",
      {
        address,
        amount,
        comment,
        comment_to,
        subtractfeefromamount,
        replaceable,
        conf_target,
        estimate_mode
      },
      wallet || this.wallet
    );
  }

  /**
   * @description Set or generate a new HD wallet seed.
   */
  async sethdseed({ newkeypool, seed }: SetHDSeedParams, wallet?: string) {
    return this.rpc("sethdseed", { newkeypool, seed }, wallet || this.wallet);
  }

  /**
   * @description Sets the label associated with the given address.
   */
  async setlabel({ address, label }: SetLabelParams, wallet?: string) {
    return this.rpc("setlabel", { address, label }, wallet || this.wallet);
  }

  /**
   * @description Set the transaction fee per kB for this wallet.
   */
  async settxfee({ amount }: { amount: number | string }, wallet?: string) {
    return this.rpc("settxfee", { amount }, wallet || this.wallet);
  }

  /**
   * @description Sign a message with the private key of an address
   */
  async signmessage({ address, message }: SignMessageParams, wallet?: string) {
    return this.rpc("signmessage", { address, message }, wallet || this.wallet);
  }

  /**
   * @description Sign inputs for raw transaction
   */
  async signrawtransactionwithwallet(
    {
      hexstring,
      prevtxs,
      sighashtype = "ALL"
    }: SignRawTransactionWithWalletParams,
    wallet?: string
  ) {
    return this.rpc(
      "signrawtransactionwithwallet",
      { hexstring, prevtxs, sighashtype },
      wallet || this.wallet
    );
  }

  /**
   * @description Returns information about the active ZeroMQ notifications.
   */
  async getzmqnotifications() {
    return this.rpc("getzmqnotifications");
  }
}
