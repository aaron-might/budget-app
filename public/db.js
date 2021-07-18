let db;

const bd ='BudgetStore';

// 
const request = indexedDB.open('budgetDB', 1);
request.onupgradeneeded = (evt) => {
    db = evt.target.result;
  
    db.createObjectStore(bd, {keyPath:"bdID", autoIncrement: true });
  };
  
  request.onerror = (evt) => console.log("Error", evt.target.errorCode);

  const saveRecord = (record) => {
    console.log(record);
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction([bd], "readwrite");
    // access your pending object store
    const BudgetStore = transaction.objectStore(bd);
    // add record to your store with add method.
    BudgetStore.add(record);
  }

  const checkDatabase = () => {
    // open a transaction with bd
    const transaction = db.transaction([bd], 'readwrite');
    // access your bd object
    const BudgetStore = transaction.objectStore(bd);
    const getAll = BudgetStore.getAll();
    getAll.onsuccess = () => {
      const allRecords = getAll.result;
    }

    getAll.onsuccess = () => {
    if(getAll.result.length > 0){
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json', 
      },
    })
    .then((res) => res.json())
    .then(() => {
      // if returned response is not empty
      if (res.length !== 0) {
        // open another transaction
        transaction = db.transaction([bd], 'readwrite');
        const currentStore = transaction.objectStore(bd);

        currentStore.clear();
      }
    });
  }
};
}

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
      caches.keys().then(keyList => {
          return Promise.all(
              keyList.map(key => {
                  if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                      console.log('Removing old cache data', key);
                      return caches.delete(key);
                  }
              })
          );
      })
  );
  self.clients.claim();
});
window.addEventListener('online', checkDatabase);