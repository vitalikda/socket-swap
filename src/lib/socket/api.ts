import { socketApiClient } from "./client";
import {
  CheckAllowanceResult,
  type CheckAllowanceParams,
  type GetApprovalTransactionDataParams,
  type GetApprovalTransactionDataResult,
  type GetBridgeStatusParams,
  type GetBridgeStatusResult,
  type GetQuoteParams,
  type GetQuoteResult,
  type GetRouteTransactionDataParams,
  type GetRouteTransactionDataResult,
} from "./types";

/** Makes a GET request to Bungee APIs for quote */
export async function getQuote(searchParams: GetQuoteParams) {
  return socketApiClient<GetQuoteResult>(`/v2/quote`, { searchParams });
}

/** Makes a POST request to Bungee APIs for swap/bridge transaction data */
export async function getRouteTransactionData(
  route: GetRouteTransactionDataParams
) {
  return socketApiClient<GetRouteTransactionDataResult>("/v2/build-tx", {
    method: "POST",
    body: JSON.stringify(route),
  });
}

/** GET request to check token allowance given to allowanceTarget by owner */
export async function checkAllowance(searchParams: CheckAllowanceParams) {
  return socketApiClient<CheckAllowanceResult>(`/v2/approval/check-allowance`, {
    searchParams,
  });
}

/** Fetches transaction data for token approval */
export async function getApprovalTransactionData(
  searchParams: GetApprovalTransactionDataParams
) {
  return socketApiClient<GetApprovalTransactionDataResult>(
    `/v2/approval/build-tx`,
    { searchParams }
  );
}

/** Fetches status of the bridging transaction */
export async function getBridgeStatus(searchParams: GetBridgeStatusParams) {
  return socketApiClient<GetBridgeStatusResult>(`/v2/bridge-status`, {
    searchParams,
  });
}
