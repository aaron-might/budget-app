let dt;

const bd ='BudgetStore';

// 
const request = indexedDB.open('budgetDB', 1);
request.onupgradeneeded = (e) => {
    dt = e.target.result;
  
    dt.createObjectStore(bd, { autoIncrement: true });
  };
  
  request.onerror = (e) => console.log("Error", e.target.errorCode);

  const checkDatabase = () => {
    // open a transaction with bs
    let transaction = dt.transaction([bd], 'readwrite');
    // access your bs object
    const store = transaction.objectStore(bd);
    const getAll = store.getAll();
getAll.onsuccess = () =>{
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
    .then((res) => {
      // if returned response is not empty
      if (res.length !== 0) {
        // open another transaction
        transaction = dt.transaction([bd], 'readwrite');
        const currentStore = transaction.objectStore(bd);

        currentStore.clear();
      }
    });
  }
};
}

self.addEventListener('activate', (e) => {
  e.waitUntil(
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