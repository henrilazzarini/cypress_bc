describe('Testes Gerais - BomControle Aplicação', () => {

  const { cnpj } = require('cpf-cnpj-validator');
  let i = 9;

    beforeEach(() => {      
      })
 
    it('Teste 01 - Criação de testdrive com sucesso e direcionamento pro Login', () => {
      //Acesso ao testdrive, preenchimento de email e avanço
      cy.visit('https://mastertestdrive.bomcontrole.company/?origem=desktop');
      cy.get('#email').type('testesgerais_' + i + '@yopmail.com');
      cy.get('#email-form > .btn-submit').click();
      cy.get('#email-form').submit();
      cy.get('#main-form').should('be.visible');

      //Preenchimento dos campos do formulário principal
      cy.get('#nomeEmpresa').type('Testes Gerais Empresa ' + i);
      cy.get('#cnpjEmpresa').type('07.275.920/0001-61');
      cy.get('#nome').type('Testes Gerais Usuário '+ i);
      cy.get('#telefone').type('(11) 97584-1258');
      cy.get('#desafio').select('Gestão Financeira');
      cy.get('.checkbox-custom-label').click();      

      //Confirmando criação do trial e validando sucesso
      cy.get('[class="btn-submit"]').contains('Iniciar teste grátis').click();
      cy.wait(15000); //Futuramente tentar obter resultado do job ao invés de aguardar por tempo
      cy.get('[class="geral-container sucesso-container "]').should('be.visible');    
      
    i++;

    })  

    it('Teste 02 - Tentativa de criação de trial com mesmos dados retornando erro', () => {
      //Acesso ao testdrive, preenchimento do campo e validação de avanço para segunda etapa do formulário
      cy.visit('https://mastertestdrive.bomcontrole.company/?origem=desktop');
      cy.get('#email').click();
      cy.get('#email').type('testesgerais_' + i + '@yopmail.com');
      cy.get('#email-form > .btn-submit').click();
      cy.get('#email-form').submit();
      cy.get('#main-form').should('be.visible');

      //Preenchimento dos campos do formulário principal      
      cy.get('#nomeEmpresa').type('Testes Gerais Empresa');
      cy.get('#nome').type('Testes Gerais Usuário');
      cy.get('#telefone').type('(11) 97584-1258');
      cy.get('#desafio').select('Gestão Financeira');
      cy.get('.checkbox-custom-label').click();      

      //Confirmando criação do trial e validando erro
      cy.get('[class="btn-submit"]').contains('Iniciar teste grátis').click();
      cy.wait(5000); //Futuramente tentar obter resultado do job ao invés de aguardar por tempo
      cy.get('[class="alert alert-warning mx-4"]').should('be.visible');
    }) 
  /*
    it('Teste 03 - Acessar a base e demonstrar interesse na assinatura', () => {
      cy.loginBomControle('testesgerais@yopmail.com', 'Bc021221@');
    })
    */

    it('Teste 04 - Acessando administrativo e fazendo assinatura', () => {
      const randomCNPJ = cnpj.generate();
      cy.loginAdmin('master@bomcontrole.com.br', '021221');
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
      cy.get('#AssinarPrimeiroPlano_DataAtivacao').type('25/06/2024');
      cy.get('button[type="submit"]').contains('Assinar').click();
      //cy.get('span.badge.bg-secondary').should('have.text', '8 usuários');

      idAssinante++;

    }) 


    it('Teste 05 - Cancelando assinatura e excluindo banco de dados', () => {
      
      let idAssinante = 76844;
      cy.loginAdmin('master@bomcontrole.com.br', '021221');
      for (let i = 0; i < 7; i++) {
      cy.get('[class="nav-link text-dark"][href="/Assinantes/Listar"]').click();
      cy.get('#Pesquisa_Codigo').type(idAssinante);
      cy.get('#Pesquisa_TipoSituacao').select('Ativo');
      cy.get('[class="btn btn-secondary"]').should('have.text', "Buscar").click();
      cy.get('[class="icon-link link-dark"][href="/Assinantes/'+idAssinante+'/Editar"]').click();
      cy.get('.nav > :nth-child(4) > .nav-link').click();
      cy.get('#CancelarPorSolicitacaoCliente_DataCancelamento').type('25/06/2024');
      cy.get('#CancelarPorSolicitacaoCliente_Motivo').type('Cancelamento via automação');
      cy.get('button[type="submit"]').contains('Cancelar').click();
      idAssinante ++;
      }
      //cy.get('div > .badge').should('have.text', 'Cancelado');   
    }) 

    
})