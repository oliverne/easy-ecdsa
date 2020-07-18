# @oliverne/easy-ecdsa

Easy & Simple ECDSA(Elliptic Curve Digital Signature Algorithm) Signer/Verifier for who has a headache.

It can works on React Native apps. without installing native dependencies.

## Features

- Super easy but not configurable
- Shipped with TypeScript declaration
- Pure JS implementation due to other great libraries
- It works on NodeJS, browsers and even React Native
  > But for performance reasons, you have some better alternatives for NodeJS.

## Security

- It DOESN'T rely on NodeJS `crypto.randombytes()` and `window.crypto.getRandomValues()` So it is NOT considered cryptographically secured.

- Instead of native crypto API, it depends on [seedrandom](https://github.com/davidbau/seedrandom) to creates random values based on ARC4-based PRNG.

- A message for signing is hashed by using SHA256. Although the output is Base58 encoded string, it is not "Double Hashing" and neither compatible with the formats used by crypto currency.

## Install

`npm install @oliverne/easy-ecdsa`

OR

`yarn add @oliverne/easy-ecdsa`

## Usage

```js
import { ECDSA } from 'easy-ecdsa';

const signer = new ECDSA();
const message = 'My precious message';
const sig = signer.sign(message);

console.log('Public key:', signer.publicKey); // output: Base58 encoded public key string

console.log('Message:', message);

console.log('Signature:', sig); // output: Base58 encoded signature string derived from the message digest hashed by SHA256

console.log('Verified with own public key:', signer.verify(message, sig)); // output: true

console.log(
  'Verified with a foreign public key:',
  signer.verify(message, sig, 'WrQng9999PubKey') // output: false
);
```

## Compatibility

Tested on:

- NodeJS >= 12
- Latest browsers that fully support ES2015, Not IE
- React Native >=0.62

## Fun Facts

- I don't understand Elliptic curve. 📈
- I don't know anything about crypto. 🔐
- It was built for providing a client-side message signature working on React Native without native dependencies. 🤣
