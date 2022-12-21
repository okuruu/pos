<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete"
    import { currencyFormat } from "../../lib/currencyFormatter";
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';

    const globalURL:string = "http://localhost:8080/api/v1/";

    let productInput;
    let currentSession  = null;

    let selectedMembers:string  = null;
    let selectedSales:string    = "";
    let selectedPromo:string    = "";

    let listOfMembers = [];

    let bundlePenjualan = {
        PROMO   : null,
        SALES   : null,
        STOK    : null,
        CASHIER : null,
    };
    let listOfSales                     = [];
    let listOfPromo                     = [];
    let availableOrders                 = [];
    let indexAvailableOrders:number     = null; 

    onMount(async () => {
        const response = await fetch(globalURL + 'Bundle-Penjualan', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                tipePenjualan   : 'Stok-Outlet',
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

        const availablePurchaseOrders = await fetch(globalURL + 'Available-Purchase-Orders', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include'
        });
        availableOrders = await availablePurchaseOrders.json();
    });

    function changeCurrentOrder(){
        // console.log(availableOrders);
        console.log(availableOrders[indexAvailableOrders].DETAIL)
        cartData = availableOrders[indexAvailableOrders].DETAIL;
    }

    // Input to cart
    let currentItem:string      = null;
    let currentQuantity:number  = null;
    let currentItemPlaceholder;
    let cartData                = [];
    let totalPrice:number       = 0;
    let submittedReceipt        = [];

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
        // @ts-ignore
        currentItemPlaceholder = {
            KODE        : currentItem.KODE,
            NAMA        : currentItem.NAMA,
            HARGA       : currentItem.HARGA,
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

    async function showMember(keywords){
        const memberGet = await fetch(globalURL + 'Search-Member/' + encodeURIComponent(keywords) , {
            method : 'GET',
            credentials : 'include'
        });
        const showData = await memberGet.json();
        listOfMembers = showData;
        return listOfMembers;
    }

    function calculatePaid(){
        // Total of all payment methods
        totalPaid = bayarTunai + depositPesanan + eMoney + dpSoPesanan + bayarDebit + bayarKredit + potonganHarga;
    }

    async function doPost(){
        if(cartData == undefined || cartData.length == 0){
            toast.error("Harap mengisi produk terlebih dahulu!", {
                position: 'top-right'
            });
        }

        submittedReceipt = {
            CASHIER : {
                NIP     : bundlePenjualan.CASHIER.NIP,
                NAMA    : bundlePenjualan.CASHIER.NAMA,
                OUTLET  : bundlePenjualan.CASHIER.OUTLET
            },
            DETAIL      : cartData,
            SALES       : selectedSales,
            PROMO       : selectedPromo,
            MEMBER      : selectedMembers,
            PEMBAYARAN  : {
                TUNAI       : bayarTunai,
                DEPOSIT     : depositPesanan,
                EMONEY      : eMoney,
                DPPESANAN   : dpSoPesanan,
                KREDIT      : bayarKredit,
                DEBIT       : bayarDebit,
                POTONGAN    : potonganHarga,
                TOTAL       : totalPrice,
            },
            KETERANGAN      : additionalInformation,
            KATEGORI        : 'Retail',
            TIPE            : 'Penjualan',
            KEMBALIAN       : totalPaid - totalPrice,
        };

        const postData = await fetch(globalURL + 'Post-Penjualan', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(submittedReceipt)
        });
        toast.success("Transaksi berhasil disimpan!");
    }
</script>

<Toaster />

<div class="container">
    <div class="card shadow-sm my-1">
        <div class="card-body">
            
            <div class="row">
                <div class="col">
                    <label for="chooseTransaction" class="form-label fw-bold">Pilih Nomor Transaksi</label>
                    <select bind:value={ indexAvailableOrders } on:change={ changeCurrentOrder } class="form-select">
                        <option value="">Pilih Nomor Transaksi</option>
                        {#each availableOrders as ordersID, index }
                            <option value="{ index }">{ ordersID.KODE }</option>
                        {/each}
                    </select>
                </div>
                <div class="col">
                    <label for="deskripsiPesanan" class="form-label fw-bold">Deskripsi Pemesanan</label>
                    <textarea class="form-control" placeholder="Desc" readonly rows="3"></textarea>
                </div>
            </div>

        </div>
    </div>
</div>

<div class="container mt-1">
    <div class="card shadow-sm">
        <div class="card-header">
            <h3 class="card-title">Penjualan Kasir</h3>
            <div class="card-toolbar">
                <button type="button" on:click={doPost} class="btn btn-sm btn-success">
                    Simpan Transaksi
                </button>
            </div>
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
                        <td>{ currencyFormat.format(data.HARGA) }</td>
                        <td>{ data.JUMLAH }</td>
                        <td>{ currencyFormat.format(data.TOTAL_HARGA) }</td>
                        <td>
                            <button type="button" class="btn btn-icon btn-danger" on:click={ () => removeFromList(index) }><i class="las la-trash fs-2"></i></button>
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        </div>
    </div>

    <div class="card shadow-sm my-3">
        <div class="card-body">

            <div class="row">
                <div class="col-sm-8 col-md-8 col-lg-8">
                    
                    <div class="row mt-6">
                        <div class="col-lg-4 mb-4 mb-lg-0">
                            <div class="fv-row mb-0">
                                <label for="pilihCS" class="form-label fs-6 fw-bolder mb-3">Pilih CS</label>
                                <select bind:value={ selectedSales } class="form-select">
                                    <option value="">Pilih CS</option>
                                    {#each listOfSales as salesOnline }
                                        <option value="{salesOnline.CODE}">{ salesOnline.NAMA }</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-4 mb-lg-0">
                            <div class="fv-row mb-0">
                                <label for="kodePromo" class="form-label fs-6 fw-bolder mb-3">Promo Tersedia</label>
                                <select bind:value={ selectedPromo } class="form-select">
                                    <option value="">Pilih Kode Promo</option>
                                    {#each listOfPromo as promos }
                                        <option value="{ promos.KODE }">{ promos.KETERANGAN }</option>
                                    {/each}
                                </select>                               
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="fv-row mb-0">
                                <label for="cariMember" class="form-label fs-6 fw-bolder mb-3">Cari Member</label>
                                <br>
                                <AutoComplete searchFunction="{showMember}" delay="600" localFiltering={false} labelFieldName="NAMA" valueFieldName="KODE" bind:selectedItem="{selectedMembers}" class="form-control form-control-lg" placeholder="Cari Member.." hideArrow />
                            </div>
                        </div>
                    </div>

                    <div class="separator my-5"></div>

                        <div class="row mt-6">
                            <div class="col-lg-4 mb-4 mb-lg-0">
                                <div class="fv-row mb-0">
                                    <label for="bayarTunai" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(bayarTunai) }</label>
                                    <!-- <CurrencyInput value="{bayarTunai}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" placeholder="Bayar Tunai" on:keyup={calculatePaid} bind:value="{bayarTunai}" />
                                </div>
                            </div>
                            <div class="col-lg-4 mb-4 mb-lg-0">
                                <div class="fv-row mb-0">
                                    <label for="dpPesanan" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(depositPesanan) }</label>
                                    <!-- <CurrencyInput value="{depositPesanan}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" placeholder="Deposit Pesanan" on:keyup={calculatePaid} bind:value="{depositPesanan}" />
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="fv-row mb-0">
                                    <label for="eMoney" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(eMoney) }</label>
                                    <!-- <CurrencyInput value="{eMoney}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" placeholder="E-Money" on:keyup={calculatePaid} bind:value="{eMoney}" />
                                </div>
                            </div>
                        </div>

                        <div class="row mt-6">
                            <div class="col-lg-4 mb-4 mb-lg-0">
                                <div class="fv-row mb-0">
                                    <label for="dpSoPesanan" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(dpSoPesanan) }</label>
                                    <!-- <CurrencyInput value="{dpSoPesanan}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" placeholder="DP / SO Pesanan" on:keyup={calculatePaid} bind:value="{dpSoPesanan}" />
                                </div>
                            </div>
                            <div class="col-lg-4 mb-4 mb-lg-0">
                                <div class="fv-row mb-0">
                                    <label for="bayarKredit" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(bayarKredit) }</label>
                                    <!-- <CurrencyInput value="{bayarKredit}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" placeholder="Bayar Kredit" on:keyup={calculatePaid} bind:value="{bayarKredit}" />
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="fv-row mb-0">
                                    <label for="bayarDebit" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(bayarDebit) }</label>
                                    <!-- <CurrencyInput value="{bayarDebit}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" placeholder="Bayar Debit" on:keyup={calculatePaid} bind:value="{bayarDebit}" />
                                </div>
                            </div>
                        </div>

                        <div class="row mt-6">
                            <div class="col-lg-4 mb-4 mb-lg-0">
                                <div class="fv-row mb-0">
                                    <label for="potongan" class="form-label fs-6 fw-bolder mb-3">{ currencyFormat.format(potonganHarga) }</label>
                                    <!-- <CurrencyInput value="{potonganHarga}" locale="id-ID" currency="IDR" /> -->
                                    <input type="number" class="form-control" on:keyup={calculatePaid} placeholder="Potongan Harga" bind:value="{potonganHarga}" />
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <div class="fv-row mb-0">
                                    <!-- Fill with something else.. -->
                                </div>
                            </div>
                        </div>

                </div>
                <div class="col-sm-4 col-md-4 col-lg-4">

                    <div class="mt-5">
                        <label for="keteranganTambahan" class="form-label fs-6 fw-bolder mb-3">Keterangan Tambahan</label>
                        <textarea class="form-control " rows="3" placeholder="Keterangan Untuk Transaksi Ini" bind:value={additionalInformation} ></textarea>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div class="my-4">
                                <label for="keteranganTambahan" class="form-label fs-6 fw-bolder">Total Tagihan</label>
                                <input type="text" class="form-control form-control-sm border-0 bg-danger fw-bolder text-white" readonly value="{ currencyFormat.format(totalPrice) }" />
                            </div>
                        </div>
                        <div class="col">
                            <div class="my-4">
                                <label for="keteranganTambahan" class="form-label fs-6 fw-bolder">Pembayaran</label>
                                <input type="text" class="form-control form-control-sm border-0 bg-warning fw-bolder text-white" readonly value="{ currencyFormat.format(totalPaid) }" />
                            </div>
                        </div>
                    </div>

                    <div class="my-5">
                        <label for="keteranganTambahan" class="form-label fs-6 fw-bolder">Kembalian</label>
                        <input type="text" class="form-control form-control-sm border-0 bg-success fw-bolder text-white" readonly value="{ currencyFormat.format(totalPaid - totalPrice ) }" />
                    </div>

                </div>
            </div>

        </div>
    </div>

</div>