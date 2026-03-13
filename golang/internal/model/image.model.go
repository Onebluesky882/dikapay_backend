package model

import (
	"time"

	"github.com/uptrace/bun"
)

type Image struct {
	bun.BaseModel `bun:"table:images"`

	ID        string    `bun:"pk" json:"id"`
	UserId    string    `bun:"user_id"`
	Name      string    `bun:"name"`
	ImageKey  string    `bun:"image_key"`
	ImageType string    `bun:"image_type"`
	CreatedAt time.Time `bun:"timestamp"`
	UpdatedAt time.Time `bun:"timestamp"`
}
