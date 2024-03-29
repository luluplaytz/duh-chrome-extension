// api.js
import names from "./names.js";

export async function fetchData(domain) {
  try {
    // Get name from the domain
    const name = names.get(domain);
    if (!name) {
      console.log("No name found for domain:", domain);
      return [];
    }

    // Get a list of vouchers
    const response = await fetch(`https://duh-api.netlify.app/api/${name}`);
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
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
