pragma circom 2.0.0;

include "./ElGamalDecrypt.circom";
include "./QuinSelector.circom";

template VerifyRole(numberOfPlayers) {
    // This has the following format:
    // [[player0C1X, player0C1Y player0C2X, player0C2Y],[player1C1X, player1C1Y player1C2X, player1C2Y]...]
    signal input encryptedRoles[numberOfPlayers][4];
    signal input index;

    signal input privKey;
    signal input publicIdentity;

    signal output roleX;
    signal output roleY;

    component decrypter = ElGamalDecrypt();

    component selectors[4];

    for (var selectorIndex = 0; selectorIndex < 4; selectorIndex++) {
        selectors[selectorIndex] = QuinSelector(numberOfPlayers);
        selectors[selectorIndex].index <== index;
    }

    for (var playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
        for (var selectorIndex = 0; selectorIndex < 4; selectorIndex++) {
            selectors[selectorIndex].in[playerIndex] <== encryptedRoles[playerIndex][selectorIndex];
        }
    }

    decrypter.c1[0] <== selectors[0].out;
    decrypter.c1[1] <== selectors[1].out;
    decrypter.c2[0] <== selectors[2].out;
    decrypter.c2[1] <== selectors[3].out;

    decrypter.privKey <== privKey;

    publicIdentity * 0 === 0;

    roleX <== decrypter.outX;
    roleY <== decrypter.outY;
}

component main {public [encryptedRoles, publicIdentity]} = VerifyRole(16);