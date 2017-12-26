# Bitcoin Exchange Rate and Wallet App

## Overview:

Simple MERN app calls Poloniex, Kraken, Wex, Coincap API for latest price of Ethereum, Litecoin, and DASH prices.
Saves real data from API to mongoDB using mongoose. Builds history chart by querying for data from selected api. Creates wallets and generates addresses for sending/receiving funds

## Setting Up:
1. Clone the github 
2. In the project directory, run `npm install` to install dependencies
3. Setup an mLab account with a collection called 'bitcoin', add yourself as a user, define user and password, and replace the    url variables in server.js (shown below)
4. Register for a free token from BlockCypher and add your token to the variable in WalletForm.js
5. in the terminal:
  `npm run start-dev`
  will start the React app and API
6. Install Allow-Control-Allow-Origin * extention in Chrome to access some of the real-time APIs     
   https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
7. go to localhost:3001 in the browser to view the app

## Exchange Rate App:

For styling I used react bootstrap. My mongo database is hosted on mLab. I found it really easy to find a tutorial and set up my mLab for the first time. My mLab database credentials and blockcyper api token is hidden in this public respository and saved as a process variable. On a mac you can do something like this from terminal of your project folder:

`export MONGOLAB_URI="mongodb://<username>:<password>@ds129166.mlab.com:29166/bitcoin';`
  
and in the project code:

`const url = process.env.MONGOLAB_URI;`

It is enough to run mongoDB locally, however, this step is totally extra.

I called real-time ticker APIs to get recent exchange rates between bitcoin(BTC) and altcoins (short for 'bitcoin alternative' which means every cryptocurrency other than bitcoin). The unit price is the inverse of the exchange rate, which is how much of the altcoin is worth 1 bitcoin. The second column is the same unit price multiplied by how many bitcoins the user wanted to exchange. 

Each API's json response had a slightly different structure and I had to tailor each fetch and data-clean methods separately. (I'd like to find a ticker/json crawler that will allow me to treat each call the same). I found the results from each API were almost identical. 

Once I fetch real time data, I save the rates to the state. In this project I noticed setState is asynchronous. It will schedule a shallow merge with previous state. I had setState timing issues because I quickly write and read rates from the state when I am recalculating my display rates. To avoid that race condition I set the state with a function argument, which I will always prefer from now on. :)

When state changes, it changes the input to its children component (rates table, history chart). In react, when input changes it triggers a series of lifecycle stages that will efficiently re-render a page. 

I find this particular lifecycle to be really incredible, and it is the essence of 'react'-ive web:
  1. **componentWillReceiveProps()** - self explanatory
  2. **shouldComponentUpdate()** - this is the meat of React. It draws a 'virtual' DOM, a light version of the real thing, then         compares the new and old, searching for only the exact peices it needs to redraw
  3. **componentWillUpdate()** - If #2 returns true
  4. **componentDidUpdate()** - like a 'final' clause, runs whether or not #2 was true or false

The historical trends chart is displaying the data I have saved in my mongoDB, but filtered by API source. So if user selects Kraken API, only historical data from Kraken is fetched and interpreted by the graph. 

I fetched from my own database for sake of exercise. Obviously I would have more data by calling the real time APIs for historical or other relevant market info, and use stock chart libraries to show more complex displays. This would be appropriate for serious trader apps. The concept behind this one was for someone who simply wanted to exchange once from bitcoin to altcoin for personal use.


## Wallet App:
Uses blockcypher api to create wallets and addresses to send funds to 

on componentDidMount event, loads wallets associated to user's token from BlockCypher API. The account is identified with a string name. Each wallet is looped and displayed in the walletList component. Addresses belong to a wallet, so they are children of a wallet. I used a separate react component to model the wallets and addresses because React does not handle nested loops well. 

Each wallet has features to delete or add an address, their onClick methods are passed down as references to functions defined on the parent component because they are connected to other methods in the parent. If the app goes to any higher level of complexity, I would think of using redux for event management.

To load wallets and their addresses, I first call the API endpoint to load a wallet, then loop through the loaded names and fetch their respective addresses. The API is limited in this way, it is the only way to fetch all addresses of all wallets for the app's initial display.

To create a wallet requires a unique name entered by the user into the text input field. This is a controlled React input form (called 'controlled' because the value of input is stored in the state, and relies on state as the single source of truth, uncontrolled would be using a regular HTML input). The name of the new wallet to be created is passed to the API along with the free token I created when registering to BlockCypher. The API specifies some rules for creating account names, they cannot be duplicated (as they are the key) and cannot start with a number etc. 

Adding a new address is required for every transaction. The app makes an API call that will generate a new address. If the same address is used for receiving funds, someone can track the user's history. A different address will add a layer of privacy.

When an address is generated, it is creating a public-private key pair in Elliptic Curve Digital Signature Algorithm (ECDSA). The public key is hashed several times and becomes the final address. A Bitcoin address is technically a base58 encoded RIPEMD160 hash of a SHA-256 hash of 256-bit public key of an Elliptic Curve Digital Signature Algorithm key pair concatenated with a checksum.[1] The private key is stored in the wallet and needs to be kept safe and used for signing transactions (digital signature). When a user makes a transaction, it is signed with their private key. Other users check that the public key of bitcoins being sent match the private key, and if it is a match it is considered valid and gets on the blockchain. This ensures that the user making the transaction is the actual owner of the bitcoins, and the amount/receiver has not been tampered with (both amount and receiver are encrypted by the signature).

Transactions are also non-repudiable. You cannot claim to have not sent bitcoins if a transaction was made because you are the only owner of the private key. If you lose your private key you lose your bitcoins. The private key is how you prove you own the address containing bitcoins.

The user can also delete a wallet. There are several features around this I can think of that I'd like to implement: checking balance is zero before deleting, for example. (I also want to figure out how to send and receive real bitcoin, or at least find a simulator so I can elaborate on this respository.) Deleting a wallet automatically deletes the addresses. 

I'd also like to give addresses of the wallet aliases or a visually succinct GUI to display timestamp and amounts, since the address codes look too raw.

If I have time, I would add a navigator tab component. I had simple url routing using BrowserRouter component, but I'd like to learn how to integrate it with a nice tab menu design, like one I saw on react-bootstrap.

![img_0838](https://user-images.githubusercontent.com/6289288/34215467-678f9202-e573-11e7-8708-dc59fbae0678.PNG)
![img_0839](https://user-images.githubusercontent.com/6289288/34215468-67a328bc-e573-11e7-9f41-8aab3d86b206.PNG)

## References
1. “Bitcoin Explained Like You’re Five: Part 3 – Cryptography.” Escape Velocity, 29 Sept. 2013,           chrispacia.wordpress.com/2013/09/07/bitcoin-cryptography-digital-signatures-explained/.

