import http from "@/request/common";
import API_LIST from "@/config/api.d";
interface parmaType {
  requestName: string;
  data?: object;
  parmas?: any;
}
interface resultType {
  code?: number;
  data?: [];
}
export default async function Http({ requestName, data, parmas }: parmaType) {
  let tempParma = "";
  const { method, url } = API_LIST[requestName as keyof typeof API_LIST];
  data = method === "get" ? { parmas: data } : data;
  if (parmas) {
    Object.entries(parmas).map(([key, value]) => {
      tempParma = tempParma + key + "=" + value + "&";
    });
  }
  tempParma = tempParma.substring(0, tempParma.length - 1);
  let requestUrl = method === "get" ? `${url}?${tempParma}` : url;
  return await http[method](requestUrl, data)
    .then((res: resultType) => {
      return res;
    })
    .catch((err: any) => {
      return Promise.reject(err);
    });
}
