import base58 from 'bs58';
import buf from 'buffer';
import { ec as EC } from 'elliptic';
import { getRandomValues } from './get-random-values';
import { sha256 } from 'js-sha256';

export default class ECDSA {
  #ec: EC;

  #keyPair: EC.KeyPair;

  #publicKey: number[];

  constructor() {
    this.#ec = new EC('secp256k1');

    this.#keyPair = this.#ec.genKeyPair({
      entropy: getRandomValues(new Uint8Array(192)),
    });

    this.#publicKey = this.#keyPair.getPublic('array');
  }

  /**
   * Return Base58 encoded publicKey
   */
  get publicKey(): string {
    const pkey = buf.Buffer.from(this.#publicKey);

    return base58.encode(pkey);
  }

  /**
   * Return Base58 encoded message signature
   * @param message will be hashed by using SHA256
   */
  public sign(message: string): string {
    if (!message) throw new TypeError('The message not defined');
    if (typeof message !== 'string')
      throw new TypeError('The message must be a string');

    const digest = sha256.update(message).digest();
    const signature = this.#keyPair.sign(buf.Buffer.from(digest));

    return base58.encode(signature.toDER());
  }

  /**
   * Return message verified with the signature
   * @param message Message for verifying with the signature
   * @param signature Base58 encoded signature of the message
   * @param [publicKey] Optional, Base58 encoded public key
   */
  public verify(
    message: string,
    signature: string,
    publicKey?: string
  ): boolean {
    const digest = sha256.update(message).digest();
    const sig = base58.decode(signature);

    let currentKey;

    if (typeof publicKey === 'string') {
      try {
        currentKey = this.#ec.keyFromPublic(base58.decode(publicKey));
      } catch (err) {
        if (err.message === 'Non-base58 character')
          throw new TypeError(
            'Public key must be a valid Base58 encoded string'
          );
        else return false;
      }
    } else {
      currentKey = this.#keyPair;
    }

    return currentKey.verify(digest, sig);
  }
}
