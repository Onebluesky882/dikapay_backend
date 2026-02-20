package main

import (
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Use("/ws", func(c *fiber.Ctx) error {

		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrLengthRequired
	})

	app.Get("/ws/:id", websocket.New(func(c *websocket.Conn) {
		id := c.Params("id")

		log.Println("connected id:", id)
		log.Println("query v:", c.Query("v"))

		// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index

		for {
			mt, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("connection closed:", err)
				break
			}

			log.Printf("recv from %s: %s\n", id, msg)

			// echo กลับ
			if err := c.WriteMessage(mt, msg); err != nil {
				log.Println("write error:", err)
				break
			}
		}
	}))
	log.Fatal(app.Listen(":3000"))
}
