
var itemsData;
var shoppingCart = [];
var isItemsViewVisible = false;

let stripe = Stripe(

  "pk_test_51Lh9ksEgr5mkNVomNdFIQqM4OAE4k2mr70fQVGl1ztse10hIYHDvRV9wfD1MrAqaRuhKiHTXI1Bl9jXmp2d3F0Pd00SASOXsIm"

)

/* Fetch data from the json file into a javascript object */
fetch("./assets/data.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    itemsData = data;
    createUIFromLoadedItemsData();
  });


  /* Proceed button */
  let customerToCheckout = ''
  var proceedButton = document.createElement("button")
  proceedButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "To checkout";
  proceedButton.style.visibility = "hidden";
  let newCustomer = document.getElementById("create-new-customer")
  newCustomer.style.visibility = "hidden";

  let customerForm = document.getElementById("main")
  
  let formHead = document.createElement("h2")
  formHead.innerText = "Customer Registration"
  
  let form = document.createElement("form")
  form.classList.add("form")
  form.name="RegForm"
  form.method = "post"
  form.action="/form/submit.php"
  // form.class.add("w3docs form-hide")
  form.addEventListener("onsubmit", () => {
    return ValidationForm()
  })

  let inputContainer = document.createElement("div")
  inputContainer.classList.add("inputContainer")
  
  let emailDiv = document.createElement("div")
  let emailInput = document.createElement("input")
  emailInput.setAttribute("id", "email")
  emailInput.name="Email"
  emailInput.placeholder = "E-Mail"
  emailInput.type = "text"

  
  emailDiv.append(emailInput)
  
  inputContainer.append(emailDiv)
  form.append(inputContainer)
  customerForm.append(formHead, form)
  
  
  
  /* Use the data to create a list of these object on your website */
function createUIFromLoadedItemsData() {
  if (isItemsViewVisible) { return; }
  isItemsViewVisible = true;

  /* Create a list of the products */
  var list = document.createElement("ul");
  for (var index = 0; index < itemsData.length; index++) {
    list.appendChild(createListItem(itemsData[index]));
  }

  /* Add the list to the DOM */
  var container = document.querySelector("#main");
  if (container.firstChild) {
    container.replaceChild(list, container.firstChild);
  } else {
    container.appendChild(list);
  }
}

function createListItem(itemData) {
  /* Title */
  var title = document.createElement("h3");
  title.innerText = itemData.title;

  /* Description */
  var description = document.createElement("p");
  description.innerText = itemData.description;

  /* Image */
  var image = document.createElement("img");
  image.src = "./assets/" + itemData.image;

  /* Price */
  var price = document.createElement("span");
  price.innerText = "" + itemData.price + " kr";

  /* Button */
  var button = document.createElement("button");
  button.innerHTML = '<i class="fa fa-cart-arrow-down" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Lägg till i kundvagnen";
  button.onclick = function () {
    shoppingCart.push(itemData);
    counter = document.querySelector("#counter");
    counter.innerText = shoppingCart.length;
  };

  var item = document.createElement("li");
  item.appendChild(title);
  item.appendChild(description);
  item.appendChild(image);
  item.appendChild(price);
  item.appendChild(button);

  return item;
}


function showShoppingCart() {
  if (!isItemsViewVisible) { return; }
  isItemsViewVisible = false;

  /* Header */
  var header = document.createElement("h2");
  header.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i>' + " Kundvagn";

  /* Shopping list */
  var list = document.createElement("ul");
  for (var index = 0; index < shoppingCart.length; index++) {
    list.appendChild(createShoppingCartItem(shoppingCart[index], index));
  }

  /* Shopping info & action */
  var info = createShoppingSummary();

  var content = document.createElement("div");
  content.appendChild(header);
  content.appendChild(list);
  content.appendChild(info);

  var container = document.querySelector("#main");
  container.replaceChild(content, container.firstChild);

  // let visible = document.getElementById('form-hide')
  // visible.classList.remove('form-hide')
}

function createShoppingCartItem(itemData, index) {
  /* Image */
  var image = document.createElement("img");
  image.src = "./assets/" + itemData.image;

  /* Title */
  var title = document.createElement("h3");
  title.innerText = itemData.title;

  /* Price */
  var price = document.createElement("span");
  price.innerText = "" + itemData.price + " kr";

  /* Button */
  var button = document.createElement("button");
  button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Ta bort";
  button.onclick = function () {
    /* Remove the item from the array */
    shoppingCart.splice(index, 1);
    /* Update the counter */
    counter = document.querySelector("#counter");
    counter.innerText = shoppingCart.length;
    /* Update the UI list */
    isItemsViewVisible = true;
    console.log(shoppingCart)
    showShoppingCart();
  };



  var item = document.createElement("li");
  item.appendChild(image);
  item.appendChild(title);
  item.appendChild(price);
  item.appendChild(button);

  return item;
}


function createShoppingSummary() {
  /* Total price */
  var totalPrice = 0;
  for (var i = 0; i < shoppingCart.length; i++) {
    totalPrice += shoppingCart[i].price;
  }
  var priceLabel = document.createElement("h2");
  priceLabel.innerText = "Totalt pris: " + totalPrice + " kr";

  proceedButton.addEventListener('click', async () => {      
        let createSess = await createSession(shoppingCart, customerToCheckout)
        console.log(createSess);
        if (createSess) {
          return await stripe.redirectToCheckout({ sessionId: createSess });
          }
  })

  var info = document.createElement("div");
  info.appendChild(priceLabel);
  info.appendChild(proceedButton);

  return info;
}

const createSession = async (cart, customerToCheckout) => {
  try {
    
    let response = await fetch("/create-checkout-session", {
      headers: { 'Content-Type': 'application/json' },
      method: "POST",
      body: JSON.stringify({cart, customerToCheckout})
    })
        let sessionId = await response.json() 
        console.log(sessionId, 'session id');
        return sessionId;
      
  } catch (error) {
    console.error("Error:", error);
  }
}


const checkUser = async () => {
  //let email = document.getElementById('email').value
  let userEmail = {
    email: document.getElementById('email').value
  }
 
  let response = await fetch('/check-if-customer-exists', {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
    body: JSON.stringify(userEmail) 
    
  })  
  let answer = await response.json();
  return answer
  }




let customerCheck = document.getElementById('get-all-customers')
customerCheck.addEventListener('click', () => {
  setTimeout( async () => {
    
    let checkForCustomer = await checkUser();
    console.log(checkForCustomer);
    
    if (Object.keys(checkForCustomer).length === 0) {
      newCustomer.style.visibility = 'visible'
      console.log('no customer');
      
      let fullNameDiv = document.createElement("div")
      let fullnameInput = document.createElement("input")
      fullnameInput.name="Name"
      fullnameInput.setAttribute("id", "name")
      fullnameInput.placeholder = "Full name"
      fullnameInput.type ="text"
    
      let adressDiv = document.createElement("div")
      let adressInput = document.createElement("input")
      adressInput.setAttribute("id", "adress")
      adressInput.name="adress"
      adressInput.placeholder = "Adress"
      adressInput.type = "text"
      
      let phoneDiv = document.createElement("div")
      let phoneInput = document.createElement("input")
      phoneInput.setAttribute("id", "telephone")
      phoneInput.name="Telephone"
      phoneInput.placeholder = "Phone Number"
      phoneInput.type = "text"
    
      fullNameDiv.append(fullnameInput)
      adressDiv.append(adressInput)
      phoneDiv.append(phoneInput)
      
      inputContainer.append(fullNameDiv, adressDiv, phoneDiv)

      newCustomer.addEventListener('click', () => {
        customerToCheckout = createUser()
        
        if (customerToCheckout) {
          proceedButton.style.visibility = "visible";
          console.log(customerToCheckout, 'skapade kund');
        }
      })
    } else
    proceedButton.style.visibility = "visible";
    console.log(checkForCustomer, 'kollade kund');
    customerToCheckout = checkForCustomer
    return customerToCheckout
  }, 1000);
  })
  




const createUser = async () => {
  try {
    let customer = {
      email: document.getElementById('email').value,
      name: document.getElementById('name').value,
      phone: document.getElementById('telephone').value
    }

    let response = await fetch("/create-customer", {
      headers: { 'Content-Type': 'application/json' },
      method: "POST",
      body: JSON.stringify(customer)
    })

    let customerId = await response.json()
    return customerId

  } catch (err) {
    console.error("Error:", err);
  }
}

// for form, edit 
function ValidationForm() {
  let username = document.forms["RegForm"]["Name"];
  let email = document.forms["RegForm"]["Email"];
  let phoneNumber = document.forms["RegForm"]["Telephone"];

  let pass = document.forms["RegForm"]["Password"];
  if (username.value == "") {
    alert("Please enter your name.");
    username.focus();
    return false;
  }
  if (email.value == "") {
    alert("Please enter a valid e-mail address.");
    email.focus();
    return false;
  }
  if (email.value.indexOf("@", 0) < 0) {
    alert("Please enter a valid e-mail address.");
    email.focus();
    return false;
  }
  if (email.value.indexOf(".", 0) < 0) {
    alert("Please enter a valid e-mail address.");
    email.focus();
    return false;
  }
  if (phoneNumber.value == "") {
    alert("Please enter your telephone number.");
    phoneNumber.focus();
    return false;
  }


  return true;
}