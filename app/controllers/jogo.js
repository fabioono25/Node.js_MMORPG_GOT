module.exports.jogo = (application, req, res) => {
	
	if (!req.session.autorizado){
		res.send("Usuario precisa fazer o login")
		return
	}

	let msg = ''

	if (req.query.msg != '')
		msg = req.query.msg

	//console.log(comando_invalido)

	const usuario = req.session.usuario
	const casa = req.session.casa

	const connection = application.config.dbConnection
	const jogoDAO = new application.app.models.JogoDAO(connection)	

	jogoDAO.iniciaJogo(res, usuario, casa, msg)

	//res.render('jogo', {img_casa: req.session.casa})
		
}

module.exports.sair = (application, req, res) => 
	req.session.destroy((err) => res.render("index", {validacao: {}}))

module.exports.suditos = (application, req, res) => {

	if (!req.session.autorizado){
		res.send("Usuario precisa fazer o login")
		return
	}

	res.render("aldeoes", {validacao:{}})
}
	
module.exports.pergaminhos = (application, req, res) => {

	if (!req.session.autorizado){
		res.send("Usuario precisa fazer o login")
		return
	}

	const connection = application.config.dbConnection
	const jogoDAO = new application.app.models.JogoDAO(connection)

	const usuario = req.session.usuario

	jogoDAO.getAcoes(usuario, res)
}

module.exports.ordenar_acao_sudito	 = (application, req, res) => {

	if (!req.session.autorizado){
		res.send("Usuario precisa fazer o login")
		return
	}

	let dadosForm = req.body

	req.assert("acao", "Ação deve ser informada").notEmpty()
	req.assert("quantidade", "Quantidade deve ser informada").notEmpty()

	const erros = req.validationErrors()

	if (erros){
		res.redirect('jogo?msg=A')
		return
	}

	const connection = application.config.dbConnection
	const jogoDAO = new application.app.models.JogoDAO(connection)

	dadosForm.usuario = req.session.usuario

	jogoDAO.acao(dadosForm)

	res.redirect('jogo?msg=B')
}

module.exports.revogar_acao = (application, req, res) => {
	const url_query = req.query

	const connection = application.config.dbConnection
	const jogoDAO = new application.app.models.JogoDAO(connection)

	const _id = url_query.id_acao
	jogoDAO.revogarAcao(_id, res)
}