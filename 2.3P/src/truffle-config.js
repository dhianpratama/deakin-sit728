module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      from: '0x3e696e76627ef96471032E1bb281E2E9D3c14a98'
    }
  }
};
