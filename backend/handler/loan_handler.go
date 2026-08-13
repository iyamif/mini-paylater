package handler

import (
	"mini-paylater/dto"
	"mini-paylater/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// menampung logika HTTP handler/controller untuk endpoint pinjaman
type LoanHandler struct {
	service service.LoanService // Hubungan ke layer service/bisnis
}

// constructor untuk instansiasi handler baru
func NewLoanHandler(
	service service.LoanService,
) *LoanHandler {
	return &LoanHandler{
		service: service,
	}
}

// meng-handle POST request untuk mendaftarkan dan mengajukan pinjaman baru
func (h *LoanHandler) CreateLoan(c *gin.Context) {
	var req dto.CreateLoanRequest

	// Mengikat JSON request body ke objek DTO CreateLoanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// Jika format JSON tidak valid, kirim respon status 400 Bad Request
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	// Memanggil layer service untuk memproses logika pembuatan pinjaman
	result, err := h.service.CreateLoan(req)

	// Jika ada error pada proses bisnis (misal: validasi gagal), kirim status 400 Bad Request
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// Jika berhasil, kirim respon status 201 Created beserta data simulasi pinjaman
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Loan created successfully",
		"data":    result,
	})
}

// meng-handle GET request untuk mengambil rincian pinjaman beserta cicilan berdasarkan parameter ID
func (h *LoanHandler) GetLoan(c *gin.Context) {
	// Mengambil parameter ID dari URL
	idParam := c.Param("id")

	// Mengubah parameter string ID menjadi tipe data uint64
	id, err := strconv.ParseUint(idParam, 10, 64)

	// Jika konversi gagal (bukan angka), kirim respon status 400 Bad Request
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid loan ID",
		})
		return
	}

	// Memanggil layer service untuk mencari data pinjaman berdasarkan ID
	result, err := h.service.GetLoanByID(id)

	if err != nil {
		// Jika data tidak ditemukan di database, kirim respon status 404 Not Found
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Loan not found",
			})
			return
		}

		// Jika terjadi error server internal lainnya, kirim respon status 500 Internal Server Error
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to get loan",
		})
		return
	}

	// Jika sukses, kirim respon status 200 OK dengan detail data pinjaman
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

