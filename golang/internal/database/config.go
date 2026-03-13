package database

import (
	"database/sql"
	"errors"
	"os"
	"strings"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

func DB() (*bun.DB, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, errors.New("DATABASE_URL not set")
	}

	if strings.Contains(dsn, "railway.internal") && os.Getenv("ENV") != "production" {
		return nil, errors.New("railway internal db used outside railway")
	}

	sqldb := sql.OpenDB(pgdriver.NewConnector(
		pgdriver.WithDSN(dsn),
	))

	db := bun.NewDB(sqldb, pgdialect.New())

	if os.Getenv("ENV") != "production" {
		db.AddQueryHook(bundebug.NewQueryHook(
			bundebug.WithVerbose(true),
		))
	}

	return db, nil
}
