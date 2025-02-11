const { Pool } = require('pg');

class User {
    constructor(id, username, email, role, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async fetchUserDetails(userId) {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'eduana', // Change this to your database
            password: 'Heat001#',   // Change this to your password
            port: 5432,
        });

        try {
            const res = await pool.query('SELECT id, username, email, role, created_at, updated_at FROM public."user" WHERE id = $1', [userId]); 
            if (res.rows.length > 0) {
                const user = res.rows[0]; 
                return new User(user.id, user.username, user.email, user.role, user.created_at, user.updated_at); 
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            await pool.end();
        }
    }
}

module.exports = User;