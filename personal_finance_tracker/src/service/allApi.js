import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonStructure";

export const userRegistrationApi = async (body) => {
  return await commonApi('POST', `${BASE_URL}/user/register`, body, "")
}

export const userLoginApi = async (body) => {
  return await commonApi('POST', `${BASE_URL}/user/login`, body, "")
}