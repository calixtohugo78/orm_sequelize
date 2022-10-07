const Services = require('./Services')
const database = require('../models')

class PessoasServices extends Services {
    constructor() {
        super('Pessoas')
        this.matriculas = new Services('Matriculas')
    }

    async pegaRegistrosAtivos(where = {}) {
        return database[this.nomeDoModelo].findAll({ where: { ...where } })
    }

    async pegaTodosRegistros(where = {}) {
        return database[this.nomeDoModelo].scope('todos').findAll({ where: { ...where } })
    }

    async cancelaPessoaEMatriculas(estudanteId) {
        return database.sequelize.transaction(async transacao => {
            await super.atualizaRegistro(estudanteId, { ativo: false }, { transaction: transacao })
            await this.matriculas.atualizaRegistros({ estudante_id: estudanteId }, { status: 'cancelado' }, { transaction: transacao })
        })
    }
}

module.exports = PessoasServices