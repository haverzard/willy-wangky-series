let TRANSACTION_PER_PAGE = 5

let xhr_transaction = new XMLHttpRequest();
let xhr_count = new XMLHttpRequest();
let current_page = 1;
let max_page = 1;

let transactions = document.getElementById('transactions');
let tpp = document.getElementsByClassName('transaction-per-page-select')[0];
let control = document.getElementsByClassName('transaction-table-controller')[0];
let left_button = document.getElementsByClassName('transaction-table-controller-left')[0];
let number = document.getElementsByClassName('transaction-table-controller-number')[0];
let right_button = document.getElementsByClassName('transaction-table-controller-right')[0];

xhr_transaction.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let data;
    try {
      data = JSON.parse(xhr_transaction.responseText)['data'];
    } catch (err) {
      console.log(xhr_transaction.responseText);
      return;
    }

    if (data.length < 1) {
      data = [{
        "id": -1,
        "name": "-",
        "amount": "-",
        "total_price": "-",
        "transaction_date": "-",
        "transaction_time": "-",
        "address": "-"
      }]
    }

    let content = ''
    data.forEach(transaction => {
      part = ''
      if (transaction['id'] >= 0) {
        part = " href='/detail_chocolate/"+transaction['id']+"'"
      }
      content += "<div class='transaction'>";
      content += "<a class='transaction-column c1'"+part+">" + transaction['name'] + "</a>";
      content += "<span class='transaction-column c2'>" + transaction['amount'] + "</span>";
      content += "<span class='transaction-column c3'>" + transaction['total_price'] + "</span>";
      content += "<span class='transaction-column c4'>" + transaction['transaction_date'] + "</span>";
      content += "<span class='transaction-column c5'>" + transaction['transaction_time'] + "</span>";
      content += "<span class='transaction-column c6'>" + transaction['address'] + "</span>";
      content += "</div>";
    });
    transactions.innerHTML = content;

    xhr_count.abort();
    xhr_count.open("GET", "/api/transactions/count", true);
    xhr_count.send();
  }
};

xhr_count.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let data;
    try {
      data = JSON.parse(xhr_count.responseText)['data'];
    } catch (err) {
      console.log(xhr_count.responseText);
      return;
    }
    
    max_page = Math.ceil(data/TRANSACTION_PER_PAGE);

    if (max_page == 0) {
      max_page = 1;
    }

    if (max_page == 1) {
      control.classList.add('hidden')
    } else {
      control.classList.remove('hidden')
    }

    left_button.removeAttribute('disabled');
    right_button.removeAttribute('disabled');
    if (current_page == 1) {
      left_button.setAttribute('disabled', '');
    }
    if (current_page == max_page) {
      right_button.setAttribute('disabled', '');
    }

    number.innerHTML = current_page+'/'+max_page;
  }
};

function go_left() {
  if (current_page > 1) {
    current_page -= 1;
    let params = `offset=${(current_page-1)*TRANSACTION_PER_PAGE}&count=${TRANSACTION_PER_PAGE}`;
    xhr_transaction.abort();
    xhr_transaction.open("GET", "/api/transactions?"+params, true);
    xhr_transaction.send();
  }
}

function go_right() {
  if (current_page < max_page) {
    current_page += 1;
    let params = `offset=${(current_page-1)*TRANSACTION_PER_PAGE}&count=${TRANSACTION_PER_PAGE}`;
    xhr_transaction.abort();
    xhr_transaction.open("GET", "/api/transactions?"+params, true);
    xhr_transaction.send();
  }
}

function update_transaction_per_page() {
  TRANSACTION_PER_PAGE = parseInt(tpp.value);
  current_page = 1;
  number.innerHTML = current_page
  let params = `offset=${(current_page-1)*TRANSACTION_PER_PAGE}&count=${TRANSACTION_PER_PAGE}`;
  xhr_transaction.abort();
  xhr_transaction.open("GET", "/api/transactions?"+params, true);
  xhr_transaction.send();
}

number.innerHTML = current_page
let params = `offset=0&count=${TRANSACTION_PER_PAGE}`
xhr_transaction.abort();
xhr_transaction.open("GET", "/api/transactions?"+params, true);
xhr_transaction.send();