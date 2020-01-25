var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
const rpcURL = 'http://localhost:8545'; // Your RPC URL goes here
const web3 = new Web3(rpcURL);
const Common = require('ethereumjs-common').default;
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient ;
const url = "mongodb://localhost:27017" ;

const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'Testchain',
    networkId: 1234,
    chainId: 1234,
  },
  'petersburg',
)

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var workflowRouter = require('./routes/workflow');
var contactRouter = require('./routes/contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/workflow', workflowRouter);
app.use('/contact', contactRouter);

//-------------------------------------------------------------------TESTS ICI-----------------------------------------------------------------------//
// add a document to the DB collection recording the click event


// get the click data from the database
app.get('/admin/clicks', (req, res) => {
  var account=web3.eth.accounts.create();
  res.send(account);
});

// post balance
app.post('/admin/balance', function(req,res){
  web3.eth.getBalance(req.body.addr).then(function(bal) {
  res.send("Balance : "+ web3.utils.fromWei(bal, 'ether')+ " ETH");
  });
})

app.post('/admin/claim',function(req,res){
  /* var myAddress = '0xA08960F491c5caFac2029de4875Ce61309722a8b';//'ADDRESS_THAT_SENDS_TRANSACTION'; 0xd226f52C8772092ae3E75dc49983f094d3e68b5C
  var privateKey = new Buffer.from('91b03656521a2778dfe8b0d85e7b7db419095748cd4fa0635c22b26e190fd9f7', 'hex')
  var toAddress = '0xCb936F00b9eb877B1d877f8fF4Fd2d6Dc776eE44';//Address to which sending transaction. privk='0x6df4f2bbdb6e6fcbc80f418096e26a85e7a678dae005e7b90e54b02faac027b4'
  var amount = 1000000000000000000 //in wei */
  var myAddress = req.body.from;
  var id_product = req.body.id_product;
  var id_shipping = req.body.id_shipping;

  var amount = req.body.amount*1e18;
  var faucetAddress = '0xA08960F491c5caFac2029de4875Ce61309722a8b';
  var privateKey = new Buffer.from('91b03656521a2778dfe8b0d85e7b7db419095748cd4fa0635c22b26e190fd9f7', 'hex');

  web3.eth.getTransactionCount(faucetAddress).then(function(v){
      console.log("Count: "+v);
      count = v;
      //creating raw transaction
      var rawTransaction = {"from":faucetAddress, "gasPrice":web3.utils.toHex(20* 1e9),"gasLimit":web3.utils.toHex(210000),"to":myAddress,"value":web3.utils.toHex(amount),"data":"0x0","nonce":web3.utils.toHex(count)}
      //creating tranaction via ethereumjs-tx
      var transaction = new Tx(rawTransaction,{common: customCommon});
      //signing transaction with private key
      transaction.sign(privateKey);
      //sending transacton via web3js module
      web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
      /*.then(function (x){
        console.log(x);
      });*/
      .then(function (x){      
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        var transactionobj = { "hash": x.transactionHash, "from":faucetAddress, "to":myAddress, "id_shipping":id_shipping, "amount":amount};
        web3.eth.getBlock(x.blockNumber)
        .then(function(time) {          
          var statusobj = {"hash": x.transactionHash, "id_produit":id_product, "id_shipping":id_shipping, "date_envoi": time.timestamp, "date_recu":time.timestamp};
          // var myobj =  { "hash" : "0xaf2369c9e1a6f81e6bed8eaf431e09ac8792b8d9b26a68e24a6b03db4a7eb306", "from" : "0xA08960F491c5caFac2029de4875Ce61309722a8b", "to" : "0xCb936F00b9eb877B1d877f8fF4Fd2d6Dc776eE44"};
          dbo.collection("Transactions").insertOne(transactionobj, function(err, res) {
            if (err) throw err;
            console.log("Transactions inserted!");
          });
          dbo.collection("Status").insertOne(statusobj, function(err, res) {
            if (err) throw err;
            console.log("Status inserted!");
            db.close();
          });
        });
      });
    });
      res.redirect('/admin');
  })
})
//send tx
app.post('/admin/sendtx',function(req,res){
  /* var myAddress = '0xA08960F491c5caFac2029de4875Ce61309722a8b';//'ADDRESS_THAT_SENDS_TRANSACTION'; 0xd226f52C8772092ae3E75dc49983f094d3e68b5C
  var privateKey = new Buffer.from('91b03656521a2778dfe8b0d85e7b7db419095748cd4fa0635c22b26e190fd9f7', 'hex')
  var toAddress = '0xCb936F00b9eb877B1d877f8fF4Fd2d6Dc776eE44';//Address to which sending transaction. privk='0x6df4f2bbdb6e6fcbc80f418096e26a85e7a678dae005e7b90e54b02faac027b4'
  var amount = 1000000000000000000 //in wei */
  var myAddress = req.body.from;
  var privateKey = new Buffer.from(req.body.privatekey, 'hex');
  var toAddress = req.body.to;
  var date_envoi = req.body.date_envoi;
  var amount = req.body.amount*1e18;
  var id_shipping = req.body.id_shipping;
  var id_product = req.body.id_product;


  web3.eth.getTransactionCount(myAddress).then(function(v){
      console.log("Count: "+v);
      count = v;
      //creating raw tranaction
      var rawTransaction = {"from":myAddress, "gasPrice":web3.utils.toHex(20* 1e9),"gasLimit":web3.utils.toHex(210000),"to":toAddress,"value":web3.utils.toHex(amount),"data":"0x0","nonce":web3.utils.toHex(count)}
      console.log(rawTransaction);
      //creating tranaction via ethereumjs-tx
      var transaction = new Tx(rawTransaction,{common: customCommon});
      //signing transaction with private key
      transaction.sign(privateKey);
      //sending transacton via web3js module
      web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
      /*.then(function (x){
        console.log(x);
      });*/
      .then(function (x){      
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        var transactionobj = { "hash": x.transactionHash, "from":myAddress, "to":toAddress, "id_shipping":id_shipping, "amount":amount};
        web3.eth.getBlock(x.blockNumber)
        .then(function(time) {          
          var statusobj = {"hash": x.transactionHash, "id_produit":id_product, "id_shipping":id_shipping, "date_envoi": date_envoi, "date_recu":time.timestamp};
          // var myobj =  { "hash" : "0xaf2369c9e1a6f81e6bed8eaf431e09ac8792b8d9b26a68e24a6b03db4a7eb306", "from" : "0xA08960F491c5caFac2029de4875Ce61309722a8b", "to" : "0xCb936F00b9eb877B1d877f8fF4Fd2d6Dc776eE44"};
          dbo.collection("Transactions").insertOne(transactionobj, function(err, res) {
            if (err) throw err;
            console.log("Transactions inserted!");
          });
          dbo.collection("Status").insertOne(statusobj, function(err, res) {
            if (err) throw err;
            console.log("Status inserted!");
            db.close();
          });
        });
      });
    });
      res.redirect('/admin');
  })
})

//----------------------------------------------------------------------------------------------------------------------------------------------------//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
