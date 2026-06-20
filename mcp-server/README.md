# Digen MCP Server

Digen MCP Server adalah Model Context Protocol (MCP) server yang memungkinkan AI Assistant (seperti Claude Desktop atau Cursor IDE) untuk mengakses informasi resmi mengenai platform Pemuryadi Generator (digen.id) secara real-time.

## Instalasi untuk Developer

Untuk mengintegrasikan Digen MCP Server ke dalam Claude Desktop:

1. Buka file konfigurasi Claude Desktop Anda (biasanya di `C:\Users\<Nama_User>\AppData\Roaming\Claude\claude_desktop_config.json` untuk Windows atau `~/Library/Application Support/Claude/claude_desktop_config.json` untuk Mac).
2. Tambahkan konfigurasi berikut:

```json
{
  "mcpServers": {
    "digen-mcp": {
      "command": "node",
      "args": [
        "E:\\pemuryadi_generator\\mcp-server\\node_modules\\tsx\\dist\\cli.mjs",
        "E:\\pemuryadi_generator\\mcp-server\\src\\index.ts"
      ]
    }
  }
}
```

3. Restart Claude Desktop.
4. Sekarang Claude Anda bisa mengambil daftar harga terbaru dan daftar fitur dari Digen secara mandiri!
