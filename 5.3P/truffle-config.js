module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      from: '0x3e696e76627ef96471032E1bb281E2E9D3c14a98'
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
