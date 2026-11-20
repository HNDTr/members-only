const pool = require('./pool');


// don't need to insert membership status, by default it is false
async function insertUser({ firstName, lastName, username, email, password }) {
    const sql = `
        INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(sql, [firstName, lastName, username, email, password]);
}

async function findEmail(email){
    const sql = `
        SELECT * FROM users WHERE email = $1
    `;
    const rows = await pool.query(sql, [email])
    return rows
}

async function findUsername(username){
    const sql = `
        SELECT * FROM users WHERE username = $1
    `;
    const rows = await pool.query(sql, [username])
    return rows
}

async function updateUserMembership(email){
    const sql = `
        UPDATE users
        SET membership = True
        WHERE email = $1
    `
    await pool.query(sql, [email])

}

module.exports = {
    insertUser, 
    findEmail,
    findUsername,
    updateUserMembership
}