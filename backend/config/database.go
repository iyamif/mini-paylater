package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// memuat variabel lingkungan dari file .env
func LoadEnv() {
	// Membaca file .env di root direktori
	err := godotenv.Load()

	// Jika file .env tidak ditemukan, tampilkan pesan peringatan
	if err != nil {
		log.Println("Warning: .env file not found")
	}
}

// membuat koneksi ke database PostgreSQL menggunakan GORM
func ConnectDatabase() *gorm.DB {
	// Mengambil kredensial database dari variabel lingkungan (env)
	host := os.Getenv("DB_HOST")         // Host server database (misal: localhost atau host docker)
	port := os.Getenv("DB_PORT")         // Port database PostgreSQL (default: 5432)
	user := os.Getenv("DB_USER")         // Username database
	password := os.Getenv("DB_PASSWORD") // Password database
	dbname := os.Getenv("DB_NAME")       // Nama database
	sslmode := os.Getenv("DB_SSLMODE")   // Mode SSL (misal: disable atau require)

	// Format string DSN (Data Source Name) untuk PostgreSQL
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host,
		user,
		password,
		dbname,
		port,
		sslmode,
	)

	// Membuka koneksi database dengan driver postgres
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	// Jika koneksi gagal, hentikan aplikasi (fatal log)
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	log.Println("Database connected successfully")

	return db
}

