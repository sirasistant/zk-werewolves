import * as assert from 'assert';
import * as ff from 'ffjavascript';
import { buildBabyjub, buildEddsa, buildPoseidon }  from 'circomlibjs';
import crypto from 'crypto-browserify';

export type BabyJubPoint = Uint8Array[];
export type PrivKey = Uint8Array;
export type PubKey = BabyJubPoint;

const SNARK_FIELD_SIZE = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617',
);

export default class ElGamal {
  static async build() {
    return new ElGamal(await buildBabyjub(), await buildEddsa(), await buildPoseidon());
  }

  private babyJub;

  private eddsa;

  private poseidon;

  private F;
  
  constructor(babyJub : any, eddsa:any, poseidon: any) {
    this.babyJub = babyJub;
    this.eddsa = eddsa;
    this.poseidon = poseidon;
    this.F = babyJub.F;
  }

  genRandomBabyJubValue(): BigInt  {
    const min = BigInt('6350874878119819312338956282401532410528162663560392320966563075034087161851');

    let rand;
    while (true) {
      rand = BigInt('0x' + crypto.randomBytes(32).toString('hex'));

      if (rand >= min) {
        break;
      }
    }

    const randomValue: BigInt = rand % SNARK_FIELD_SIZE;
    assert.ok(randomValue < SNARK_FIELD_SIZE);

    return randomValue;
  }

  genPrivKey(): PrivKey  {
    return this.F.e(this.genRandomBabyJubValue());
  }

  genRandomSalt(): PrivKey {
    return this.F.e(this.genRandomBabyJubValue());
  }

  formatPrivKeyForBabyJub(privKey: PrivKey) {
    const sBuff = this.eddsa.pruneBuffer(
      Buffer.from(
        this.hash(privKey).toString(16),
      ).slice(0, 32),
    );

    const s = ff.utils.leBuff2int(sBuff);
    return ff.Scalar.shr(s, 3);
  }

  genPubKey(privKey: PrivKey): PubKey  {
    assert.ok(BigInt(this.F.toString(privKey, 10)) < SNARK_FIELD_SIZE);

    const pubKey = this.babyJub.mulPointEscalar(
      this.babyJub.Base8,
      this.formatPrivKeyForBabyJub(privKey),
    );

    assert.ok(pubKey.length === 2);
    assert.ok(this.elementToBI(pubKey[0]) < SNARK_FIELD_SIZE);
    assert.ok(this.elementToBI(pubKey[1]) < SNARK_FIELD_SIZE);

    return pubKey;
  }
  
  encrypt(
    point : BabyJubPoint,
    pubKey : PubKey,
    randomVal = this.genRandomBabyJubValue(),
  ) {
    const c1Point = this.babyJub.mulPointEscalar(this.babyJub.Base8, randomVal);
  
    const pky = this.babyJub.mulPointEscalar(pubKey, randomVal);
    const c2Point = this.babyJub.addPoint(
      point,
      pky,
    );
  
    return { c1: c1Point, c2: c2Point };
  }
  
  decrypt(privKey : PrivKey, c1 : BabyJubPoint, c2: BabyJubPoint ) : BabyJubPoint {
    const c1x = this.babyJub.mulPointEscalar(
      c1,
      this.formatPrivKeyForBabyJub(privKey),
    );
  
    const c1xInverse = [
      this.F.e(this.elementToBI(c1x[0]) * BigInt(-1)),
      c1x[1],
    ];
    
    return this.babyJub.addPoint(c1xInverse, c2);
  }
  
  rerandomize(
    pubKey: PubKey,
    c1 : BabyJubPoint,
    c2 : BabyJubPoint,
    randomVal = this.genRandomBabyJubValue(),
  ) {
    const d1 = this.babyJub.addPoint(
      this.babyJub.mulPointEscalar(this.babyJub.Base8, randomVal),
      c1,
    );
  
    const d2 = this.babyJub.addPoint(
      this.babyJub.mulPointEscalar(pubKey, randomVal),
      c2,
    );
  
    return { c1: d1, c2: d2 };
  }

  elementToBI(element: Uint8Array) {
    return BigInt(this.F.toString(element, 10));
  }

  pointToBI(point: BabyJubPoint) {
    return point.map((coordinate:Uint8Array) => this.elementToBI(coordinate));
  }

  private hash(preImage: Uint8Array) {
    return this.poseidon([preImage, this.F.e(BigInt(0))]);
  }
}
  