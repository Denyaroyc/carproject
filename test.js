await db.getCollection('cars')
    .find({ Range_Km: { $exists: true } }, { projection: { Range_Km: 1, Model: 1 } })
    .sort({ Range_Km: -1 })
    .limit(10)
    .toArray();