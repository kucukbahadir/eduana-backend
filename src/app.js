const express = require("express");
const healthCheckerRouter = require("./routes/healthchecker");

const app = express();
app.use(express.json());

// Import CORS to allow cross-origin requests
const cors = require("cors");
app.use(cors());

// Existing health checker route
app.use("/api", healthCheckerRouter);

// Login Route with Error Logging & UserType Handling
app.post("/api/login/:userType", (req, res) => {
    try {
        const userType = req.params.userType.toUpperCase(); // Convert to uppercase
        const credentials = req.body;

        console.log(`Login attempt for userType: ${userType}`, credentials);

// TODO replace this with looking up the person in the database once we have users in the database

        // Sample users for authentication (with uppercase userTypes)
        const users = {
            STUDENT: { name: "Christian", code: "1234", redirect: "/dashboard/student" },
            PARENT: { email: "jan@gmail.com", password: "Jan1", redirect: "/dashboard/parent" },
            EDUCATORS: {
                ADMIN: { email: "admin@gmail.com", password: "Admin1", redirect: "/dashboard/admin" },
                COORDINATOR: { email: "coordinator@gmail.com", password: "Coordinator1", redirect: "/dashboard/coordinator" },
                TEACHER: { email: "brenda@gmail.com", password: "Brenda1", redirect: "/dashboard/teacher" }
            }
        };

        if (userType === "STUDENT") {
            if (credentials.name === users.STUDENT.name && credentials.code === users.STUDENT.code) {
                console.log(`✅ Student ${credentials.name} logged in successfully.`);
                return res.json({ success: true, redirect: users.STUDENT.redirect });
            }
        } else if (userType === "PARENT") {
            if (credentials.email === users.PARENT.email && credentials.password === users.PARENT.password) {
                console.log(`✅ Parent ${credentials.email} logged in successfully.`);
                return res.json({ success: true, redirect: users.PARENT.redirect });
            }
        } else if (userType === "EDUCATORS") {
            const educator = Object.values(users.EDUCATORS).find(
                (user) => user.email === credentials.email && user.password === credentials.password
            );
            if (educator) {
                console.log(`✅ Educator ${credentials.email} logged in successfully.`);
                return res.json({ success: true, redirect: educator.redirect });
            }
        }

        console.error(`❌ Failed login attempt for userType: ${userType}`, credentials);
        return res.status(401).json({ success: false, message: "Invalid credentials" });

    } catch (error) {
        console.error("❌ Error during login:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = app;
