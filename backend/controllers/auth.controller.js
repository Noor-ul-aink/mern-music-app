const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/dbMySQL");

// REGISTER
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return next(err);
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN
const loginUser = (req, res, next) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.length === 0) {
            res.status(404);
            return next(new Error("User not found"));
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401);
            return next(new Error("Invalid password"));
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "30d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    });
};

module.exports = { registerUser, loginUser };
