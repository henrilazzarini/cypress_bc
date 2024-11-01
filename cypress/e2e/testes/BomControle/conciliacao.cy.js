describe('Conciliação - Testes Gerais', () => {

    beforeEach('Realizando o login', () => {
        cy.autenticacaoBomControle();
      }) 

    // Função para configurar interceptações de API
    const interceptarPesquisa = (alias, url) => {
        cy.intercept({ method: 'GET', url }).as(alias);
    };
  
    // Função para esperar e validar resposta de interceptação
    const validarResposta = (alias, statusCode, property, value) => {
        cy.wait(alias).then(({ response }) => {
            expect(response.statusCode).to.equal(statusCode);
            if (property && value) {
                expect(response.body.Itens[0]).to.have.property(property, value);
            }
    });
    };
  
    it('Validando sugestões de vínculo, criação por texto e movimentações vinculadas pela modal', () => {
        interceptarPesquisa(
            'pesquisaExtratos',
            '**/api/ImportacaoExtratoFinanceiro/ListarImportacoes**'
        );
        cy.get('a[href="/financeiro/conciliacao/boas-vindas"], a[href="/financeiro/conciliacao"]').click({ force: true });
        validarResposta('@pesquisaExtratos', 200);

        cy.get('#range-date').click();
        cy.get('.left .input-mini')
            .click() 
            .type('{selectAll}{backspace}') 
            .type('01/10/2024', { delay: 20 });
        cy.get('.right .input-mini')
            .click() // Clica no campo
            .type('{selectAll}{backspace}')
            .type('31/10/2024', { delay: 20 });
            cy.focused().type('{enter}');
            cy.get('.applyBtn').click();

        cy.get('button[uib-tooltip="Pesquisar extrato"]').click();

        //Sugestão de conciliação por data e valor - despesa
        function verificarVinculoMovimentacaoExistente(indice, textoConteudo) {
            cy.get('.titulo-parcela-conciliacao')
                .eq(indice)
                .invoke('attr', 'uib-tooltip-html')
                .should('contain', textoConteudo);
        }
        
        verificarVinculoMovimentacaoExistente(0, 'Pagamento DO(A) Fornecedora de Energia Eletrica NO VALOR R$ 490.85 (PARCELA UNICA NO DIA 1)');
        verificarVinculoMovimentacaoExistente(1, 'Recebimento DO(A) Primeiro Cliente LTDA NO VALOR R$ 80.00 (PARCELA UNICA NO DIA 13)');

        function verificarMovimentacao(indice, tooltipConteudoTextoExtrato, avisoCriacaoPorTextoDePara) {
            cy.get('.titulo-parcela-conciliacao')
                .eq(indice)
                .invoke('attr', 'uib-tooltip-html')
                .should('contain', tooltipConteudoTextoExtrato);
                
            cy.get('.item-left.item-parcela-extrato')
                .eq(indice)
                .find('span[ng-if="parcelaItem.configuracaoDeParaEncontrada"]')
                .invoke('text')
                .then((textoMovimentacao) => {
                    expect(textoMovimentacao).to.exist;
                    expect(textoMovimentacao).to.contain(avisoCriacaoPorTextoDePara);
                });
            }
            
        verificarMovimentacao(2, 'PIX RECEBIDO: "CP :18236120-DANIELA MONTEIRO QUELES"', 'Essa movimentação será criada');
        verificarMovimentacao(3, 'PIX ENVIADO: "CP :18236120-BIANCA TAVARES SILVA"', 'Essa movimentação será criada');               
        verificarMovimentacao(4, 'TRANSFERENCIA RECEBIDA: "341 587 41682 UNIMED BELO HORIZONTE COOPERAT"', 'Essa movimentação será criada');               
        verificarMovimentacao(5, 'COMPRA NO DEBITO: "NO ESTABELECIMENTO VILLEFORT ATACADISTA BELO HORIZ"', 'Essa movimentação será criada');
           
        cy.get('#linha6 > .pl35 > .btn').click();
        cy.get('.btn.btn-success.dropdown-toggle.novo-lancamento').click();
        interceptarPesquisa('obterConfiguracoes', '**/api/Financeiro/ObterConfiguracoesGerais');
        cy.get('a[ng-click="modalMovimentacao(tipoMovimentacaoEnum.despesaFornecedor, true)"]').click();
      
        //Validação da Empresa, Conta Bancária e Data de Vencimento, com base nos dados do extrato
        interceptarPesquisa('obterConfiguracoes', '**/api/Financeiro/ObterConfiguracoesGerais');
        validarResposta('@obterConfiguracoes', 200, 'FormaPagamentoPadrao.Nome', 'Transferência Bancária'); 

        //Seleção de fornecedor
        cy.get('[ng-model="movimentacao.pessoa"]')
            .click()
            .get('.ui-select-choices') 
            .should('be.visible');       
        interceptarPesquisa('pesquisaFornecedores', '**/api/Pesquisa/PesquisaFornecedorCombo**');        
        cy.get('[ng-model="movimentacao.pessoa"] input[type="search"]')
            .type('LOJA DO NICOLAU'); 
        validarResposta('@pesquisaFornecedores', 200, {delay: 100});
        //cy.wait(2000);
        cy.focused().type('{enter}');


        //Seleção de Categoria Financeira



    })




})

