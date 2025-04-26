type Asset = {
  name: string;
  address: string;
  icon: string;
  decimals: number;
  symbol: string;
  chainId: number;
  logoURI: string;
  chainAgnosticId: string;
};

type IntegratorFee = {
  feeTakerAddress: string;
  amount: string;
  asset: Asset;
};

type GasFees = {
  gasLimit: number;
  feesInUsd: number;
  asset: Asset;
  gasAmount: string;
};

type Refuel = {
  fromAmount: string;
  toAmount: string;
  gasFees: GasFees;
  recipient: string;
  serviceTime: number;
  fromAsset: Asset;
  toAsset: Asset;
  fromChainId: number;
  toChainId: number;
};

type Route = {
  routeId: string;
  isOnlySwapRoute: boolean;
  fromAmount: string;
  chainGasBalances: Record<string, number>;
  minimumGasBalances: Record<string, number>;
  toAmount: string;
  usedBridgeNames: string[];
  totalUserTx: number;
  totalGasFeesInUsd: number;
  recipient: string;
  sender: string;
  userTxs: Record<string, any>[];
  receivedValueInUsd: number;
  inputValueInUsd: number;
  outputValueInUsd: number;
  serviceTime: number;
  maxServiceTime: number;
  integratorFee: IntegratorFee;
  t2bReceiverAddress: string;
  extraData: Record<string, any>;
};

export type GetQuoteParams = {
  fromChainId: number;
  fromTokenAddress: string;
  toChainId: number;
  toTokenAddress: string;
  fromAmount: number;
  userAddress: string;
  /** Returns the best route for a given DEX / bridge combination */
  uniqueRoutesPerBridge: boolean;
  sort: "output" | "gas" | "time";
  singleTxOnly: boolean;
};

export type GetQuoteResult = {
  success: boolean;
  result: {
    routes: Route[];
    fromChainId: number;
    fromAsset: Asset;
    toChainId: number;
    toAsset: Asset;
    refuel: Refuel;
  };
};

/**
 * NOTE: API docs are incorrect that `refuel`, `destinationCallData` and `bridgeInsuranceData` are required
 * @see https://docs.bungee.exchange/bungee-manual/socket-api-reference/app-controller-get-single-tx/
 */
export type GetRouteTransactionDataParams = {
  route: Route;
  refuel?: Refuel;
  destinationCallData?: {
    destinationPayload: string;
    destinationGasLimit: string;
  };
  bridgeInsuranceData?: {
    amount: string;
  };
};

export type GetRouteTransactionDataResult = {
  status: boolean;
  result: {
    userTxType: string;
    txTarget: string;
    chainId: number;
    txData: string;
    txType: string;
    value: string;
    totalUserTx: number;
    approvalData: {
      minimumApprovalAmount: string;
      approvalTokenAddress: string;
      allowanceTarget: string;
      owner: string;
    };
  };
};

export type CheckAllowanceParams = {
  chainID: number;
  owner: string;
  allowanceTarget: string;
  tokenAddress: string;
};

export type CheckAllowanceResult = {
  status: boolean;
  result: {
    value: string;
    tokenAddress: string;
  };
};

export type GetApprovalTransactionDataParams = {
  chainID: number;
  owner: string;
  allowanceTarget: string;
  tokenAddress: string;
  amount: number;
};

export type GetApprovalTransactionDataResult = {
  status: boolean;
  result: {
    to: string;
    from: string;
    data: string;
  };
};

export type GetBridgeStatusParams = {
  transactionHash: string;
  fromChainId: number;
  toChainId: number;
};

export type GetBridgeStatusResult = {
  success: true;
  result: {
    sourceTransactionHash: string;
    sourceTxStatus: "PENDING" | "COMPLETED";
    destinationTransactionHash: string;
    destinationTxStatus: "PENDING" | "COMPLETED";
    fromChainId: number;
    toChainId: number;
    fromAsset: Asset;
    toAsset: Asset;
    srcTokenPrice: string;
    destTokenPrice: string;
    fromAmount: string;
    toAmount: string;
    sender: string;
    recipient: string;
    isSocketTx: true;
    bridgeName: string;
    refuel: Refuel;
  };
};
