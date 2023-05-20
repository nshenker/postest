import { writable } from 'svelte/store';

export const storeName = writable("");
export const publicKey = writable();
export const pmtAmt = writable();
export const mostRecentTxn = writable("");
export const showWarning = writable(true);
export const fullScreen = writable(false);
export let successArray = writable([]);
export const mints = writable([
    {name:"USDC", mint:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},

    {name:"DUST", mint:"DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ"},

    {name:"FOXY", mint:"FoXyMu5xwXre7zEoSvzViRk3nGawHUp9kUh97y2NDhcq"},

    {name:"JOINTS", mint:"7ftKSttU6yUAnWsWxpRP3LKdQNEto8V4KD9NuWttoVnV"},

    {name:"USDT", mint:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},

    {name:"SOL", mint:"So11111111111111111111111111111111111111112"},
 
    {name:"BONK", mint:"DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"}])
export const selectedMint = writable("USDC");