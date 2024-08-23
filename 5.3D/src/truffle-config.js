module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      from: '0xb37B51a65c184a35e6628e58aAf04Ba6aCadF158'
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
