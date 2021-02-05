## Smart scooter eth
Ethereum contracts for managing scooter renting. Allows clients to check states of scooters and rent them if they have active subscription. Currently only a PoC project.

### Requirements
* node v11.15.0
* npm v6.7.0
* truffle v5.1.63
* ganache v6.12.2

### Getting started
Install dependencies and generate typings
```bash
yarn
```
Compile all contracts
```bash
truffle compile
```
#### Testing
Run ganache on port 8545
```bash
ganache-cli -p 8545
```
Run tests
```bash
truffle test
```