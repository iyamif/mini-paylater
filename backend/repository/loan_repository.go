package repository

import (
	"mini-paylater/model"

	"gorm.io/gorm"
)

// mendefinisikan interface/kontrak untuk akses data pinjaman dan cicilan di database
type LoanRepository interface {
	CreateLoan(tx *gorm.DB, loan *model.Loan) error
	CreateInstallments(tx *gorm.DB, installments []model.Installment) error
	GetLoanByID(id uint64) (*model.Loan, error)
}

// mengimplementasikan interface LoanRepository menggunakan GORM
type loanRepository struct {
	db *gorm.DB // Instansi koneksi database gorm
}

// constructor untuk instansiasi repo baru
func NewLoanRepository(db *gorm.DB) LoanRepository {
	return &loanRepository{
		db: db,
	}
}

// menyimpan record pinjaman baru ke database
func (r *loanRepository) CreateLoan(
	tx *gorm.DB,
	loan *model.Loan,
) error {
	// Menyimpan model pinjaman menggunakan transaksi database yang aktif
	return tx.Create(loan).Error
}

// menyimpan sekumpulan data cicilan angsuran (bulk insert) sekaligus
func (r *loanRepository) CreateInstallments(
	tx *gorm.DB,
	installments []model.Installment,
) error {
	// Menyimpan list cicilan ke database
	return tx.Create(&installments).Error
}

// mengambil detail data pinjaman berdasarkan ID, lengkap dengan memuat (preload) relasi cicilannya secara berurutan
func (r *loanRepository) GetLoanByID(
	id uint64,
) (*model.Loan, error) {
	var loan model.Loan

	// Mengambil data pinjaman, melakukan preload relasi cicilan dengan order berdasarkan bulan ke-n secara menaik (ASC)
	err := r.db.
		Preload("Installments", func(db *gorm.DB) *gorm.DB {
			return db.Order("month_number ASC")
		}).
		First(&loan, id).
		Error

	// Jika terjadi error saat query, kembalikan nilai nil dan error terkait
	if err != nil {
		return nil, err
	}

	return &loan, nil
}

