<script lang="ts">
    import { globalURL } from "../../lib/mainLink";
    import toast, { Toaster } from 'svelte-french-toast';

    let currentPassword:string
    let thenPassword:string

    async function doPost(){

        if(thenPassword.length < 7){
            return toast.error("Password harus memuat minimal 8 karakter")
        }

        const doPost = await fetch(globalURL + 'Ubah-Password', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                CURRENT: currentPassword,
                LATEST: thenPassword
            })
        })
        const doResponse = await doPost.json()
        doResponse == "OK" ? toast.success("Password berhasil diubah!") : toast.error("Password lama tidak sesuai")
    }
</script>

<Toaster />

<div class="card shadow-sm my-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Ubah Password</h3>
    </div>
    <div class="card-body">

        <div class="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-9 p-6">
            <span class="svg-icon svg-icon-2tx svg-icon-warning me-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor" />
                    <rect x="11" y="14" width="7" height="2" rx="1" transform="rotate(-90 11 14)" fill="currentColor" />
                    <rect x="11" y="17" width="2" height="2" rx="1" transform="rotate(-90 11 17)" fill="currentColor" />
                </svg>
            </span>
            <div class="d-flex flex-stack flex-grow-1">
                <div class="fw-semibold">
                    <h4 class="text-gray-900 fw-bold">Anda Akan Mengubah Password Anda!</h4>
                    <div class="fs-6 text-gray-700">Sebelum melakukan perubahan pada<br />  akun anda, harap catat informasi penting agar data anda tidak hilang.</div>
                </div>
            </div>
        </div>
        
        <div class="row mb-6">
            <label for="passwordSekarang" class="col-lg-4 col-form-label required fw-bold fs-6">Password Sekarang</label>
            <div id="passwordSekarang" class="col-lg-8 fv-row">
                <input type="password" bind:value={currentPassword} class="form-control form-control-lg form-control-solid" placeholder="Masukkan Password Saat Ini" />
            </div>
        </div>

        <div class="row mb-6">
            <label for="passwordBaru" class="col-lg-4 col-form-label required fw-bold fs-6">Password Baru</label>
            <div id="passwordBaru" class="col-lg-8 fv-row">
                <input type="text" bind:value={thenPassword} class="form-control form-control-lg form-control-solid" placeholder="Masukkan Password Baru Anda" />
            </div>
        </div>

        <div class="form-text mb-5">Password harus memuat minimal 8 karakter</div>
        <div class="d-flex">
            <button type="button" on:click={doPost} class="btn btn-primary me-2 px-6">Update Password</button>
            <button type="button" class="btn btn-color-gray-400 btn-active-light-primary px-6">Batalkan</button>
        </div>

    </div>
</div>