const { PrismaClient } = require('@prisma/client');

const userSchema = new PrismaClient({
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    confirmPassword: String,
    cgu: Boolean
});

module.exports = PrismaClient.model("User", userSchema);