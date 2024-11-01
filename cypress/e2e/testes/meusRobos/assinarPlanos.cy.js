describe('Assinatura', () => {

    const { cnpj } = require('cpf-cnpj-validator');
  
    beforeEach(() => {      
        })
  
    it('Assinar planos', () => {

        cy.loginAdmin('master@bomcontrole.com.br', '021221');

        for (let idAssinante = 76862; idAssinante < 76867; idAssinante++) {

            const randomCNPJ = cnpj.generate();
            const dayjs = require('dayjs');
            const dataHoje = dayjs().format('DD/MM/AAAA');

            
            cy.get('[class="nav-link text-dark"][href="/Assinantes/Listar"]').click();
            cy.get('#Pesquisa_Codigo').type(idAssinante);
            cy.get('#Pesquisa_TipoSituacao').select('Ativo');
            cy.get('[class="btn btn-secondary"]').should('have.text', "Buscar").click();
            cy.get('[class="icon-link link-dark"][href="/Assinantes/'+ idAssinante + '/Editar"]').click();
        
            cy.get('#Assinante_Documento').type(randomCNPJ);
            cy.get('#Assinante_DiaVencimentoFatura').select('10');
            cy.get('#Assinante_CEP').type('09750230');
            cy.get('#Assinante_Logradouro').type('Rua Borda do Campo');
            cy.get('#Assinante_Numero').type('123');
            cy.get('#Assinante_Bairro').type('Jardim do Mar');
            cy.get('#Assinante_Cidade').type('São Bernardo do Campo');
            cy.get('#Assinante_UF').select('SP');
            cy.get('.btn-dark').contains('Salvar').click();
            cy.url().should('contains', 'https://masterbcadminui.bomcontrole.company/Assinantes/Listar');
        
            cy.get('#Pesquisa_Codigo').type(idAssinante);
            cy.get('#Pesquisa_TipoSituacao').select('Ativo');
            cy.get('[class="btn btn-secondary"]').should('have.text', "Buscar").click();
            cy.get('[class="icon-link link-dark"][href="/Assinantes/'+ idAssinante + '/Editar"]').click();
        
            cy.get('.nav > :nth-child(4) > .nav-link').click();
            cy.get('#AssinarPrimeiroPlano_EmpresaFaturamentoId').select(1);
            cy.get('#AssinarPrimeiroPlano_PlanoAssinaturaId').select('4 usuários');
            cy.get('#AssinarPrimeiroPlano_DataAtivacao').type(dataHoje);
            cy.get('button[type="submit"]').contains('Assinar').click();      
        }
            
      })
  })