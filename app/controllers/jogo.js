module.exports.jogo = (application, req, res) => {
	
	if (req.session.autorizado)
		res.render('jogo')
	else
		res.send("Usuario precisa fazer o login")
}

module.exports.sair = (application, req, res) => 
	req.session.destroy((err) => res.render("index", {validacao: {}}))