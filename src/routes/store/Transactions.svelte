<script lang='ts'>
  import { onMount, onDestroy } from "svelte";
  import { goto } from '$app/navigation';
  import { storeName, publicKey, pmtAmt, showWarning, successArray } from '../stores.js';
  import dayjs from 'dayjs'

  let successArrayData = [];

  const unsubscribe = successArray.subscribe(value => {
    successArrayData = value;
  });

  onMount(() => {
    // Initialize KioskBoard (default/all options)
    successArrayData = $successArray;
  })

  onDestroy(() => {
    unsubscribe();
  })

  async function reset() {
    goto('/', { state: { foo: 'bar' } });
  }
</script>

<div class="card bg-base-200">
  <div class="overflow-x-auto">
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th class="text-left">Tx ID</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {#each successArrayData as item, i (item.txid)}
        <tr>
          <td>{dayjs.unix(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
          <td class="text-left">
            <a class="hover:underline hover:decoration-primary" href={`https://solscan.io/tx/${item.txid}`} target="_blank">
              {item.txid.substring(0, 4)}...
            </a>
          </td>
          <td class="text-right">{item.uiAmount}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
