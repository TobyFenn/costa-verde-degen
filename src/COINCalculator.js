import React, { useState, useEffect } from 'react';
import './COINCalculator.css';

function COINCalculator() {
  const [coinPrice, setCoinPrice] = useState(66305.80);
  const [targetPrice, setTargetPrice] = useState(65000);
  const [yesSharePrice, setYesSharePrice] = useState(0.81);
  const [noSharePrice, setNoSharePrice] = useState(0.28);
  const [leverage, setLeverage] = useState(1);
  const [slippage, setSlippage] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(100000);

  const [results, setResults] = useState({});

  useEffect(() => {
    calculateResults();
  }, [coinPrice, targetPrice, yesSharePrice, noSharePrice, leverage, slippage, totalInvestment]);

  const calculateResults = () => {
    const priceDifference = coinPrice - targetPrice;
    const adjustedNoSharePrice = noSharePrice * (1 + slippage);
    const potentialProfit = 1 - adjustedNoSharePrice;

    const maxCoinInvestment = totalInvestment / (1 + (1 / leverage));
    const maxMarketInvestment = totalInvestment - maxCoinInvestment;

    const coinUnits = maxCoinInvestment / (coinPrice / leverage);
    const optimalNoShares = Math.min(priceDifference * coinUnits / potentialProfit, maxMarketInvestment / adjustedNoSharePrice);

    const coinCost = coinUnits * (coinPrice / leverage);
    const noSharesCost = optimalNoShares * adjustedNoSharePrice;
    const actualTotalInvestment = coinCost + noSharesCost;

    const breakEvenIncrease = noSharesCost / (coinUnits * coinPrice);

    const worstCaseScenario = {
      coinLoss: priceDifference * coinUnits,
      noSharesGain: optimalNoShares * potentialProfit,
      netProfit: (optimalNoShares * potentialProfit) - (priceDifference * coinUnits),
      roi: ((optimalNoShares * potentialProfit) - (priceDifference * coinUnits)) / actualTotalInvestment
    };

    const bestCaseScenario = (increase) => {
      const coinGain = (coinPrice * increase) * coinUnits;
      return {
        coinGain,
        noSharesLoss: noSharesCost,
        netProfit: coinGain - noSharesCost,
        roi: (coinGain - noSharesCost) / actualTotalInvestment
      };
    };

    setResults({
      coinUnits,
      optimalNoShares,
      coinCost,
      noSharesCost,
      actualTotalInvestment,
      breakEvenIncrease,
      worstCaseScenario,
      bestCaseScenario: bestCaseScenario(0.02) // 2% increase example
    });
  };

  return (
    <div className="container">
      <h1 className="title">COIN Investment Strategy Calculator</h1>
      
      <div className="grid">
        <div className="card coin-market">
          <h2>COIN Market</h2>
          <div className="form-group">
            <label>COIN Price ($)</label>
            <input type="number" value={coinPrice} onChange={e => setCoinPrice(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Target Price ($)</label>
            <input type="number" value={targetPrice} onChange={e => setTargetPrice(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Leverage (COIN purchase only)</label>
            <input type="number" value={leverage} onChange={e => setLeverage(Number(e.target.value))} min="1" />
          </div>
        </div>

        <div className="card prediction-market">
          <h2>Prediction Market</h2>
          <div className="form-group">
            <label>"Yes" Share Price ($)</label>
            <input type="number" value={yesSharePrice} onChange={e => setYesSharePrice(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>"No" Share Price ($)</label>
            <input type="number" value={noSharePrice} onChange={e => setNoSharePrice(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Slippage (predicted price increase for "No" shares)</label>
            <input type="number" value={slippage} onChange={e => setSlippage(Number(e.target.value))} step="0.01" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Total Investment Amount ($)</label>
          <input type="number" value={totalInvestment} onChange={e => setTotalInvestment(Number(e.target.value))} />
        </div>
      </div>

      <div className="card results">
        <h2>Results:</h2>
        <div className="grid">
          <div>
            <p>COIN Units: {results.coinUnits?.toFixed(4)}</p>
            <p>Optimal "No" Shares: {results.optimalNoShares?.toFixed(2)}</p>
            <p>COIN Cost: ${results.coinCost?.toFixed(2)}</p>
            <p>"No" Shares Cost: ${results.noSharesCost?.toFixed(2)}</p>
            <p>Actual Total Investment: ${results.actualTotalInvestment?.toFixed(2)}</p>
            <p>Break-even Increase: {(results.breakEvenIncrease * 100)?.toFixed(2)}%</p>
          </div>
          <div>
            <h3>Worst Case Scenario (COIN falls to target price):</h3>
            <p>COIN Loss: ${results.worstCaseScenario?.coinLoss.toFixed(2)}</p>
            <p>"No" Shares Gain: ${results.worstCaseScenario?.noSharesGain.toFixed(2)}</p>
            <p>Net Profit: ${results.worstCaseScenario?.netProfit.toFixed(2)}</p>
            <p>ROI: {(results.worstCaseScenario?.roi * 100).toFixed(2)}%</p>

            <h3>Best Case Scenario (2% COIN price increase):</h3>
            <p>COIN Gain: ${results.bestCaseScenario?.coinGain.toFixed(2)}</p>
            <p>"No" Shares Loss: ${results.bestCaseScenario?.noSharesLoss.toFixed(2)}</p>
            <p>Net Profit: ${results.bestCaseScenario?.netProfit.toFixed(2)}</p>
            <p>ROI: {(results.bestCaseScenario?.roi * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default COINCalculator;