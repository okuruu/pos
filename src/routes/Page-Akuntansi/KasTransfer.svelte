<div class="card card-flush shadow-sm mb-7">
    <div class="card-header">
        <h3 class="card-title fw-bold">Kas Transfer</h3>
        <div class="card-toolbar">
            <button type="button" class="btn btn-sm btn-light">
                Action
            </button>
        </div>
    </div>
    <div class="card-body py-5">
        
        <div class="row">
            <div class="col-md-3 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Pencarian</span>
                </label>
                <input type="text" placeholder="Kata kunci pencarian" class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Periode s/d</span>
                </label>
                <input type="date" class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <label for="pencarianKasMasuk" class="d-flex align-items-center mb-2">
                    <span class="fs-6 fw-bolder">Periode s/d</span>
                </label>
                <input type="date" class="form-control form-control-sm" />
            </div>

            <div class="col-md-2 fv-row">
                <button type="button" class="btn btn-sm btn-primary mt-8"><i class="las la-search fs-2 me-2"></i>Cari Kas Transfer</button>
            </div>
        </div>

        <div class="table-responsive my-7">
            <table class="table table-row-dashed table-row-gray-300 gy-2 table-hover align-middle text-center text-dark">
                <thead>
                    <tr class="fw-bold">
                        <th>No Transaksi</th>
                        <th>Tanggal</th>
                        <th>Keterangan</th>
                        <th>Kode Akun</th>
                        <th>Nama Akun</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>                                
                </tbody>
            </table>
        </div>

    </div>
    <div class="card-footer">
        <div class="me-2">
            <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#tambahKasTransfer"><i class="las la-plus-circle fs-2 me-2"></i>Tambah</button>
            <button type="button" class="btn btn-sm btn-info"><i class="las la-edit fs-2 me-2"></i>Edit</button>
            <button type="button" class="btn btn-sm btn-danger"><i class="las la-trash fs-2 me-2"></i>Hapus</button>
        </div>
    </div>
</div>

<!-- Kas Transfer -->
<div class="modal fade" tabindex="-1" id="tambahKasTransfer">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Tambah Kas Transfer</h3>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <span class="svg-icon svg-icon-1"></span>
                </div>
            </div>

            <div class="modal-body">

                <div class="row mb-4">
                    <label for="setTanggal" class="col-sm-4 col-form-label fw-bold fs-6 required">
                        <span>Atur Tanggal</span>
                    </label>
                    <div class="col-lg-8 fv-row">
                        <input type="date" class="form-control form-control-sm" />
                    </div>
                </div>

                <div class="form-floating">
                    <textarea class="form-control" placeholder="Berikan keterangan untuk Kas Transfer" style="height: 100px"></textarea>
                    <label for="keteranganKasTransfer">Keterangan</label>
                </div>

                <div class="separator separator-dashed border-primary my-5"></div>
                
                <div class="row mb-3">
                    <label for="saldoTransferAwal" class="col-lg-4 col-form-label required fw-bold fs-6">Dari Akun</label>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 fv-row">
                                <select class="form-select form-select-sm">
                                    <option value="">Pilih Akun</option>
                                </select>
                            </div>
                            <div class="col-lg-6 fv-row">
                                <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Rp. -" readonly />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                    <label for="saldoTransferKepada" class="col-lg-4 col-form-label required fw-bold fs-6">Transfer Ke</label>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 fv-row">
                                <select class="form-select form-select-sm">
                                    <option value="">Pilih Akun</option>
                                </select>
                            </div>
                            <div class="col-lg-6 fv-row">
                                <input type="text" class="form-control form-control-sm form-control-solid" placeholder="Rp. -" readonly />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="submit" class="btn btn-sm btn-primary"><i class="las la-save fs-2 me-2"></i>Simpan</button>
                <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>