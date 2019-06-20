cfg = {
    _id: "rs0",
    members: [
        { _id: 0, host: "mongodb_primary:27017" },
        { _id: 1, host: "mongodb_secondary:27017" },
        { _id: 2, host: "mongodb_arbiter:27017", arbiterOnly: true }
    ]
}
rs.initiate(cfg)