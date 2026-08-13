package model

import "time"

// mewakili tabel cicilan dalam database
type Installment struct {
	ID          uint64    `gorm:"primaryKey" json:"id"`                      // ID unik sebagai Primary Key
	LoanID      uint64    `gorm:"not null;index" json:"loan_id"`             // ID pinjaman terkait (Foreign Key & Index)
	MonthNumber int       `gorm:"not null" json:"month_number"`              // Urutan bulan cicilan ke-n
	DueDate     time.Time `gorm:"not null" json:"due_date"`                  // Waktu jatuh tempo pembayaran cicilan
	AmountDue   int64     `gorm:"not null" json:"amount_due"`                // Jumlah nominal uang yang harus dibayar pada bulan ini
	Status      string    `gorm:"type:varchar(20);not null" json:"status"`   // Status pembayaran cicilan (UNPAID / PAID)
	CreatedAt   time.Time `json:"created_at"`                                // Waktu pembuatan record cicilan
}

