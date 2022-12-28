<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete"
    import { onMount } from "svelte";
    import { currencyFormat } from "../../lib/currencyFormatter";
    import { globalURL } from "../../lib/mainLink";

    let cartData                = [];
    let totalPrice:number       = 0;
    let currentSession  = null;

    let listOfSales             = [];
    let listOfPromo             = [];

    let selectedSales:string    = "";
    let selectedPromo:string    = "";
    let selectedMembers:string  = null;

    let productInput;
    let currentItem:string      = null;
    let currentQuantity:number  = null;
    let currentItemPlaceholder  = {
            KODE        : null,
            NAMA        : null,
            HARGA       : null,
            SATUAN      : null,
            JUMLAH      : null,
            TOTAL_HARGA : null
    };

    onMount(async () => {
        const response = await fetch(globalURL + 'Bundle-Penjualan', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                tipePenjualan   : 'Master-Produk',
            })
        })

        const serverData = await response.json();

        currentSession  = serverData.ACTIVE;
        bundlePenjualan = {
            PROMO   : serverData.KODE_PROMO,
            SALES   : serverData.SALES,
            STOK    : serverData.STOK,
            CASHIER : serverData.ACTIVE
        };
        listOfSales = serverData.SALES;
        listOfPromo = serverData.KODE_PROMO;
    })

    // Bundling data penjualan
    let bundlePenjualan = {
        PROMO   : null,
        SALES   : null,
        STOK    : null,
        CASHIER : null,
    };

    // Payment Methods
    let bayarTunai:number               = null;
    let depositPesanan:number           = null;
    let eMoney:number                   = null;
    let dpSoPesanan:number              = null;
    let bayarKredit:number              = null;
    let bayarDebit:number               = null;
    let potonganHarga:number            = null;
    let additionalInformation:string    = null;
    let totalPaid:number                = null;

    function inputToList(eventForm){
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
            SATUAN          : currentItemPlaceholder.SATUAN,
            HARGA           : currentItemPlaceholder.HARGA,
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

    function calculatePaid(){
        // Total of all payment methods
        totalPaid = bayarTunai + depositPesanan + eMoney + dpSoPesanan + bayarDebit + bayarKredit + potonganHarga;
    }

    async function showMember(keywords){
        const memberGet = await fetch(globalURL + 'Search-Member/' + encodeURIComponent(keywords) , {
            method : 'GET',
            credentials : 'include'
        });
        const showData = await memberGet.json();
        listOfMembers = showData;
        return listOfMembers;
    }

</script>

<div class="row">
    <div class="col-sm-8 col-md-8 col-lg-8">

        <div class="card shadow-sm mb-7">
            <div class="card-header">
                <h3 class="card-title">Pesanan Pembelian</h3>
            </div>
            <div class="card-body">
                
                <form on:submit|preventDefault={inputToList}>
                    <div class="row">
                        <label for="inputDataPenjualan" class="col-lg-4 col-form-label required fw-bold fs-6">Stok & Jumlah</label>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-6 fv-row">
                                    <AutoComplete items="{bundlePenjualan.STOK}" bind:this={productInput} bind:selectedItem="{currentItem}" placeholder="Nama Item" class="form-control form-control-lg mb-3 mb-lg-0" labelFieldName="NAMA" hideArrow="true" />
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
                            <tr class="text-center fw-bold">
                                <td colspan="5">Total</td>
                                <td colspan="2" class="bg-success text-white">{ currencyFormat.format(totalPrice) }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>

    </div>
    <div class="col-sm-4 col-md-4 col-lg-4">

        <div class="card shadow-sm mb-7">
            <div class="card-body">

                <div class="fv-row mb-2">
                    <label for="pilihCS" class="form-label fs-6 fw-bolder mb-3">Pilih CS</label>
                    <select bind:value={ selectedSales } class="form-select">
                        <option value="">Pilih CS</option>
                        {#each listOfSales as salesOnline }
                            <option value="{salesOnline.CODE}">{ salesOnline.NAMA }</option>
                        {/each}
                    </select>
                </div>

                <div class="fv-row mb-2">
                    <label for="kodePromo" class="form-label fs-6 fw-bolder mb-3">Promo Tersedia</label>
                    <select bind:value={ selectedPromo } class="form-select">
                        <option value="">Pilih Kode Promo</option>
                        {#each listOfPromo as promos }
                            <option value="{ promos.KODE }">{ promos.KETERANGAN }</option>
                        {/each}
                    </select>                               
                </div>

                <div class="fv-row mb-2">
                    <label for="cariMember" class="form-label fs-6 fw-bolder mb-3">Cari Member</label>
                    <br>
                    <AutoComplete searchFunction="{showMember}" delay="600" localFiltering={false} labelFieldName="NAMA" valueFieldName="KODE" bind:selectedItem="{selectedMembers}" class="form-control form-control-lg" placeholder="Cari Member.." hideArrow />
                </div>

                <button type="button" class="btn w-100 btn-primary mt-7" data-bs-toggle="modal" data-bs-target="#bayarPesanan">Mbayar</button>

            </div>
        </div>

    </div>
</div>

<!-- Modal Modul -->

<div class="modal fade" tabindex="-1" id="bayarPesanan">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Modal title</h3>

                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
                <!--end::Close-->
            </div>

            <div class="modal-body">
                
                <div class="form-group mb-3">
                    <label for="bayarTunai" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(bayarTunai) }</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Bayar Tunai" on:keyup={calculatePaid} bind:value="{bayarTunai}" />
                </div>

                <div class="form-group mb-3">
                    <label for="dpPesanan" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(depositPesanan) }</label>
                            <input type="number" class="form-control form-control-sm" placeholder="Deposit Pesanan" on:keyup={calculatePaid} bind:value="{depositPesanan}" />
                </div>

                <div class="form-group mb-3">
                    <label for="eMoney" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(eMoney) }</label>
                    <input type="number" class="form-control form-control-sm" placeholder="E-Money" on:keyup={calculatePaid} bind:value="{eMoney}" />
                </div>

                <div class="form-group mb-3">
                    <label for="dpSoPesanan" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(dpSoPesanan) }</label>
                    <input type="number" class="form-control form-control-sm" placeholder="DP / SO Pesanan" on:keyup={calculatePaid} bind:value="{dpSoPesanan}" />
                </div>

                <div class="form-group mb-3">
                    <label for="bayarKredit" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(bayarKredit) }</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Bayar Kredit" on:keyup={calculatePaid} bind:value="{bayarKredit}" />
                </div>

                <div class="form-group mb-3">
                    <label for="bayarDebit" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(bayarDebit) }</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Bayar Debit" on:keyup={calculatePaid} bind:value="{bayarDebit}" />
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>