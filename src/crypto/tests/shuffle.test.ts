import { commutativeDecrypt, EncryptedValue } from '../commutativeEncrypt';
import ElGamal from '../elGamal';
import Shuffle from '../shuffle';

jest.setTimeout(30_000);

interface PlayerData {
  shuffler: Shuffle,
  localCards? : EncryptedValue[]
}

describe('Shuffle utilities', ()=>{
  it('should serialize and deserialize cyphers', async ()=>{
    const elGamal = await ElGamal.build();
    const shuffler = new Shuffle(elGamal, 1, 0);
    shuffler.prepare(2);

    const cyphers = shuffler.encryptCardsForShuffle(shuffler.getTokens());

    expect(shuffler.deserializeCyphers(shuffler.serializeCyphers(cyphers))).toEqual(cyphers);
  });

  it('one player two cards shuffle', async ()=>{
    const elGamal = await ElGamal.build();
    const shuffler = new Shuffle(elGamal, 1, 0);
    shuffler.prepare(2);

    const tokens = shuffler.getTokens();

    let cyphers  = shuffler.shuffle(shuffler.encryptCardsForShuffle(tokens));

    const encryptedForDeal = shuffler.replaceEncryptionForDealing(cyphers);
    
    const plaintexts =  encryptedForDeal.map((cypher, index) => {
      return commutativeDecrypt(elGamal, cypher, shuffler.getDealKey(index), 0).c2;
    });

    expect(plaintexts).toEqual(expect.arrayContaining(tokens));
  });

  it('should do a shuffle round where every player receives one face down card', async ()=>{
    const PLAYERS = 5;
    const CARDS = 5;
    const elGamal = await ElGamal.build();
    
    const players = Array(PLAYERS).fill(null).map((_, index): PlayerData => ({
      shuffler: new Shuffle(elGamal, PLAYERS, index),
    }));

    // First player generates tokens and shares with everyone
    const firstPlayerData = players[0];
    firstPlayerData.shuffler.prepare(CARDS);

    // everyone sets the tokens
    const tokens = firstPlayerData.shuffler.getTokens();
    players.forEach(player => player.shuffler.setRemoteTokens(tokens));

    // everybody shares shuffle keys
    const keys = players.map(player=>player.shuffler.getShuffleKey());
    players.forEach(player => keys.forEach((key, position)=> player.shuffler.addRemoteShuffleKey(key, position)));

    // Everbody shuffles and passes the deck to the next player
    let cyphers : EncryptedValue[] | undefined;

    for (const currentPlayer of players) {
      cyphers = currentPlayer.shuffler.shuffle(
        currentPlayer.shuffler.encryptCardsForShuffle(cyphers || tokens),
      );
    }

    let cyphersForEncrypt : EncryptedValue[] = cyphers!;

    // Everybody encrypts the cyphers for deal
    for (const currentPlayer of players) {
      cyphersForEncrypt = currentPlayer.shuffler.replaceEncryptionForDealing(cyphersForEncrypt);
    }

    const serializedCyphers = firstPlayerData.shuffler.serializeCyphers(cyphersForEncrypt);

    // Everybody stores the completely encrypted deck
    for (const currentPlayer of players) {
      currentPlayer.localCards = currentPlayer.shuffler.deserializeCyphers(serializedCyphers);
    }

    // Every player receives the keys for their card from all other players
    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      const currentPlayer = players[playerIndex];

      for (let anotherPlayerIndex = 0; anotherPlayerIndex < players.length; anotherPlayerIndex++) {
        const anotherPlayer = players[anotherPlayerIndex];
        
        if (playerIndex !== anotherPlayerIndex) {
          currentPlayer.localCards![playerIndex] = commutativeDecrypt(
            elGamal, 
            currentPlayer.localCards![playerIndex], 
            anotherPlayer.shuffler.getDealKey(playerIndex), 
            anotherPlayerIndex);
        }
      }
    }

    // Now the deck is dealt, and every player should be able to see only their own card 
    const plaintexts = players.map(({ localCards, shuffler }, playerPosition)=>{
      return commutativeDecrypt(elGamal, localCards![playerPosition], shuffler.getDealKey(playerPosition), playerPosition).c2;
    });

    expect(plaintexts).toEqual(expect.arrayContaining(tokens));
  });

});