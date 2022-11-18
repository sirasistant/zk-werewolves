import ElGamal from '../../crypto/elGamal';
import { compileAndLoadCircuit, executeCircuit, getSignalByName } from './testUtils';

jest.setTimeout(30_000);

describe('Verify role circuit', ()=>{
  let circuit: any;
  let elGamal: ElGamal;

  beforeAll(async ()=>{
    circuit = await compileAndLoadCircuit('VerifyRole.circom');
    elGamal = await ElGamal.build();
  });

  it('should be able to output the decrypted role', async () => {
    const playerCount = 16;

    // Random points
    const roles = new Array(playerCount).fill(null).map(()=> elGamal.genPubKey(elGamal.genPrivKey()));
    
    const keys = new Array(playerCount).fill(null).map(()=> elGamal.genPrivKey());

    const encryptedRoles = roles.map((role, index) => {
      const pubKey = elGamal.genPubKey(keys[index]);
      return elGamal.encrypt(role, pubKey);
    });

    const formattedEncryptedRoles = encryptedRoles.reduce((acc: bigint[][], role)=>{
      acc.push([...elGamal.pointToBI(role.c1), ...elGamal.pointToBI(role.c2)]);
      return acc;
    }, []);

    for (let i = 0; i < playerCount; i++) {
      const circuitInputs = {
        encryptedRoles: formattedEncryptedRoles,
        index: i,
        privKey: elGamal.formatPrivKeyForBabyJub(keys[i]),
        publicIdentity: 27,
      };

      const witness = await executeCircuit(circuit, circuitInputs);
      const roleX = getSignalByName(circuit, witness, 'main.roleX'); 
      const roleY = getSignalByName(circuit, witness, 'main.roleY'); 
      expect([roleX, roleY]).toEqual(elGamal.pointToBI(roles[i]));
    }
  });

});