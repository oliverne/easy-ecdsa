import base58 from 'bs58';
import Long from 'long';
import { Buffer as Buf } from 'buffer';
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
    const pkey = Buf.from(this.#publicKey);

    return base58.encode(pkey);
  }

  /**
   * Return Base58 encoded message signature
   * @param message will be hashed by using SHA256
   */
  public sign(message: string | (string | number)[]): string {
    if (!message) throw new TypeError('The message not defined');

    if (typeof message === 'string') {
      return this.getBase58Signature(message);
    } else if (this.validMessageArray(message)) {
      const combined = this.arrayToBuffers(message);
      return this.getBase58Signature(combined);
    } else {
      throw new TypeError(
        'The message must be a string or an array of string or number'
      );
    }
  }

  /**
   * Return message verified with the signature
   * @param message Message for verifying with the signature
   * @param signature Base58 encoded signature of the message
   * @param [publicKey] Optional, Base58 encoded public key
   */
  public verify(
    message: string | (string | number)[],
    signature: string,
    publicKey?: string
  ): boolean {
    let context;

    if (typeof message === 'string') {
      context = message;
    } else if (this.validMessageArray(message)) {
      context = this.arrayToBuffers(message);
    } else {
      throw new TypeError(
        'The message must be a string or an array of string or number'
      );
    }

    const digest = sha256.update(context).digest();
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

  /**
   * Convert an array to concatenated Buffer.
   * Currently, every number is treated as unsigned integer
   * @param items an array of string or number
   */
  private arrayToBuffers(items: (string | number)[]) {
    const buffs = items.map((item) => {
      if (typeof item === 'number') {
        return Buf.from(Long.fromNumber(item, true).toBytesLE());
      } else {
        return Buf.from(item);
      }
    });

    return Buf.concat(buffs);
  }

  private getBase58Signature(message: string | Buffer) {
    const digest = sha256.update(message).digest();
    const signature = this.#keyPair.sign(Buf.from(digest));

    return base58.encode(signature.toDER());
  }

  private validMessageArray(message: any) {
    const passed =
      Array.isArray(message) &&
      message.every(
        (msg) => typeof msg === 'string' || typeof msg === 'number'
      );

    return passed;
  }
}
