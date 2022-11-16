import axios from "axios";
const apiCall = async(apiURL) => {
    const params = {
      method: "get",
      url: apiURL,
      headers: {
          "x-api-key" : "9iJU9jHvEf8rURIhIdKMB5SLBQMrLWCq37wMg7vL"
        }
  };
  const transactionDetail = await axios(params);
  return transactionDetail;
}
export default apiCall;




