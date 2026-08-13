package model

import "time"

// mewakili tabel data pengajuan pinjaman di database
type Loan struct {
	ID            uint64    `gorm:"primaryKey" json:"id"`                           // ID unik sebagai Primary Key
	CustomerName  string    `gorm:"type:varchar(150);not null" json:"customer_name"` // Nama lengkap customer
	LoanAmount    int64     `gorm:"not null" json:"loan_amount"`                    // Uang pokok yang dipinjam
	Tenor         int       `gorm:"not null" json:"tenor"`                          // Tenor pinjaman dalam jumlah bulan
	InterestRate  float64   `gorm:"type:numeric(10,4);not null" json:"interest_rate"` // Suku bunga per bulan (%)
	TotalInterest int64     `gorm:"not null" json:"total_interest"`                 // Nilai akumulasi bunga pinjaman
	TotalAmount   int64     `gorm:"not null" json:"total_amount"`                   // Nilai total tagihan (pokok + bunga)
	CreatedAt     time.Time `json:"created_at"`                                     // Waktu pendaftaran pengajuan pinjaman

	Installments []Installment `gorm:"foreignKey:LoanID" json:"installments"` // Relasi One-to-Many ke tabel Installment (Cicilan)
}
