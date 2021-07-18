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
