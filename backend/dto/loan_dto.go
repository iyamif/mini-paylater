package dto

// struktur data untuk menampung request body saat mengajukan pinjaman baru
type CreateLoanRequest struct {
	CustomerName string  `json:"customer_name"` // Nama lengkap customer
	LoanAmount   int64   `json:"loan_amount"`   // Jumlah uang yang dipinjam (dalam Rupiah)
	Tenor        int     `json:"tenor"`         // Jumlah bulan tenor angsuran (misal: 3, 6, 9, 12)
	InterestRate float64 `json:"interest_rate"` // Suku bunga per bulan dalam persen (misal: 2.0)
}

// struktur data response untuk mengirimkan detail pinjaman yang sudah dihitung dan dibuat
type LoanResponse struct {
	ID            uint64                `json:"id"`             // ID unik pinjaman
	CustomerName  string                `json:"customer_name"`  // Nama lengkap customer
	LoanAmount    int64                 `json:"loan_amount"`    // Jumlah uang pinjaman pokok
	Tenor         int                   `json:"tenor"`          // Tenor pinjaman dalam bulan
	InterestRate  float64               `json:"interest_rate"`  // Suku bunga per bulan
	TotalInterest int64                 `json:"total_interest"` // Total nilai bunga selama tenor
	TotalAmount   int64                 `json:"total_amount"`   // Total pengembalian (pokok + bunga)
	CreatedAt     interface{}           `json:"created_at"`     // Waktu pembuatan data
	Installments  []InstallmentResponse `json:"installments"`   // Daftar jadwal cicilan per bulan
}

// struktur data detail cicilan yang akan dikirim dalam respon
type InstallmentResponse struct {
	ID          uint64 `json:"id"`           // ID unik cicilan
	MonthNumber int    `json:"month_number"` // Urutan bulan cicilan (misal: cicilan ke-1, 2)
	DueDate     string `json:"due_date"`     // Tanggal jatuh tempo pembayaran (YYYY-MM-DD)
	AmountDue   int64  `json:"amount_due"`   // Jumlah tagihan yang harus dibayar pada bulan tersebut
	Status      string `json:"status"`       // Status pembayaran cicilan (misal: UNPAID, PAID)
}

