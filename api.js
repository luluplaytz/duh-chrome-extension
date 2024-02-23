// api.js
import names from "./names.js";

export async function fetchData(domain) {
  try {
    // Get name from the domain
    const name = names.get(domain);
    if (!name) {
      console.log("No name found for domain:", domain);
      throw new Error("No name found");
    }

    // Get a list of vouchers
    const response = await fetch("http://localhost:3000/api/dies");
    if (!response.ok) {
      console.error("Server responded with an error:", response.status);
      throw new Error("Server responded with an error");
    }
    const data = await response.json();

    // create a list of voucher codes with property "code"
    let voucherCodes = [];
    for (let i = 0; i < data.length; i++) {
      voucherCodes.push(data[i].code);
    }
    return voucherCodes;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
