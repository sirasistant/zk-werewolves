import { commutativeEncrypt, EncryptedValue, replaceEncryption, rerandomizeEncryption } from './commutativeEncrypt';
import ElGamal, { BabyJubPoint, PrivKey, PubKey } from './elGamal';
import shuffle from 'fisher-yates';

export type Tokens = BabyJubPoint[];

export default class Shuffle {
  private elGamal: ElGamal;

  private shuffleKey: {
    publicKey : PubKey,
    privateKey : PrivKey,
  };

  private dealKeys?: PrivKey[];

  private localPosition: number;

  private peersShuffleKeys: PubKey[];

  constructor(elGamal: ElGamal, totalPlayers: number, localPosition: number) {
    this.elGamal = elGamal;
    const privKey = this.elGamal.genPrivKey();
    const pubKey = this.elGamal.genPubKey(privKey);
    this.shuffleKey = {
      publicKey: pubKey,
      privateKey: privKey,
    };
    this.peersShuffleKeys = Array(totalPlayers).fill(undefined);
    this.localPosition = localPosition;
    this.peersShuffleKeys[this.localPosition] = this.shuffleKey.publicKey;
  }

  prepare(howManyCards: number): Tokens {
    return Array(howManyCards).fill(null).map(() => this.elGamal.genPubKey(this.elGamal.genPrivKey()));
  }

  getShuffleKey() {
    return this.shuffleKey.publicKey;
  }

  addRemoteShuffleKey(remoteKey: PubKey, peerPosition: number) {
    this.peersShuffleKeys[peerPosition] = remoteKey;
  }

  encryptCardsForShuffle(cyphers: EncryptedValue[] | Tokens) {
    return cyphers.map((cypher) => {
      if (this.localPosition > 0 && 'c1List' in cypher) {
        const previousPeerIndex = this.localPosition - 1;
        cypher = rerandomizeEncryption(this.elGamal, cypher, this.peersShuffleKeys[previousPeerIndex], previousPeerIndex);
      }
      return commutativeEncrypt(this.elGamal, cypher, this.shuffleKey.publicKey);
    });
  }

  shuffle(sourceCyphers : EncryptedValue[]) : EncryptedValue[] {
    return shuffle(sourceCyphers);
  }

  replaceEncryptionForDealing(cyphers: EncryptedValue[]) {
    this.dealKeys = cyphers.map(()=> this.elGamal.genPrivKey());

    return cyphers.map((cypher, index) =>
      replaceEncryption(this.elGamal, cypher, this.shuffleKey.privateKey, this.elGamal.genPubKey(this.dealKeys![index]), this.localPosition),
    );
  }

  serializeCyphers(cyphers: EncryptedValue[]) {
    return JSON.stringify(cyphers, (key, value)=>{
      if (Array.isArray(value) && value.length === 2 && value.every(item => item instanceof Uint8Array)) {
        return value.map(item => this.elGamal.elementToBI(item).toString(10));
      }
      return value;
    });
  }

  deserializeCyphers(serializedCyphers: string) : EncryptedValue[] {
    const parsed = JSON.parse(serializedCyphers);
    return parsed.map((cypher: any): EncryptedValue => ({
      c1List: cypher.c1List.map((item:string[]) => item.map((coordinate:string) => this.elGamal.bigIntToElement(BigInt(coordinate)))),
      c2: cypher.c2.map((coordinate:string)=>this.elGamal.bigIntToElement(BigInt(coordinate))),
    }));
  }

  getDealKey(cardIndex : number) {
    if (!this.dealKeys) {
      throw new Error('Not dealt yet');
    }
    return this.dealKeys[cardIndex];
  }
}