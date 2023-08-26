function getCurrentTab() {
    console.log('#######################################################################################################################################')
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = chrome.tabs.query(queryOptions);

    console.log(tab)
    return tab;
  }