import bcrypt from "bcrypt";

const password = "admin123"; // password asli
const hashed = bcrypt.hashSync(password, 10);

console.log("Hash:", hashed);