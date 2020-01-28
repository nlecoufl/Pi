geth --datadir "./db" --networkid 1234 --rpc --rpcport "8545" --rpccorsdomain "*" --nodiscover --rpcapi="admin,db,eth,net,web3,personal,txpool,miner"

geth --etherbase '0xA08960F491c5caFac2029de4875Ce61309722a8b' --mine
