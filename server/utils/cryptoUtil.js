const crypto = require("crypto");

exports.eCardDetails = (details) => {
    let cipher = null,
        encrypted = null,
        iv = null,
        final = {};
    const SEMICOLON = ";";
    for (const [key, value] of Object.entries(details)) {
        iv = crypto.randomBytes(16);
        cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Buffer.from(process.env.CARD_ENCRYPTION_KEY, "hex"),
            iv
        );
        encrypted = cipher.update(value);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        final[key] =
            encrypted.toString("base64") + SEMICOLON + iv.toString("base64");
    }
    return final;
};

exports.dCardDetails = (entries, unlocked) => {
    let iv = null,
        eText = null,
        decipher = null,
        decrypted = null,
        temp = {};
    const lockedKeys = ["_id", "cardnumLast4", "month", "year", "cardType"];
    const unlockedKeys = [...lockedKeys, "cardnum", "cvv"];
    const final = [];

    for (const entry of entries) {
        temp = {};
        for (const key of unlocked ? unlockedKeys : lockedKeys) {
            if (key === "_id") {
                temp[key] = entry[key];
                continue;
            }
            [eText, iv] = entry[key].split(";");
            decipher = crypto.createDecipheriv(
                "aes-256-cbc",
                Buffer.from(process.env.CARD_ENCRYPTION_KEY, "hex"),
                Buffer.from(iv, "base64")
            );
            decrypted = decipher.update(eText, "base64");
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            temp[key] = decrypted.toString();
        }
        if (!unlocked) {
            temp["cardnum"] = null;
            temp["cvv"] = null;
        }
        final.push(temp);
    }
    return final;
};
