describe('Fluxo de Busca no GitHub', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  })

  it('deve realizar uma busca completa com sucesso', () => {
    const userToSearch = 'laissugeda'

    // 1. Localiza o input pelo ID e digita o nome
    cy.get('#github-search').should('be.visible').type(userToSearch)

    // 2. Clica no botão que contém o texto "Buscar"
    cy.get('.btn-search').click()

    // 3. Verifica se a aplicação carregou o card do usuário
    cy.contains(userToSearch, { timeout: 10000 }).should('be.visible')

    // 4. Navega para os repositórios
    cy.contains('Repositórios').click()

    // 5. Validação final: URL e conteúdo da lista
    cy.url().should('include', '/user/')
    cy.url().should('include', '/repos')
    cy.get('li', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('não deve disparar busca se o campo estiver vazio (validação do trim)', () => {
    // Tenta clicar sem digitar nada
    cy.get('.btn-search').click()

    cy.url().should('match', /localhost:4200\/($|search)/)
  })
})
