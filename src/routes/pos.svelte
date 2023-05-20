<script lang='ts'>
    import { onMount } from "svelte";
    import * as web3 from '@solana/web3.js';
    import { storeName, publicKey } from './stores.js';

    let cnx;

    onMount(async () => {
        
        let sol_rpc = process.env.SOLANA_RPC? process.env.SOLANA_RPC : "https://green-bold-seed.solana-mainnet.discover.quiknode.pro/0027f801211bf821310389a08c7c36593580a080/";
        cnx = new web3.Connection(sol_rpc);
       
    })

    async function createStore() {
    console.log($storeName, $publicKey)
    
    }

</script>

<div class="grid grid-flow-row justify-center">
    
    <h1 class="sm:pt-3 pt-1 font-greycliffbold text-4xl text-center text-[#0D7071] ">
        $storeName</h1>
  
</div>

<div class="grid grid-flow-row justify-center pt-5 gap-3">
    <div class="indicator justify-items-center place-self-center">
Test
    </div>

</div>
