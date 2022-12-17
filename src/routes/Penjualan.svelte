<script lang="ts">
    import Penjualan from './Page-Penjualan/Penjualan.svelte';
    import Pesanan from './Page-Penjualan/Pesanan.svelte';
    import PoPesanan from './Page-Penjualan/PoPesanan.svelte';

    let currentPage:string = "default";
    let listPages:string[] = ['🫡 Penjualan','👍 Pesanan','👌 Purchase Order Penjualan']

</script>

<table class="table align-middle mt-3">
    <tbody>
        <tr class="fw-bold text-center">
            {#each listPages as data}
                <td><button on:click={ () => currentPage = data } type="button" class="btn btn-sm fw-bold">{ data }</button></td>
            {/each}
        </tr>
    </tbody>
</table>

{#if currentPage == '👍 Pesanan' }
    <Pesanan />
{:else if currentPage == '🫡 Penjualan' }
    <Penjualan />
{:else if currentPage == '👌 Purchase Order Penjualan' }
    <PoPesanan />
{/if}