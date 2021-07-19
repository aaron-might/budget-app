let db;
// create a new db request for a "BudgetDB" database.
const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const db = event.target.result;
  const BudgetStore = db.createObjectStore("Budget", {
    keyPath: "budgetID", autoIncrement: true
  });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.error);
};

function saveRecord(record) {
  console.log(record);
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["Budget"], "readwrite");
  // access your pending object store
  const BudgetStore = transaction.objectStore("Budget");
  // add record to your store with add method.
  BudgetStore.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["Budget"], "readwrite");
  // access your pending object store
  const BudgetStore = transaction.objectStore("Budget");
  // get all records from store and set to a variable

  const getAll = BudgetStore.getAll();
  getAll.onsuccess = () => {
    const allRecords = getAll.result;
  };

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["Budget"], "readwrite");
          // access your pending object store
          const BudgetStore = transaction.objectStore("Budget");
          // clear all items in your store
          BudgetStore.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);