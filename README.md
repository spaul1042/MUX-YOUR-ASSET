This is a decentralized P2P Lending platform aka MUX-UR-ASSET

##Getting Started

##***First of all we will setup the server or the database which is built using mongoose and mongoDb.***

Open the project and head on to the root directory where src and server directories are present

1) Create a free MongoDb cluster on MongoDb Atlas and get the cluster link to connect it with mongoDb Compass/mongoose
2) Follow [MongoDb Atlas](https://www.mongodb.com/cloud/atlas/register) to get the link of your free cluster on MongoDb Atlas
3) Make sure that your username and password present in the cluster link is url encoded, please follow MongoDb Atlas for any problem
4) Once you have the cluster link, inside the server directory, create a .env file, and inside the .env file, store your MongoDb cluster link as:
```
DATABASE_URL = {mongoDb cluster url}
```

5)
Inside a new terminal type these commands:
```
cd server
npm install
npm start
```
This will start the server at port 8000


##***Now when your server is running, its time to setup the frontend or client side:***

1)Open a new terminal and in the root directory of the project where src is present, run these command:
```
npm install
npm run dev
```
This will start the client side server running on port 3000

2) Note that to make things easy and for testing this project, we have provided account details of four account addresses, add these four account addresses on XUMM wallet and start using the project by lending and borrowing in XRP/MUX/XUM tokens using these addresses

***

1) ra26ykT87BwwEriSdyoMbDcKPdaNpRnaoS  (Test)  (The server account, where collateral is stored and for intermediary purposes)
ED5324521054D7FE75DC4039E88F9269ED60568F771C5DD64FEBAD3998ECFF0513
ED38E0A445B866CF83A26FD030969804096019C717F9F28A0668374B21ACAD96AD
sEdVaEKAzKb9YL5aanH4VnSxMbtj82y

2) rM4Dt8ic5T2uzDQvKayYYBNbEUe54j6T6c  (Test2)  (User Test Account 1)
EDA05B172A3A571681FDE9A5C8D3431F7E42C6693F49E6BD03071F351CD2299529
ED7C37A2088209E5C4779BDAF9289FE7E3C1AAFAD5EDF7167D74FCD54FA1CBFC8F
sEdTam4kJgxpCfB5apkPqXoT8YaQJdw

3) rMERCdZG8Co3yqmcvsUk563QMFDyVU3BnF (Test3)  (User Test Account 2)
ED27729720311C4EF205C39AB57F0B905749A3B786C3E0F53A524488675E9B84B5
EDDC6173E82230C064B7B33E6D5C2DB306E31FD7236084D8B8E5F2A067AC8E5CEF
sEdTskLnmN6XVoQVsyUYF7E7gXLiEQx

4) rph8nukqhbkdRLk2L7XcrzM49uMgMNm47M (Test4)  (User Test Account 3)
ED3DB98CC3B3490AF561A6ADC6E8B387F042F0625F00A8CFDEED14512A1E4BFA2B
EDD19CD64658938BDA0F6C43A9C019FC81D9DCD920789443F43CCAD6975C6FCD34
sEdSLd9Xz8qpvdnJEMX3qWjYukSfHdD

***


3) Also dont change the server and client port numbers >> 8000 and 3000 respectively


# More on how to test the platform!

## Points to Note 
i) As a borrower, you have to register your account, without which you cannot borrow or place a loan request
ii) As a borrower, you have to deposit sufficient collateral to borrow. All three tokens (MUX, XRP, XUM) are considered of same value, this means that if you want to borrow x amount of token A using some staked collateral of token B, then your collateral balance for token B must be greater than equal to x, when you dpeosit collateral , XRP transaction will happeen , and you will have to transfer collateral token to  teh server account ra26ykT87BwwEriSdyoMbDcKPdaNpRnaoS.
iii) Once your account address is registered and you have sufficient collateral balance, you can place and track any loan requests. ALso , you can pay back a loan after which you have to sign a series of payment transactions to all the funders of your loan. 
iv) As a lender, there is no need to register your account, simply filter loans according to which currency code you want to fund and finally fund a bucket of chosen loans after which you have to sign a series of payment transactions to all the borrowers you wanna fund. The lender can also track funded loans.

