<script lang="ts">
    import Harga from "./Deskripsi-Lain/Harga.svelte";
    import Jenis from "./Deskripsi-Lain/Jenis.svelte";

    let currentPage:string = 'Harga'
    let choosePage:string[] = ['Harga','Jenis','Merek','Promo','Sales','Satuan','Supplier']

    function changePage(){
        currentPage = currentPage
    }

</script>

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title">Deskripsi Lain</h3>
        <div class="card-toolbar">
            <select bind:value={currentPage} on:change={changePage} class="form-select form-select-sm">
                {#each choosePage as data }
                    <option value="{ data }">Lihat Halaman { data }</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="card-body">
        
        {#if currentPage == "Harga" }
            <Harga />
        {:else if currentPage == "Jenis" }
            <Jenis />
        {/if}

    </div>
    <div class="card-footer">
        Footer
    </div>
</div>