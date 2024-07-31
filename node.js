/* spell-checker: disable */
import Discord from 'discord.js';
import mysql from 'mysql';

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.abcraft19.duckdns.org,
     user: process.env.root,
     password: process.env.ABCraft19.yt,
    database: 'quoicoubeh'
});

// Connect to the database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');

    // Create the table if it doesn't exist
    connection.query(
        `CREATE TABLE IF NOT EXISTS quoicoubeh.quoicoubot (
            pseudo TEXT NOT NULL,
            nombre_de_quoicoubeh INT NOT NULL DEFAULT 1,
            serveur TEXT NOT NULL
        ) ENGINE = InnoDB;`,
        (err) => {
            if (err) {
                console.error('Error creating table:', err);
                connection.release();
                return;
            }
            console.log('Table created successfully!');
            connection.release();
        }
    );
});

const client = new Discord.Client({ intents: 32767 });

client.on('messageCreate', async (message) => {
    const { author, guild, content } = message;
    const username = author.username;
    const serverName = guild.name;
    const messageContent = content;

    if (messageContent === '!quoicoubeh') {
        try {
            const connection = await getConnectionFromPool();
            const [row] = await executeQuery(connection, `
                SELECT nombre_de_quoicoubeh
                FROM quoicoubot
                WHERE pseudo = ?
                AND serveur = ?
            `, [username, serverName]);

            if (!row) {
                await executeQuery(connection, `
                    INSERT INTO quoicoubot (pseudo, serveur)
                    VALUES (?, ?)
                `, [username, serverName]);
            } else {
                const { nombre_de_quoicoubeh } = row;
                await executeQuery(connection, `
                    UPDATE quoicoubot
                    SET nombre_de_quoicoubeh = ?
                    WHERE pseudo = ?
                    AND serveur = ?
                `, [nombre_de_quoicoubeh + 1, username, serverName]);
            }

            connection.release();
        } catch (err) {
            console.error('Error executing query:', err);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

function getConnectionFromPool() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

function executeQuery(connection, query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}