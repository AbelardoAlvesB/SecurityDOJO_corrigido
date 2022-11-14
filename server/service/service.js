const sanitizeHtml = require('sanitize-html');

const {
	getUserByName,
	getUserById,
	updateUsername,
	getNotasByUserId,
} = require('../data/data');

exports.getUserByName = async nome => {
	const nomeSanitizaded = sanitizeHtml(nome);
	return await getUserByName(nomeSanitizaded);
};

exports.updateUsername = async (novo_username, user_id) => {
	const novo_usernameSanitizaded = sanitizeHtml(novo_username);
	return await updateUsername(novo_usernameSanitizaded, user_id);
};

exports.getUserById = async user_id => {
	return await getUserById(user_id);
};

exports.getNotasByUserId = async user_id => {
	return await getNotasByUserId(user_id);
};
