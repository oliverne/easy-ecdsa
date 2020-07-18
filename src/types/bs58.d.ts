declare module 'bs58' {
  declare function encode(input: Buffer | number[] | Uint8Array): string;
  declare function decode(input: string): Buffer | number[] | Uint8Array;
}
