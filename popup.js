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

      const voucherData = await fetchData(domain);

      dataList.removeChild(loadingState);

      if (voucherData.length === 0) {
        console.log("No data fetched");
        const noVoucher = document.createElement("p");
        noVoucher.textContent = "No voucher codes found";
        dataList.appendChild(noVoucher);
        return;
      }

      // Populate the list with fetched data
      voucherData.forEach((item, index) => {
        const listItem = document.createElement("li");
        
        // Create a div to hold the content (code and description)
        const contentContainer = document.createElement("div");
        contentContainer.classList.add("content-container");

        // Create a span for the description
        const descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = item.description;
        descriptionSpan.classList.add("description");
      
        // Create a span for the code
        const codeSpan = document.createElement("span");
        codeSpan.textContent = item.code;
        codeSpan.classList.add("code");  
      
        // Append the spans to the content container
        contentContainer.appendChild(descriptionSpan);
        contentContainer.appendChild(codeSpan);
        
        // Add click event to copy item content to clipboard and provide visual feedback
        codeSpan.addEventListener("click", function () {
          copyToClipboard(item.code);
          highlightItem(listItem);
          showNotification("Copied to clipboard!");
        });
      
        // Append the content container to the list item
        listItem.appendChild(contentContainer);
      
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
