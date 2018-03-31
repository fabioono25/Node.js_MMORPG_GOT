module.exports.index = function(application, req, res){
	res.render('index', {validacao:{}})
}

module.exports.autenticar = (application, req, res) => {

	const dadosForm = req.body

	req.assert('usuario', 'usuario vazio!').notEmpty();
	req.assert('senha', 'senha vazia!').notEmpty();

	const erros = req.validationErrors()

	if (erros){
		res.render('index', {validacao: erros})
		return
	}

	//autenticacao
	const connection = application.config.dbConnection
	const UsuariosDAO = new application.app.models.UsuariosDAO(connection)

	UsuariosDAO.autenticar(dadosForm, req, res)

	//res.send('tudo ok para criar a sessao')
}