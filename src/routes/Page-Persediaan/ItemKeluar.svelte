<script lang="ts">
    import { onMount } from "svelte";
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast';
    import AutoComplete from "simple-svelte-autocomplete";
    import { currencyFormat } from "../../lib/currencyFormatter";
    import { userResponse } from "../../lib/activeUser";

    let personInCharge                      = []
    let stokOutlet:string[]                 = []
    let kategoriItemKeluar:string[]         = []
    let tipeKesalahan:string
    let additionalInformation:string

    let nipPenanggungJawab:string[]         = []
    let namaPenanggungJawab:string[]        = []

    let dataPenanggungJawab                 = []

    let tanggalTransaksi:any

    // Input to cart
    let productInput;
    let currentItem:string      = null;
    let currentQuantity:number  = null;
    let currentItemPlaceholder;
    let cartData                = [];
    let totalPrice:number       = 0;
    let submittedReceipt        = [];

    onMount(async () => {
        const serverData = await fetch(globalURL + 'Item-Keluar', {
            method: 'GET',
            credentials: 'include'
        })

        const serverResponse = await serverData.json()

        stokOutlet          = serverResponse.STOK
        personInCharge      = serverResponse.PIC
        kategoriItemKeluar  = serverResponse.KATEGORI
    })

    function tambahkanPenanggungJawab(){
        let findValue = personInCharge.find( e => e.NIP === dataPenanggungJawab )
        nipPenanggungJawab.push(findValue.NIP)
        nipPenanggungJawab = nipPenanggungJawab
        namaPenanggungJawab.push(findValue.NAMA)
        namaPenanggungJawab = namaPenanggungJawab
    }

    function hapusPenanggungJawab(){
        namaPenanggungJawab = []
        nipPenanggungJawab  = []
        toast.success("Data penanggung jawab telah dibersihkan!")
    }

    function inputToList(eventForm){
        // @ts-ignore
        currentItemPlaceholder = {
            KODE        : currentItem.KODE,
            NAMA        : currentItem.NAMA,
            HARGA       : currentItem.HARGA,
            SATUAN      : currentItem.SATUAN,
            JUMLAH      : currentQuantity,
            TOTAL_HARGA : currentItem.HARGA * currentQuantity
        };
        addToList(currentItemPlaceholder);
        eventForm.target.reset();
    }

    function addToList(currentItemPlaceholder){
        cartData = [...cartData, {
            KODE            : currentItemPlaceholder.KODE,
            NAMA            : currentItemPlaceholder.NAMA,
            HARGA           : currentItemPlaceholder.HARGA,
            SATUAN          : currentItemPlaceholder.SATUAN,
            JUMLAH          : currentItemPlaceholder.JUMLAH,
            TOTAL_HARGA     : currentItemPlaceholder.TOTAL_HARGA,
        }];

        cartData = cartData;
        recalculatePrice(cartData);
    }

    function removeFromList(index){
        cartData.splice(index, 1);
        cartData = cartData;
        recalculatePrice(cartData);
    }

    function recalculatePrice(cartData){
        const sumData = cartData.reduce((accumulator, object) => {
            return accumulator + object.TOTAL_HARGA;
        }, 0);

        totalPrice = sumData;
    }

    async function doPost(){

        if (tipeKesalahan == 'AFKIR' && nipPenanggungJawab.length === 0 ){
            return toast.error("Ketika mengisi Afkir, Penanggung jawab Afkir harus diisi!")
        }

        await fetch(globalURL + 'Post-Item-Keluar', {
            method: 'POST',
            headers : { 'Content-Type' : 'applciation/json' },
            credentials : 'include',
            body : JSON.stringify({
                NIP                 : userResponse.nip ,
                NAMA                : userResponse.name ,
                OUTLET              : userResponse.outlet,
                TANGGAL_TRANSAKSI   : tanggalTransaksi,
                TIPE_ITEM_KELUAR    : tipeKesalahan,
                KETERANGAN          : additionalInformation,
                PENANGGUNG_JAWAB    : nipPenanggungJawab,
                DETAIL              : cartData,
                KATEGORI            : 'Non Retail',
                TIPE                : 'Item Keluar',
                TOTAL               : totalPrice
            })
        })

        toast.success("Data berhasil disimpan!")

    }

</script>

<Toaster />

<div class="row my-7">
    <div class="col-sm-8 col-md-8 col-lg-8">

        <div class="card shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold">Item Keluar</h3>
                <div class="card-toolbar">
                    <div class="me-2">
                        <button type="button" class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#pilihPIC">Munculkan PIC</button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                
                <form on:submit|preventDefault={inputToList}>
                    <div class="row">
                        <label for="inputDataPenjualan" class="col-lg-4 col-form-label required fw-bold fs-6">Stok & Jumlah</label>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-6 fv-row">
                                    <AutoComplete items="{stokOutlet}" bind:this={productInput} bind:selectedItem="{currentItem}" placeholder="Nama Item" class="form-control form-control-lg mb-3 mb-lg-0" labelFieldName="NAMA" hideArrow="true" />
                                </div>
                                <div class="col-lg-6 fv-row">
                                    <input type="number" min="1" bind:value={currentQuantity} class="form-control form-control-lg" placeholder="Masukkan Jumlah"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" hidden class="btn btn-primary">Eastern Man</button>
                </form>
        
                <div class="table-responsive mt-4">
                    <table class="table table-row-dashed table-row-gray-300 align-middle mt-2">
                        <thead>
                            <tr class="fw-bold">
                                <th>Kode Item</th>
                                <th>Nama Produk</th>
                                <th>Satuan</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Total Harga</th>
                                <th>Hapus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each cartData as data, index}
                            <tr>
                                <td>{ data.KODE }</td>
                                <td>{ data.NAMA }</td>
                                <td>{ data.SATUAN }</td>
                                <td>{ currencyFormat.format(data.HARGA) }</td>
                                <td>{ data.JUMLAH }</td>
                                <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                                <td>
                                    <button type="button" class="btn btn-icon btn-danger" on:click={ () => removeFromList(index) }><i class="las la-trash fs-2"></i></button>
                                </td>
                            </tr>
                            {/each}
                            <tr>
                                <td class="text-center fw-bold" colspan="5">Total</td>
                                <td colspan="2" class="bg-success text-white fw-bold text-center">{ currencyFormat.format(totalPrice) }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

    </div>
    <div class="col-sm-4 col-md-4 col-lg-4">

        <div class="card shadow-sm">
            <div class="card-body">
                
                <div class="fv-row my-4">
                    <label for="tanggalTransaksi" class="form-label fs-6 fw-bolder mb-3">Tanggal Transaksi</label>
                    <input type="datetime-local" bind:value={tanggalTransaksi} class="form-control form-control-sm" required />
                </div>

                <div class="fv-row my-4">
                    <label for="tipeKeluar" class="form-label fs-6 fw-bolder mb-3">Tipe Item Keluar</label>
                    <select bind:value={tipeKesalahan} class="form-select form-select-sm">
                        <option value="">Pilih</option>
                        {#each kategoriItemKeluar as kategoriItem }
                            <option value="{ kategoriItem.KATEGORI }">{ kategoriItem.KATEGORI }</option>
                        {/each}
                    </select>
                </div>

                <div class="fv-row mb-2">
                    <label for="keteranganTambahan" class="form-label fs-6 fw-bolder mb-3">Keterangan Tambahan</label>
                    <textarea class="form-control" bind:value={additionalInformation} rows="3" placeholder="Keterangan Untuk Transaksi Ini"></textarea>
                </div>

                <button type="button" on:click={doPost}  class="form-control bg-primary text-white my-3">Simpan</button>

            </div>
        </div>

    </div>
</div>

<!-- Person in Charge -->

<div class="modal fade" tabindex="-1" id="pilihPIC">
    <div class="modal-dialog"> 
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Pilih Penanggung Jawab Afkir</h3>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    X
                </div>
            </div>

            <div class="modal-body">

                <div class="fv-row my-4">
                    <label for="personInCharge" class="form-label fs-6 fw-bolder mb-3">Pilih Penanggung Jawab</label>
                    <select bind:value={dataPenanggungJawab} class="form-select form-select-sm text-capitalize">
                        {#each personInCharge as PIC }
                            <option value="{PIC.NIP}">{PIC.NAMA}</option>
                        {/each}
                    </select>
                </div>

                <div class="table-responsive my-4">
                    <table class="table table-row-dashed table-row-gray-300 align-middle text-center">
                        <thead>
                            <tr class="fw-bold">
                                <th>#</th>
                                <th>Nama Penanggung Jawab</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each namaPenanggungJawab as namaPJ, index}
                                <tr>
                                    <td>{ index + 1 }</td>
                                    <td class="text-capitalize" >{ namaPJ }</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="me-2">
                    <button type="button" on:click={tambahkanPenanggungJawab} class="btn btn-sm btn-warning">Tambahkan</button>
                    <button type="button" on:click={hapusPenanggungJawab} class="btn btn-sm btn-danger">Hapus</button>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>