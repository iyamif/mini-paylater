package service

import (
	"errors"
	"mini-paylater/dto"
	"mini-paylater/model"
	"mini-paylater/repository"
	"strings"
	"time"

	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// interface bisnis untuk pengolahan logika pinjaman dan cicilan
type LoanService interface {
	CreateLoan(req dto.CreateLoanRequest) (*dto.LoanResponse, error) // Logika membuat pinjaman dan cicilannya
	GetLoanByID(id uint64) (*dto.LoanResponse, error)                // Logika mencari pinjaman berdasarkan ID
}

// mengimplementasikan antarmuka bisnis LoanService
type loanService struct {
	db   *gorm.DB                  // Instance koneksi database GORM untuk kontrol transaksi
	repo repository.LoanRepository // Repository penunjang manipulasi database
}

// konstruktor untuk instansiasi LoanService
func NewLoanService(
	db *gorm.DB,
	repo repository.LoanRepository,
) LoanService {
	return &loanService{
		db:   db,
		repo: repo,
	}
}

// memvalidasi parameter input pengajuan pinjaman
func validateCreateLoanRequest(req dto.CreateLoanRequest) error {
	// Pastikan nama lengkap customer tidak kosong
	if strings.TrimSpace(req.CustomerName) == "" {
		return errors.New("customer_name is required")
	}

	// Batasi jumlah pinjaman minimal adalah Rp500.000
	if req.LoanAmount < 500000 {
		return errors.New("loan_amount must be at least Rp500.000")
	}

	// Tenor bulan pinjaman harus lebih dari 0
	if req.Tenor <= 0 {
		return errors.New("tenor must be greater than 0")
	}

	// Suku bunga bulanan tidak boleh bernilai negatif
	if req.InterestRate < 0 {
		return errors.New("interest_rate cannot be negative")
	}

	return nil
}

// mengolah pengajuan pinjaman baru, menghitung bunga, membagi nominal tagihan per bulan, dan menyimpannya secara transaksional
func (s *loanService) CreateLoan(
	req dto.CreateLoanRequest,
) (*dto.LoanResponse, error) {
	// Jalankan fungsi validasi request payload
	if err := validateCreateLoanRequest(req); err != nil {
		return nil, err
	}

	/*
		Formula Perhitungan Bunga:
		Total Bunga = Jumlah Pinjaman × (Suku Bunga / 100) × Tenor
	*/
	loanAmount := decimal.NewFromInt(req.LoanAmount)
	interestRate := decimal.NewFromFloat(req.InterestRate)
	tenor := decimal.NewFromInt(int64(req.Tenor))

	// Menghitung total nilai bunga dengan tingkat presisi tinggi (menggunakan library decimal)
	totalInterestDecimal := loanAmount.
		Mul(interestRate).
		Div(decimal.NewFromInt(100)).
		Mul(tenor)

	// Membulatkan hasil bunga desimal ke integer rupiah terdekat
	totalInterest := totalInterestDecimal.Round(0).IntPart()

	// Total pengembalian adalah jumlah pokok pinjaman ditambah akumulasi bunga
	totalAmount := req.LoanAmount + totalInterest

	// Menghitung cicilan dasar per bulan (pembagian rata)
	baseInstallment := totalAmount / int64(req.Tenor)

	// Sisa pembagian (jika ada pembulatan sisa desimal pembagian)
	remainder := totalAmount % int64(req.Tenor)

	// Waktu penciptaan data pinjaman
	now := time.Now()

	// Membuat objek model pinjaman untuk disimpan
	loan := &model.Loan{
		CustomerName:  req.CustomerName,
		LoanAmount:    req.LoanAmount,
		Tenor:         req.Tenor,
		InterestRate:  req.InterestRate,
		TotalInterest: totalInterest,
		TotalAmount:   totalAmount,
		CreatedAt:     now,
	}

	var installments []model.Installment

	// Membentuk daftar jadwal cicilan bulanan
	for month := 1; month <= req.Tenor; month++ {
		amount := baseInstallment

		// Menambahkan sisa pembulatan pembagian ke cicilan bulan terakhir (agar jumlah total cicilan pas)
		if month == req.Tenor {
			amount += remainder
		}

		// Menghitung tanggal jatuh tempo per bulan (bulan saat ini + nomor urutan bulan)
		dueDate := now.AddDate(0, month, 0)

		// Membentuk objek cicilan untuk daftar bulk-insert
		installment := model.Installment{
			LoanID:      0, // Akan di-update setelah ID pinjaman utama terbuat
			MonthNumber: month,
			DueDate:     dueDate,
			AmountDue:   amount,
			Status:      "UNPAID",
			CreatedAt:   now,
		}

		installments = append(installments, installment)
	}

	// Melakukan transaksi penyimpanan database agar kedua tabel (loans & installments) sukses bersama
	err := s.db.Transaction(func(tx *gorm.DB) error {
		// Simpan pinjaman utama
		if err := s.repo.CreateLoan(tx, loan); err != nil {
			return err
		}

		// Mengisi LoanID pada setiap cicilan dengan ID pinjaman yang baru disimpan
		for i := range installments {
			installments[i].LoanID = loan.ID
		}

		// Simpan bulk semua cicilan
		if err := s.repo.CreateInstallments(tx, installments); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	loan.Installments = installments

	// Mengonversi data model menjadi respon DTO
	return mapLoanToResponse(loan), nil
}

// mengonversi entitas database model.Loan ke dto.LoanResponse
func mapLoanToResponse(
	loan *model.Loan,
) *dto.LoanResponse {
	installments := make(
		[]dto.InstallmentResponse,
		0,
		len(loan.Installments),
	)

	// Mapping satu-persatu daftar cicilan database ke respon DTO
	for _, item := range loan.Installments {
		installments = append(
			installments,
			dto.InstallmentResponse{
				ID:          item.ID,
				MonthNumber: item.MonthNumber,
				DueDate:     item.DueDate.Format("2006-01-02"), // Format tanggal jadi YYYY-MM-DD
				AmountDue:   item.AmountDue,
				Status:      item.Status,
			},
		)
	}

	// Mengembalikan DTO lengkap
	return &dto.LoanResponse{
		ID:            loan.ID,
		CustomerName:  loan.CustomerName,
		LoanAmount:    loan.LoanAmount,
		Tenor:         loan.Tenor,
		InterestRate:  loan.InterestRate,
		TotalInterest: loan.TotalInterest,
		TotalAmount:   loan.TotalAmount,
		CreatedAt:     loan.CreatedAt,
		Installments:  installments,
	}
}

// mencari dan menyajikan informasi detail pinjaman beserta daftar cicilannya berdasarkan ID
func (s *loanService) GetLoanByID(
	id uint64,
) (*dto.LoanResponse, error) {
	// Mengambil model data dari database
	loan, err := s.repo.GetLoanByID(id)

	if err != nil {
		return nil, err
	}

	// Mengubah model menjadi format DTO respon
	return mapLoanToResponse(loan), nil
}

