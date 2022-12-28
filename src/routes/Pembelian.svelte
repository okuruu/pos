<script lang="ts">
    import DaftarPembelian from "./Page-Pembelian/DaftarPembelian.svelte";
import PesananPembelian from "./Page-Pembelian/PesananPembelian.svelte";

    let currentPage:string = "default";
    let listPages:string[] = ['🗿Pembelian','👮Daftar Pembelian']
</script>

<div class="container">
    <table class="table align-middle">
        <tbody>
            <tr class="fw-bold text-center">
                {#each listPages as data}
                    <td><button on:click={ () => currentPage = data } type="button" class="btn btn-sm fw-bold">{ data }</button></td>
                {/each}
            </tr>
        </tbody>
    </table>
</div>

<div class="container-fluid">
    {#if currentPage == "🗿Pembelian"}
        <PesananPembelian />
    {:else if currentPage == "👮Daftar Pembelian" }
        <DaftarPembelian />
    {/if}
</div>