# PI2

## 1 - Installations
### Ethereum
#### Linux
    sudo add-apt-repository -y ppa:ethereum/ethereum
    sudo apt-get update
    sudo apt-get install ethereum
#### Windows
Il suffit de télécharger l'éxecutable trouvable ici : https://geth.ethereum.org/downloads/
#### Mac
Il faut avoir installer homebrow puis:

    brew tap ethereum/ethereum
    brew install ethereum
    
### MongoDB (Linux)
Importer la clé publique :

    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 68818C72E52529D4
Ajouter la ligne "deb http://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" à mongodb-org-4.0.list :

    sudo echo "deb http://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
    
Installer :

    sudo apt-get update
    sudo apt-get install -y mongodb-org
Lancer mongodb :

    sudo service mongod start 
    mongo
    
### Nodejs/npm (Linux)
A saisir dans un terminal, on utilise ici la commande apt-get (source: https://doc.ubuntu-fr.org/nodejs):

    sudo apt-get install nodejs npm

## 2 - Paramètrage Blockchain
D'abord cloner le repo dans le repo de votre choix :

    git clone https://github.com/nlecoufl/Pi/
    cd Pi
Pour démarrer notre blockchain privée, nous devons créer le tout premier bloc, le bloc Genesis, le seul qui ne sera pas lié à un bloc précédent.
Le fichier de configuration de ce bloc se trouve ici
--> [genesis.json](https://github.com/nlecoul/PI2/master/genesis.json)

Ensuite il suffit de lancer la commande suivante :

    geth --datadir "./db" init genesis.json
Celle-ci indiquera à Geth d’utiliser le répertoire data pour stocker la database de la blockchain et le fichier keystore, avec les paramètres du genesis.json.

Puis pour lancer la blockchain :

    geth --datadir "./db" --networkid 1234 --rpc --rpcport "8545" --rpccorsdomain "*" --nodiscover --rpcapi="admin,db,eth,net,web3,personal,txpool,miner"
    
Si vous regardez en détail la commande ci dessus, vous verrez qu’elle contient le lancement de plusieurs API (rpcapi=..) que nous allons utiliser ensuite, avec principalement:

- admin : qui va nous permettre de gérer notre noeud de blockchain
- personal : pour créer nos premiers utilisateurs donc nos premières adresse ethereum de notre blockchain privée
- eth : pour récupérer des informations sur les utilisateurs, par exemple le nombre d’ether sur un compte, ce que nous pourrons aussi faire avec web3 qui fait aussi partie des api.
- miner : pour démarrer le minage des blocs
- txpool : pour vérifier si des transactions sont en attente de validation

## 3 - Utilisation console
Avant de lancer l'application, ouvrons un nouveau terminal et connectons nous à la blockchain:

    geth attach http://127.0.0.1:8545
Pour commencer à miner, il faut définir le compte par défaut qui recevra les ether avec le plugin ‘miner’ :

    miner.setEtherbase("0xA08960F491c5caFac2029de4875Ce61309722a8b")
Le solde du compte par défaut est encore à 0 :

    eth.getBalance(eth.coinbase)
Démarrons donc le minage :

    miner.start()
Au tout premier lancement de nombreuses informations s’afficheront dans la console, laissez faire quelques minutes.

Vous pouvez ensuite couper le mineur (mais il sera nécessaire pour faire fonctionner l'application):

    miner.stop()
Puis redemander le solde du compte par défaut qui doit maintenant être bien supérieur à 0 :

    eth.getBalance(eth.coinbase)
L’autre moyen de vérifier que votre mineur tourne bien est de lancer la commande eth.hashrate qui affichera le hashrate de votre blockchain privée.

## 4 - Back-end / Front-End
    
### Lancement interface
    
    cd myapp
    DEBUG=myapp:* npm start
    
L'application contient plusieurs onglets : 
* Home : Simple page d'accueil.
* Admin : Page d'administration permettant d'envoyer les produits. Les transactions sont envoyés sur la blockchain ethereum, et les informations de ces transactions sont enregistrées en parallèle sur MongoDB.
* Workflow : Page permettant de visualiser l'historique d'un workflow.
* Analysis (EN COURS) : Page permettant d'analyser, par exemple, la moyenne des temps de trajet entre deux acteurs du workflow.
* About Us
* Contact Us
