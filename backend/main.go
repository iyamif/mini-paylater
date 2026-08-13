package main

import (
	"log"
	"os"
	"time"

	"mini-paylater/config"
	"mini-paylater/handler"
	"mini-paylater/model"
	"mini-paylater/repository"
	"mini-paylater/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// main adalah entry point utama untuk memulai aplikasi backend Go
func main() {

	// 1. Memuat file .env (Load Environment Variables)
	config.LoadEnv()

	// 2. Membuka koneksi ke PostgreSQL
	db := config.ConnectDatabase()

	// 3. Menjalankan auto-migration untuk sinkronisasi model skema data ke PostgreSQL
	err := db.AutoMigrate(
		&model.Loan{},
		&model.Installment{},
	)

	// Jika proses migrasi skema tabel gagal, batalkan jalannya server
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// 4. Inisialisasi Dependency Injection (Repository -> Service -> Handler)
	// Membuat instansi Repository
	loanRepository := repository.NewLoanRepository(db)

	// Membuat instansi Service dengan menyisipkan db transaksi dan repository
	loanService := service.NewLoanService(
		db,
		loanRepository,
	)

	// Membuat instansi Handler dengan menyisipkan service
	loanHandler := handler.NewLoanHandler(
		loanService,
	)

	// 5. Inisialisasi router framework Gin
	router := gin.Default()

	// 6. Mengonfigurasi Middleware CORS (Cross-Origin Resource Sharing) agar frontend Next.js dapat mengakses API
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000", // Mengizinkan request dari server dev Next.js (port 3000)
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 7. Endpoint Health check untuk memverifikasi apakah server backend berjalan normal
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
		})
	})

	// 8. Pengelompokan Endpoint API (/api/...)
	api := router.Group("/api")
	{
		api.POST("/loans", loanHandler.CreateLoan) // Endpoint membuat simulasi pinjaman baru
		api.GET("/loans/:id", loanHandler.GetLoan) // Endpoint mengambil detail simulasi berdasarkan ID
	}

	// 9. Menentukan port server dari variabel lingkungan .env
	port := os.Getenv("APP_PORT")

	// Jika port tidak didefinisikan di env, gunakan default port 8080
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on port:", port)

	// 10. Menjalankan server HTTP Gin
	err = router.Run(":" + port)

	// Jika gagal memulai server, tampilkan log error dan hentikan server
	if err != nil {
		log.Fatal(err)
	}
}

