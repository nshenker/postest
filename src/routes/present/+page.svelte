<script lang='ts'>
    import { onMount, onDestroy, } from "svelte";
    import * as web3 from '@solana/web3.js';
    import { createQR, encodeURL, findReference, FindReferenceError} from "@solana/pay"
    import { storeName, publicKey, pmtAmt, mostRecentTxn, showWarning, successArray, mints, selectedMint} from '../stores.js';
    import * as KioskBoard from 'kioskboard';
    import englishKeypbad from "../../keyboards/kioskboard-keys-english.json"
	import { Focus } from "focus-svelte";
    import { goto } from '$app/navigation';
    import QRCodeStyling from '@solana/qr-code-styling'
    import BigNumber from 'bignumber.js';
    import InlineSVG from 'svelte-inline-svg'
    import card_svg from './card.svg'

    let cnx;
    let keyboardRef = null;
    let qrCode
    let qrCode2
    let qrRef = null
    let svg_container;
    let txnConfirmed = false
    //const element = document.getElementById('qr-code');
  

    let sol_rpc = process.env.SOLANA_RPC? process.env.SOLANA_RPC : "https://solana-mainnet.g.alchemy.com/v2/5Bo-yRwJYXcscWQkkah0KJ-9jPmm5cSi";
    let connection = new web3.Connection(sol_rpc);
    let currentMint = $mints.filter(item => item.name == $selectedMint)
    let splToken = new web3.PublicKey(currentMint[0].mint);
    const reference = web3.Keypair.generate().publicKey;
    let storeText = $storeName? $storeName : "store"
    const label = 'Payment to ' + storeText
    const message = 'Thank you for your payment!';
    const memo = 'rippy.xyz';

    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }

    onMount(async () => {
        console.log("mint", currentMint[0].mint)
        let recipient = new web3.PublicKey($publicKey)
        
        let amount = new BigNumber($pmtAmt);
        let url = ($publicKey) ? encodeURL({ recipient, amount, splToken, reference, label, message, memo }) : null;
        
        try {
            qrCode = createQR(url, 360, 'transparent')
           // qrCode2 = qrCode._svg.innerHTML
            const element = document.getElementById('qr-code');
            qrCode.append(element);
            console.log(qrCode)
            //console.log(await qrCode.getRawData())
            //()
        }
        catch (e) {
           // qrCode = null
            qrCode._svg = ""
            console.log("error making QR ", e)
           
        }
        
        const interval = setInterval(async () => {
            try {
                // Check if there is any transaction for the reference
                let untilTxn = undefined
                if ($mostRecentTxn != "") {
                    untilTxn = $mostRecentTxn
                }
                const signatureInfo = await findReference(connection, reference, { until: untilTxn });
                if (signatureInfo.confirmationStatus == "finalized" || signatureInfo.confirmationStatus == "confirmed") {
                    txnConfirmed = true
                    let confirmedTxn = await connection.getParsedTransaction(signatureInfo.signature)
                    if (confirmedTxn) {
                        var new_entry = {
                            "timestamp" : confirmedTxn.blockTime,
                            "txid": confirmedTxn.transaction.signatures[0],
                            "uiAmount" : confirmedTxn.transaction.message.instructions[1].parsed.info.tokenAmount.uiAmount
                        }
                        //item.transaction.message.accountKeys.flatMap(k => k.pubkey.toBase58())
                        if(!$successArray.flatMap(k => k.txid).includes(new_entry.txid)) {
                            $successArray.push(new_entry)
                        }
                       
                    }
                   
                    console.log('Transaction ', confirmedTxn);
                    console.log('Array', $successArray);
                    $successArray = $successArray.filter(unique)
                    $successArray = $successArray
                    console.log('Transaction confirmed', signatureInfo);
                    $mostRecentTxn = signatureInfo.signature;
                
                    return
                }
                //notify({ type: 'success', message: 'Transaction confirmed', txid: signatureInfo.signature });
                

                
            } catch (e) {
                if (e instanceof FindReferenceError) {
                // No transaction found yet, ignore this error
                return;
                }
                console.error('Unknown error', e)
            }
            }, 250)
            return () => {
                clearInterval(interval)
            }
       
        //qrCode2 =decodeURIComponent(qrCode.toString()).replace('data:image/svg+xml,', '')
        
    })
    onDestroy(async ()=> {
        //document.body.setAttribute('tabindex', '-1');
       // <img src={qrCode._qr.createDataURL()}/>
      // <svg width=512 height=512 viewBox="-1 -1 2 2" bind:this={qrCode}/>
    })
    async function cancel() {
        goto('/store', { state: { foo: 'bar' } });
    }

</script>
<div class="grid h-screen">
<div class="grid grid-flow-row justify-center">
    
    <h1 class="sm:pt-3 pt-1 font-greycliffbold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-br from-[#20BF55] to-[#01BAEF] ">
        {$storeName}</h1>
        <div id="qr-code" >
            <qrCode/>
        </div>
        
  
</div>
<div class="grid grid-flow-row justify-center pt-5 gap-3">
    <div class="indicator justify-items-center place-self-center">
        <div class="">
            {#if !txnConfirmed}
            <span class="text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Awaiting Payment Confirmation</span>
            {:else}
            <span class="text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             Transaction Confirmed!</span>
            {/if}
        </div>
    </div>
</div>
<div class="grid grid-flow-row justify-center pt-5 pb-6">
    <div class="indicator justify-items-center place-self-center">
        <div class="">
            <button on:click={cancel} class="btn normal-case btn-lg bg-gradient-to-br border-accent hover:border-accent from-[#20BF55] to-[#01BAEF]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-6 h-6 ">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            <span class="pl-2">{txnConfirmed? "Return" : "Cancel"}</span></button>
        </div>
    </div>

</div>
{#if $showWarning}
<div class="grid grid-flow-row justify-center">
    <div class="indicator justify-items-center place-self-center">
        <div class="text-orange-500">
           
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
              This device does not store any crypto.
        </div>
    </div>
</div>
{/if}
<div class="grid pb-20">

</div>
</div>

