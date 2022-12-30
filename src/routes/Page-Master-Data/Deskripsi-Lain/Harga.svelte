<script lang="ts">
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import { currencyFormat } from "../../../lib/currencyFormatter";
    import { globalURL } from "../../../lib/mainLink";

    let listHarga   = []
    let searchItem  = null

    onMount(async () => {

        const dataRequest = await fetch(globalURL + 'Deskripsi-Umum', {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include',
            body: JSON.stringify({
                dataRequest : 'master_produk'
            })
        })

        listHarga = await dataRequest.json()
        toast.success("Data berhasil dimuat!")
    })

</script>

<Toaster />

<div class="row">
    <div class="col-sm-3 col-md-3 col-lg-3">
        <input type="text" bind:value={searchItem} class="form-control form-control-sm" placeholder="Cari Produk" />
    </div>
    <div class="col-sm-2 col-md-2 col-lg-2">
        <button type="submit" class="btn btn-sm btn-primary">Cari</button>
    </div>
</div>

<div class="table-responsive">
    <table class="table table-hover table-row-dashed table-row-gray-300 align-middle mt-2">
        <thead>
            <tr class="fw-bold">
                <th>Kode Item</th>
                <th>Nama Item</th>
                <th>Wilayah</th>
                <th>Level 1</th>
                <th>Level 2</th>
                <th>Level 3</th>
                <th>Level 4</th>
                <th>Level 5</th>
            </tr>
        </thead>
        <tbody>
            {#each listHarga as data }
            <tr>
                <td> { data.KODE } </td>
                <td> { data.NAMA } </td>
                <td> <span class="badge badge-{ data.NAMA_WILAYAH == "Jawa" ? 'primary' : 'info' } text-center">{ data.NAMA_WILAYAH }</span> </td>
                <td> { currencyFormat.format(data.LEVEL_1) } </td>
                <td> { currencyFormat.format(data.LEVEL_2) } </td>
                <td> { currencyFormat.format(data.LEVEL_3) } </td>
                <td> { currencyFormat.format(data.LEVEL_4) } </td>
                <td> { currencyFormat.format(data.LEVEL_5) } </td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>