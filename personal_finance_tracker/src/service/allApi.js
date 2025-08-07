import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonStructure";

export const userRegistrationApi = async (body) => {
  return await commonApi('POST', `${BASE_URL}/user/register`, body, "")
}

export const userLoginApi = async (body) => {
  return await commonApi('POST', `${BASE_URL}/user/login`, body, "")
}

export const addTransactionApi = async (uid, data, header) => {
  return await commonApi('POST', `${BASE_URL}/user/addtransaction/${uid}`, data, header)
}

export const getAllUserTransactionApi = async (uid, headers, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await commonApi('GET', `${BASE_URL}/user/transaction/list/${uid}?${query}`, "", headers);
};

export const editTransactionApi = async (id, header, body) => {
  return await commonApi('PUT', `${BASE_URL}/user/transaction/${id}`, body, header)
}

export const deleteTransactionApi = async (tid, header) => {
  return await commonApi('DELETE', `${BASE_URL}/user/transaction/${tid}`, {}, header)
}

export const getTotalIncomeApi = async (uid, header) => {
  return await commonApi('GET', `${BASE_URL}/user/totalincome/${uid}`, "", header)
}

export const getTotalExpressApi = async (uid, header) => {
  return await commonApi('GET', `${BASE_URL}/user/totalexpense/${uid}`, "", header)
}

export const getCurrentBalanceApi = async (uid, header) => {
  return await commonApi('GET', `${BASE_URL}/user/currentbalance/${uid}`, "", header)
}

export const getAverageIncomeApi = async (uid, header) => {
  return await commonApi('GET', `${BASE_URL}/user/averageincome/${uid}`, "", header)
}

export const getAverageExpenseApi = async (uid, header) => {
  return await commonApi('GET', `${BASE_URL}/user/averageexpense/${uid}`, "", header)
}