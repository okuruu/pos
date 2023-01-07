<div class="container-fluid">
    <div class="card shadow-sm my-7">
        <div class="card-header">
            <h3 class="card-title fw-bold">Transaksi</h3>
            <div class="card-toolbar">
                <button type="button" class="btn btn-sm btn-light">Test</button>
            </div>
        </div>
        <div class="card-body">
            
            <div class="row mb-6">
                <label for="kategoriTransaksi" class="col-sm-4 col-form-label fw-bold fs-6 required">
                    <span>Kategori</span>
                </label>
                <div class="col-lg-8 fv-row">
                    <select class="form-select">
                        <option value="Tunai">Tunai</option>
                        <option value="EDC">EDC</option>
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BRI">BRI</option>
                    </select>
                </div>
            </div>

            <div class="row mb-6">
                <label for="keterangan" class="col-sm-4 col-form-label fw-bold fs-6 required">
                    <span>Keterangan</span>
                </label>
                <div class="col-lg-8 fv-row">
                    <textarea class="form-control" rows="3" placeholder="Masukkan Keterangan"></textarea>
                </div>
            </div>

            <div class="row mb-6">
                <label for="nominal" class="col-sm-4 col-form-label fw-bold fs-6 required">
                    <span>Nominal</span>
                </label>
                <div class="col-lg-8 fv-row">
                    <input type="text" class="form-control" placeholder="Rp. 0,00" inputMode='decimal' onFocus="this.type='number'; this.value=this.lastValue" onBlur="this.type=''; this.lastValue=this.value; this.value=this.value==''?'':(+this.value).toLocaleString()" />
                </div>
            </div>

            <button type="button" class="btn btn-primary">Simpan</button>

        </div>
    </div>
</div>