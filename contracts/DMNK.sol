// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

enum GameStatus {
    Alice,
    Bob,
    Running,
    Pending
}

struct AddressPair {
    address payable main;
    address operational;
}

struct Move {
    int8 x;
    int8 y;
}

struct GameState {
    Move[] movesAlice;
    Move[] movesBob;
}

struct GameInstance {
    AddressPair alice;
    AddressPair bob;
    GameStatus status;
}

enum JoinAction {
    CreateNewGame, StartNewGame
}


struct JoinStatus {
    JoinAction action;
    uint256 gameId;
}


struct LookupResult {
    uint256 index;
    bool success;
}


contract DMNK {
    GameInstance[] games;
    address payable minter;

    event GameCreated(uint256 gameId, address alice, address bob);
    event GameStarted(uint256 gameId, address alice, address bob);

    function getFirstPendingGame(address actor) public view returns (LookupResult memory) {
        for (uint256 index=0; index < games.length; index++) {
            if (games[index].status == GameStatus.Pending && games[index].alice.main != actor) {
                return LookupResult({index: index, success: true});
            }
        }
        return LookupResult({index: 0, success: false});
    }

    function joinGame(address operational) payable public {
        LookupResult memory maybeGame = getFirstPendingGame(msg.sender);
        if (!maybeGame.success) {
            games.push(
                GameInstance({
                    alice: AddressPair(payable(msg.sender), operational),
                    bob: AddressPair(payable(address(0)), address(0)),
                    status: GameStatus.Pending
                })
            );
            emit GameCreated({gameId: games.length - 1, alice: msg.sender, bob: address(0)});
        }
        else {
            GameInstance storage game = games[maybeGame.index];
            game.bob = AddressPair(payable(msg.sender), operational);
            game.status = GameStatus.Running;
            emit GameStarted({gameId: maybeGame.index, alice: game.alice.main, bob: msg.sender});
        }
    }

    constructor() {
        minter = payable(msg.sender);
    }
}
