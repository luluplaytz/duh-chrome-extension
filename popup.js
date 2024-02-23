import { fetchData } from "./api.js";

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");
  const dataList = document.getElementById("data-list");
  const loadingState = document.createElement("p");
  loadingState.textContent = "Loading...";
  dataList.appendChild(loadingState);

  const state = await chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      // Get the active tab's URL
      var currentTabUrl = tabs[0].url;

      // Extract the domain (including subdomains) from the URL
      const domain = new URL(currentTabUrl).origin;

      const voucherCodes = await fetchData(domain);

      dataList.removeChild(loadingState);

      if (voucherCodes.length === 0) {
        console.log("No data fetched");
        const noVoucher = document.createElement("p");
        noVoucher.textContent = "No voucher codes found";
        dataList.appendChild(noVoucher);
        return;
      }

      // Populate the list with fetched data
      voucherCodes.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;

        // Add click event to copy item content to clipboard and provide visual feedback
        listItem.addEventListener("click", function () {
          copyToClipboard(item);
          highlightItem(listItem);
          showNotification("Copied to clipboard!");
        });

        dataList.appendChild(listItem);
      });
    }
  );

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  // Function to highlight the clicked item
  function highlightItem(item) {
    // Remove highlight from all items
    const allItems = document.querySelectorAll("li");
    allItems.forEach((item) => item.classList.remove("active"));

    // Add highlight to the clicked item
    item.classList.add("active");
  }

  // Function to display a notification
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.classList.add("notification");
    document.body.appendChild(notification);

    // Remove the notification after a short delay
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  }
});
