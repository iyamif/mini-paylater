package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"mini-paylater/model"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDatabase() *gorm.DB {

	err := godotenv.Load()

	if err != nil {
		log.Println("Warning: .env file not found")
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host,
		port,
		user,
		password,
		dbname,
		sslmode,
	)

	db, err := gorm.Open(
		postgres.New(postgres.Config{
			DSN:                  dsn,
			PreferSimpleProtocol: true, // Needed for transaction poolers like PgBouncer / Supabase pooler
		}),
		&gorm.Config{
			PrepareStmt: false,
		},
	)

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	log.Println("Database connected successfully")

	sqlDB, err := db.DB()

	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(20)
	sqlDB.SetConnMaxLifetime(time.Hour)

	err = db.AutoMigrate(
		&model.Loan{},
		&model.Installment{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed")

	return db
}
