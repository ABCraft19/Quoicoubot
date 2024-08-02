/* spell-checker: disable */

module.exports = {

	database: {
        serveur: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
	},
    discord: {
        token: process.env.DISCORD_TOKEN
    }
};