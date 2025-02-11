const { Pool } = require('pg'); // Import the Pool class from the pg module

class User {
    constructor(id, username, email, role, createdAt, updatedAt) {
        // Initialize the User object with the provided parameters
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static method to fetch user details from the database
    static async fetchUserDetails(userId) {
        // Create a new pool instance with the database connection details
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'eduana', // Change this to your database
            password: 'Heat001#',   // Change this to your password
            port: 5432,
        });

        try {
            // Execute the query to fetch user details by userId
            const res = await pool.query('SELECT id, username, email, role, created_at, updated_at FROM public."user" WHERE id = $1', [userId]);
            if (res.rows.length > 0) {
                // If user is found, create and return a new User object
                const user = res.rows[0]; 
                return new User(user.id, user.username, user.email, user.role, user.created_at, user.updated_at); 
            } else {
                // If no user is found, throw an error
                throw new Error('User not found');
            }
        } catch (err) {
            // Log and rethrow any errors that occur during the query
            console.error(err);
            throw err;
        } finally {
            // Close the pool to release the database connection
            await pool.end();
        }
    }
}

// Export the User class for use in other modules
module.exports = User;