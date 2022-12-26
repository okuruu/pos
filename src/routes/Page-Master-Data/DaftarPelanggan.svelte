<script lang="ts">
    import { globalURL } from "../../lib/mainLink";
    import { userResponse } from "../../lib/activeUser";
    import toast, { Toaster } from 'svelte-french-toast'
    import AutoComplete from "simple-svelte-autocomplete"

    let kodeMember:string
    let nikKTP:string
    let namaLengkap:string
    let tempatLahir:string
    let alamat:string
    let kelurahan:string
    let kecamatan:string
    let pekerjaanMember:string
    let nomorWhatsApp:number
    let tanggalLahir
    let gender:string

    let listOfMembers   = []
    let selectedMembers = {
        KODE: null,
        NAMA: null,
        POIN: null
    };

    async function doPost(eventForm){

        const formData = await fetch(globalURL + 'Daftar-Member', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                KODE                : kodeMember ,
                NIK                 : nikKTP ,
                NAMA                : namaLengkap ,
                TEMPAT_LAHIR        : tempatLahir ,
                ALAMAT              : alamat ,
                KELURAHAN           : kelurahan ,
                KECAMATAN           : kecamatan ,
                PEKERJAAN           : pekerjaanMember ,
                WHATSAPP            : nomorWhatsApp ,
                TANGGAL_LAHIR       : tanggalLahir ,
                GENDER              : gender ,
                CREATED_BY          : userResponse.outlet ,
            })
        })

        const formResponse = await formData.json()

        if(formResponse.message == "success"){
            toast.success("Data berhasil disimpan!")
        } else {
            toast.error("Ada masalah dengan server. Coba lagi nanti")
        }
        return eventForm.target.reset();
    }

    async function showMember(keywords){
        const memberGet = await fetch(globalURL + 'Search-Member/' + encodeURIComponent(keywords) , {
            method : 'GET',
            credentials : 'include'
        })
        const showData = await memberGet.json()
        listOfMembers = showData
        return listOfMembers
    }

</script>

<Toaster />

<div class="card shadow-sm">
    <div class="card-header">
        <h3 class="card-title fw-bold">Pendaftaran Member Dea Bakery</h3>
        <div class="card-toolbar me-2">
            <button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#cekPoin">Cek Poin</button>
        </div>
    </div>
    <div class="card-body">

    <form on:submit|preventDefault={doPost}>
        
        <div class="row mb-6">
            <label for="kodeKartuMember" class="col-sm-4 col-form-label fw-bold fs-6 required">
                <span>Kode Kartu Member</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={kodeMember} class="form-control form-control-solid" placeholder="Kode Kartu Member" required/>
            </div>
        </div>

        <div class="row mb-6">
            <label for="nikKTP" class="col-sm-4 col-form-label fw-bold fs-6">
                <span>NIK KTP</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={nikKTP} class="form-control form-control-solid" placeholder="NIK KTP" />
            </div>
        </div>

        <div class="row mb-6">
            <label for="namaLengkap" class="col-sm-4 col-form-label fw-bold fs-6 required">
                <span>Nama Lengkap</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={namaLengkap} class="form-control form-control-solid" placeholder="Nama Lengkap" required />
            </div>
        </div>

        <div class="row mb-6">
            <label for="tempatLahir" class="col-sm-4 col-form-label fw-bold fs-6">
                <span>Tempat Lahir</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={tempatLahir} class="form-control form-control-solid" placeholder="Contoh: Surabaya"/>
            </div>
        </div>

        <div class="row mb-6">
            <label for="alamat" class="col-sm-4 col-form-label fw-bold fs-6">
                <span>Alamat</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={alamat} class="form-control form-control-solid" placeholder="Contoh: Jl. Soekarno Hatta No. 32A Blok B" />
            </div>
        </div>

        <div class="row mb-6">
            <label for="kelurahan" class="col-sm-4 col-form-label fw-bold fs-6">
                <span>Kelurahan</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={kelurahan} class="form-control form-control-solid" placeholder="Contoh: Sidomoro"/>
            </div>
        </div>

        <div class="row mb-6">
            <label for="kecamatan" class="col-sm-4 col-form-label fw-bold fs-6">
                <span>Kecamatan</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={kecamatan} class="form-control form-control-solid" placeholder="Contoh: Sidodadi"/>
            </div>
        </div>

        <div class="row mb-6">
            <label for="pekerjaanMember" class="col-sm-4 col-form-label fw-bold fs-6">
                <span>Pekerjaan</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={pekerjaanMember} class="form-control form-control-solid" placeholder="Pekerjaan"/>
            </div>
        </div>

        <div class="row mb-6">
            <label for="nomorWhatsApp" class="col-sm-4 col-form-label fw-bold fs-6 required">
                <span>Nomor WhatsApp</span>
            </label>
            <div class="col-lg-8 fv-row">
                <input type="text" bind:value={nomorWhatsApp} class="form-control form-control-solid" placeholder="Nomor WhatsApp" required />
            </div>
        </div>
    
        <div class="row mb-6">
            <label for="tanggalLahir" class="col-lg-4 col-form-label required fw-bold fs-6">Tanggal Lahir & Jenis Kelamin</label>
            <div class="col-lg-8">
                <div class="row">
                    <div class="col-lg-6 fv-row">
                        <input type="date" bind:value={tanggalLahir} class="form-control form-control-solid"/>
                    </div>
                    <div class="col-lg-6 fv-row">
                        <div class="d-flex align-items-center text-center mt-3">
                            <label class="form-check form-check-inline form-check-solid me-5">
                                <input class="form-check-input" bind:group={gender} type="radio" value="Pria" checked required/>
                                <span class="fw-bold ps-2 fs-6">Pria</span>
                            </label>
                            <label class="form-check form-check-inline form-check-solid">
                                <input class="form-check-input" bind:group={gender} type="radio" value="Wanita" required/>
                                <span class="fw-bold ps-2 fs-6">Wanita</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button type="submit" class="btn btn-primary">Simpan Data</button>
    
    </form>

    </div>
    <div class="card-footer">
        Footer
    </div>
</div>

<!-- Modal! -->

<div class="modal fade" tabindex="-1" id="cekPoin">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Lihat Poin Member</h3>

                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2 fw-bolder" data-bs-dismiss="modal" aria-label="Close">X</div>
            </div>

            <div class="modal-body">
                
                <div class="row mb-6">
                    <label for="lihatPoin" class="col-sm-4 col-form-label fw-bold fs-6">
                        Cari Member
                    </label>
                    <div class="col-lg-8 fv-row">
                        <AutoComplete searchFunction="{showMember}" delay="600" localFiltering={false} labelFieldName="NAMA" valueFieldName="KODE" bind:selectedItem="{selectedMembers}" class="form-control form-control" placeholder="Cari Member.." hideArrow />
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table align-middle table-striped text-center">
                        <tbody>
                            <tr>
                                <td class="fw-bold">Nama</td>
                                <td><input type="text" class="form-control form-control-sm form-control-flush text-center" bind:value={selectedMembers.NAMA} readonly /></td>
                            </tr>
                            <tr>
                                <td class="fw-bold">Kode</td>
                                <td><input type="text" class="form-control form-control-sm form-control-flush text-center" bind:value={selectedMembers.KODE} readonly /></td>
                            </tr>
                            <tr>
                                <td class="fw-bold">Poin</td>
                                <td><input type="text" class="form-control form-control-sm form-control-flush text-center" bind:value={selectedMembers.POIN} readonly /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>