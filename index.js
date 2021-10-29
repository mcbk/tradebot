//Simple tradebot binance by mcbk
const ccxt = require('ccxt');
const moment = require('moment');
const delay = require('delay');
const binance = new ccxt.binance({
    apiKey: 'alLqkuhevrfR1ivvJZ1uuYBG9CnUiyDZeuieRFZIjHkm33NnUF36ndK1yzVY87qH',
    secret: 'b39wEzhZyKsUpckLWsQecVT5baP7bP0UIFlqQFC8SHWkPjNIW51CtUfXm4rq61OL',
});
binance.setSandboxMode(true)

async function printBalance(btcPrice){
    const balance = await binance.fetchBalance();
    const total = balance.total
    console.log(`Balance: BTC ${total.BTC}, USDT: ${total.USDT}`);
    console.log (`Total USD: ${(total.BTC - 1) * btcPrice + total.USDT}. \n`);
}
async function tick(){
    const price = await binance.fetchOHLCV('BTC/USDT','1m',undefined,5);
    const bPrice = price.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1],
            high: price[2],
            low: price[3],
            close: price[4],
            volume: price[5]
        }
    } )
    //console.log(price);
    console.log(bPrice);
    const averangePrice = bPrice.reduce((acc, price)=> acc + price.close,0)/5
    const lastPice = bPrice[bPrice.length-1].close

    console.log(bPrice.map(p => p.close),averangePrice,lastPice);
    // Thuat toan du dinh ban day
    const direction = lastPice > averangePrice ? 'sell' : 'buy'
    
    const  TRADE_SIZE = 10
    const quantity = 10/lastPice

    console.log(`Averange price: ${averangePrice}. Last price: ${lastPice}`)
    const order = await binance.createMarketOrder('BTC/USDT',direction, quantity, lastPice)
    console.log(`${moment().format()}: ${direction} ${quantity} BTC at ${lastPice}`)
    //console.log(order);
    printBalance(lastPice)
}

async function main(){
    while(true){
        await tick();
        await delay(10*1000);
    }

}
main()
//printBalance()