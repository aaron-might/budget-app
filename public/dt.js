let dt;

const bd ='BudgetStore';

// 
const request = indexedDB.open('budgetDB', 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
  
    db.createObjectStore(bs, { autoIncrement: true });
  };
  
  request.onerror = (e) => console.log("Error", e.target.errorCode);
