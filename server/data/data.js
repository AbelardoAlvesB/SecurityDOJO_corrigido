const dataBase = require('../config/database').pool;

exports.getUserById = async user_id => {
	return await dataBase.query(
		`SELECT * FROM user_data WHERE id_user = ${user_id}`
	);
};

exports.updateUsername = async (username, user_id) => {
	return await dataBase.query(
		`
    UPDATE 
        user_data 
    SET 
        USERNAME = $1 
    WHERE 
	id_user = $2

    RETURNING USERNAME
    `,
		[username, user_id]
	);
};

exports.getUserByName = async nome => {
	const query = [`%${nome.toLowerCase()}%`]
	const valor = `SELECT id_user, nome, username, email, senha, telefone FROM user_data where lower(nome) like $1`;
	try {
		nome = nome.toLowerCase();
		return await dataBase.query(query, valor);
	} catch (e) {
		const error = `Query Error: 404`;
		throw new Error(error);
	}
};

exports.getNotasByUserId = async user_id => {
	return await dataBase.query(
		'select USER_NOTAS.*, user_data.username from USER_NOTAS inner join user_data on user_data.id_user = USER_NOTAS.id_user where user_data.id_user = $1',
		[user_id]
	);
};
