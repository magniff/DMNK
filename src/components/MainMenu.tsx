import { Component, FunctionComponent, useEffect, useRef, useState } from "react";
import { Container, Button, Col, Row, Form, Stack, Spinner } from "react-bootstrap";
import { Contract } from "web3-eth-contract";


import "./common.css";


import { Account, WalletBase } from "web3-core";
import Web3 from "web3";


enum CurrentScreen {
  Main, ConstructGame
}


type CommonProps = {
  web3Instance: Web3,
  dmnkContract: Contract,
  getWallet: () => WalletBase | null,
  setWallet: (wallet: WalletBase) => void,
};


type MainMenuState = { screen: CurrentScreen, gameSettings: GameSettings | null };


const asciiLogo = <pre className="col-md-7 mx-auto logo">
  {`
8 888888888o.               ,8.       ,8.          b.             8 8 8888     ,88' 
8 8888    \`^888.           ,888.     ,888.         888o.          8 8 8888    ,88'  
8 8888        \`88.        .\`8888.   .\`8888.        Y88888o.       8 8 8888   ,88'   
8 8888         \`88       ,8.\`8888. ,8.\`8888.       .\`Y888888o.    8 8 8888  ,88'    
8 8888          88      ,8'8.\`8888,8^8.\`8888.      8o. \`Y888888o. 8 8 8888 ,88'     
8 8888          88     ,8' \`8.\`8888' \`8.\`8888.     8\`Y8o. \`Y88888o8 8 8888 88'      
8 8888         ,88    ,8'   \`8.\`88'   \`8.\`8888.    8   \`Y8o. \`Y8888 8 888888<       
8 8888        ,88'   ,8'     \`8.\`'     \`8.\`8888.   8      \`Y8o. \`Y8 8 8888 \`Y8.     
8 8888    ,o88P'    ,8'       \`8        \`8.\`8888.  8         \`Y8o.\` 8 8888   \`Y8.   
8 888888888P'      ,8'         \`         \`8.\`8888. 8            \`Yo 8 8888     \`Y8.
`}
</pre>


export const MainScreen: FunctionComponent<
  {
    goNext: () => void,
  }
> = (props) => {
  return (
    <Button
      onClick={props.goNext}
      variant="outline-dark"
      size="lg"
    >Play matchmaking
    </Button>
  )
}


export const GameConstructor: FunctionComponent<
  {
    goBack: () => void,
    goNext: (settings: GameSettings) => void,
    getBalance: () => Promise<number>,
  }
> = (props) => {
  const [bidMax, setBidMax] = useState(3);
  const [currentBid, setBid] = useState(0.4);
  const [currentSlippage, setSlippage] = useState(0.2);

  useEffect(
    () => {
      props.getBalance().then(
        (balance) => {
          Math.min(bidMax, balance)
        }
      )
    },
    []
  )

  return (
    <Stack gap={2}>
      <Form.Label>Bid: {currentBid}</Form.Label>
      <Form.Range
        min={0.2}
        max={bidMax}
        step={0.2}
        value={Math.min(currentBid, bidMax)}
        onChange={(event) => { setBid(parseFloat(event.target.value)) }}
      />
      <Form.Label>Slippage: {(currentSlippage * 100).toFixed(1)}%</Form.Label>
      <Form.Range
        min={0.04}
        max={0.3}
        step={0.02}
        value={currentSlippage}
        onChange={(event) => { setSlippage(parseFloat(event.target.value)) }}
      />
      <Button
        onClick={
          () =>
            props.goNext(
              {
                bid: currentBid,
                range_from: (1 - currentSlippage) * currentBid,
                range_to: (1 + currentSlippage) * currentBid,
              }
            )
        }
        variant="outline-dark" size="lg"
      >
        Play
      </Button>
      <Button onClick={props.goBack} variant="outline-dark" size="lg">
        Back
      </Button>
    </Stack >
  )
}

// {
//     "blockHash": "0x9f38e50c5aec73c530b67ea95b77109572d577554903ae8f7b7f20dc40d6482f",
//     "blockNumber": 17424819,
//     "contractAddress": null,
//     "cumulativeGasUsed": 1984491,
//     "from": "0xc79e2d0215a5d0aeba939c27a2c0fddbda36832a",
//     "gasUsed": 1928713,
//     "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000400000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000004000000000000000000000000000000000000000000000000000000",
//     "status": true,
//     "to": "0xd628b705e08f59c2bfe1217801d66f2e5d7d45f0",
//     "transactionHash": "0x62fa1070e523cae40a1578ae0c7a84a2a0804e2ad967c3050e98f03271bd63ff",
//     "transactionIndex": 2,
//     "events": {
//         "GameCreated": {
//             "address": "0xd628b705e08f59c2Bfe1217801D66f2e5d7d45F0",
//             "blockHash": "0x9f38e50c5aec73c530b67ea95b77109572d577554903ae8f7b7f20dc40d6482f",
//             "blockNumber": 17424819,
//             "logIndex": 0,
//             "removed": false,
//             "transactionHash": "0x62fa1070e523cae40a1578ae0c7a84a2a0804e2ad967c3050e98f03271bd63ff",
//             "transactionIndex": 2,
//             "id": "log_12a25878",
//             "returnValues": {
//                 "0": "0x4FE6c61AA04F0F3EC49D1Ebb0B2716D8c0164747",
//                 "1": "0xc79e2D0215a5d0AEbA939c27A2C0fDDBda36832A",
//                 "gameAddress": "0x4FE6c61AA04F0F3EC49D1Ebb0B2716D8c0164747",
//                 "alice": "0xc79e2D0215a5d0AEbA939c27A2C0fDDBda36832A"
//             },
//             "event": "GameCreated",
//             "signature": "0xb60d84e37a6658effce28870b1d123cb86f86409df5888679310c0f276e1f5d2",
//             "raw": {
//                 "data": "0x0000000000000000000000004fe6c61aa04f0f3ec49d1ebb0b2716d8c0164747000000000000000000000000c79e2d0215a5d0aeba939c27a2c0fddbda36832a",
//                 "topics": [
//                     "0xb60d84e37a6658effce28870b1d123cb86f86409df5888679310c0f276e1f5d2"
//                 ]
//             }
//         }
//     }
// }


type GameCreated = {
  gameAddress: string,
  transaction: string,
}


type GameFound = {
  gameAddress: string,
  transaction: string,
  opponent: string,
}


// This is what expected to come out of the game constructor
export type GameSettings = {
  bid: number,
  range_from: number,
  range_to: number,
}


interface MainMenuProps {
  getBalance: () => Promise<number>,
  onGameSettingsReady: (settings: GameSettings) => void;
}


const DMNKMainMenu: FunctionComponent<MainMenuProps> = (props) => {
  const [currentScreen, setCurrentScreen] = useState(CurrentScreen.Main);

  let currentControl;
  switch (currentScreen) {
    case (CurrentScreen.Main): {
      currentControl =
        <MainScreen
          goNext={() => { setCurrentScreen(CurrentScreen.ConstructGame) }}
        />
      break;
    }
    case (CurrentScreen.ConstructGame): {
      currentControl =
        <GameConstructor
          getBalance={props.getBalance}
          goNext={props.onGameSettingsReady}
          goBack={() => { setCurrentScreen(CurrentScreen.Main) }}
        />
      break;
    }
  }
  return (
    <Container className="padded">
      <Row>
        <Col>
          {asciiLogo}
          <Stack gap={2} className="col-md-3 mx-auto">
            {currentControl}
          </Stack>
        </Col>
      </Row>
    </Container>
  );
}


export default DMNKMainMenu;
