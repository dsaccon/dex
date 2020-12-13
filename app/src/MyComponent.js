import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props

  const [tmpEthToTknRateAmt, setTmpEthToTknRateAmt] = React.useState(null);
  const [ethToTknRateAmt, setEthToTknRateAmt] = React.useState(null);

  const [tmpEthToTknAmt, setTmpEthToTknAmt] = React.useState(null);
  const [ethToTknAmt, setEthToTknAmt] = React.useState(null);

  const [tmpTknToEthRateAmt, setTmpTknToEthRateAmt] = React.useState(null);
  const [tknToEthRateAmt, setTknToEthRateAmt] = React.useState(null);

  const [tmpDepAmt, setTmpDepAmt] = React.useState(null);
  const [depAmt, setDepAmt] = React.useState(null);

  return (
    <div className="section">
      <h3>DEX</h3>
      <h4>{drizzle.contracts.Dex.address}</h4>
      <p>Liquidity (wei):&nbsp;
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Dex"
          method="getEthLiquidity"
        />
      </p>
      <p>Liquidity (Token):&nbsp;
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Dex"
          method="getTokenLiquidity"
        />
      </p>
      <hr />
      <h3>Metamask Account</h3>
      <AccountData
        drizzle={drizzle}
        drizzleState={drizzleState}
        accountIndex={0}
        units="ether"
        precision={3}
      />
      <p>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Token"
          method="balanceOf"
          methodArgs={[drizzleState.accounts[0]]}
          precision={3}
        />
      &nbsp;TKN</p>
      <hr />
      <p>Check ETH->Token rate</p>
      <div className="form">
        <input id="f-amount-tEtTR" type="text" onChange={(e)=>setTmpEthToTknRateAmt(e.target.value)} placeholder="ETH amount" />
        <button id="f-button-EtTR" onClick={()=>setEthToTknRateAmt(tmpEthToTknRateAmt)}>Submit</button>
      </div>
        { ethToTknRateAmt ?
            <p>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="Dex"
                method="getPriceEthToToken"
                methodArgs={[parseFloat(ethToTknRateAmt*10**18).toString()]}
                precision={3}
              />
            &nbsp;TKN</p>
              : (null)
        }
      <p>Swap ETH for Token</p>
      <div className="form">
        <input id="f-amount-tEtT" type="text" onChange={(e)=>setTmpEthToTknAmt(e.target.value)} placeholder="ETH amount" />
        <button id="f-button-EtT" onClick={()=>setEthToTknAmt(tmpEthToTknAmt)}>Submit</button>
      </div>
        { ethToTknAmt ?
              <ContractForm
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract="Dex"
              method="ethToToken"
              sendArgs={{value: ethToTknAmt*10**18}}
            />
              : (null)
        }
      <br />
      <hr />
      <p>Check Token->ETH rate</p>
      <div className="form">
        <input id="f-amount-tTtER" type="text" onChange={(e)=>setTmpTknToEthRateAmt(e.target.value)} placeholder="Token amount" />
        <button id="f-button-TtER" onClick={()=>setTknToEthRateAmt(tmpTknToEthRateAmt)}>Submit</button>
      </div>
        { tknToEthRateAmt ?
            <p>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="Dex"
                method="getPriceTokenToEth"
                methodArgs={[tknToEthRateAmt]}
                precision={3}
              />
            &nbsp;ETH (wei)</p>
              : (null)
        }
      <p>Swap Token for ETH</p>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Dex"
        method="tokenToEth"
        labels={["Token amount"]}
      />
      <br />
      <hr />
      <p>Invest Liquidity</p>
      <div className="form">
        <input id="f-amount-invest" type="text" onChange={(e)=>setTmpDepAmt(e.target.value)} placeholder="ETH amount" />
        <button id="f-button-invest" onClick={()=>setDepAmt(tmpDepAmt)}>Submit</button>
      </div>
        { depAmt ?
          <ContractForm
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="Dex"
            method="deposit"
            sendArgs={{value: depAmt*10**18}}
          />
              : (null)
        }
      <p>Divest Liquidity</p>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Dex"
        method="withdraw"
        labels={["ETH amount"]}
      />        
    </div>
  );
};