import React, { useState } from 'react';
import Web3 from 'web3';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import apiCall from "./apiCall"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Expand Graph - 1 Eth to Dai',
    },
  },
};
const App = () => {
  // react hooks
  const [blockNumber, setBlockNumber] = useState([1200]);
  const [UniswapV2State, setUniswapV2State] = useState([1200]);
  const [SushiSwapState, setSushiSwapState] = useState([1200]);
  const [UniswapV3State, setUniswapV3State] = useState([1200]);
  
  // socket init
  const web3Socket = new Web3(
    new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/fc5d23096e754d64a5f261f5f07170d5')
  );
  const web3Subscription = web3Socket.eth.subscribe("newBlockHeaders");

  // listening to new blocks minted
  web3Subscription.on("data", async (data) => { 
    const uniswapV2 = await apiCall("https://uat.expand.network/dex/getprice?dexId=1000&path=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0x6B175474E89094C44Da98b954EedeAC495271d0F&amountIn=1000000000000000000");
    const sushiSwap = await apiCall("https://uat.expand.network/dex/getprice?dexId=1100&path=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0x6B175474E89094C44Da98b954EedeAC495271d0F&amountIn=1000000000000000000");
    const uniswapV3 = await apiCall("https://uat.expand.network/dex/getprice?dexId=1300&path=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0x6B175474E89094C44Da98b954EedeAC495271d0F&amountIn=1000000000000000000");


    const uniswapV2Rate = uniswapV2.data.data.amountsOut[1]/uniswapV2.data.data.amountsOut[0];
    const sushiSwapRate = sushiSwap.data.data.amountsOut[1]/sushiSwap.data.data.amountsOut[0];
    const uniswapV3Rate = uniswapV3.data.data.amountsOut[1]/uniswapV3.data.data.amountsOut[0];

    if (data.number !== blockNumber[blockNumber.length-1]) {
      setUniswapV2State((ethToDai) => [...ethToDai, uniswapV2Rate]);
      setSushiSwapState((ethToDai1) => [...ethToDai1, sushiSwapRate]);
      setUniswapV3State((ethToDai2) => [...ethToDai2, uniswapV3Rate]);
      setBlockNumber((blockNumber) => [...blockNumber, data.number]);
    }
  })

  const data = {
    labels: blockNumber,
    min: 1000,
    max: 1400,
    datasets: [
      {
        label: 'Uniswap V2',
        data: UniswapV2State,
        borderColor: 'rgb(230,38,0)',
        backgroundColor: 'rgb(230,38,0)',
      },
      {
        label: 'SushiSwap',
        data: SushiSwapState,
        borderColor: 'rgb(0,128,0)',
        backgroundColor: 'rgb(0,128,0)',
      },
      {
        label: 'Uniswap V3',
        data: UniswapV3State,
        borderColor: 'rgb(128,255,255)',
        backgroundColor: 'rgb(128,255,255)',
      }
    ],
    options: {
      scales: {
          y: {
              suggestedMin: 50,
              suggestedMax: 100
          }
      }
  }
  };

  return (
    <div style={{padding: "20px"}}>
  <Line options={options} data={data} />
  </div>
  )
}
export default App;