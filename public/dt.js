let dt;

const bd ='BudgetStore';

// 
const request = indexedDB.open('budgetDB', 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
  
    db.createObjectStore(bs, { autoIncrement: true });
  };
  
  request.onerror = (e) => console.log("Error", e.target.errorCode);

  const checkDatabase = () => {
    // open a transaction with bs
    let transaction = db.transaction([bs], 'readwrite');
    // access your bs object
    const store = transaction.objectStore(bs);
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
        transaction = db.transaction([bs], 'readwrite');
        const currentStore = transaction.objectStore(bs);

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