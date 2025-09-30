import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Teste GET de Objetos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Listar todos os objetos', async () => {
    await p
      .spec()
      .get(`${baseUrl}/objects`)
      .expectStatus(StatusCodes.OK)
  });
});

//Aqui tem 4 Testes seguidos pois todos precisam de um ID que foi criado, não da pra usar um que ja existia na API
describe('Teste POST,PUT,PATH e DELETE de Objetos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';
  let id_objeto: string | number;


  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  //Post
  it('Adicionar um novo objeto', async () => {
    const newObject = {
      name: 'Notebook Negativo',
      data: {
        year: 2024,
        color: 'Cinza',
        price: 999
      },
    };

    id_objeto = await p
      .spec()
      .post(`${baseUrl}/objects`)
      .withJson(newObject)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        name: newObject.name,
        data: newObject.data
      })
      .returns('id');
  });

  //Put
  it('Atualizar objeto existente pelo ID', async () => {
    const updatedObject = {
      name: 'Notebook Negativo Atualizado',
      data: {
        year: 2025,
        color: 'Preto',
        price: 1299
      },
    };

    await p
      .spec()
      .put(`${baseUrl}/objects/${id_objeto}`)
      .withJson(updatedObject)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        name: updatedObject.name,
        data: updatedObject.data
      });
  });

  //Path
  it('Atualizar objeto criado com PATCH por ID', async () => {
    const patchObject = { name: 'Notebook Teste Atualizado' };

    await p
      .spec()
      .patch(`${baseUrl}/objects/${id_objeto}`)
      .withJson(patchObject)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({ name: patchObject.name });
  });

  //Delete
  it('Deletar objeto criado pelo ID e validar se foi deletedo', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/objects/${id_objeto}`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        message: `Object with id = ${id_objeto} has been deleted.`
      });
  });
});

describe('Teste GET de Objeto por ID', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Buscar objeto pelo ID', async () => {
    await p
      .spec()
      .get(`${baseUrl}/objects/5`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        id: "5",
        name: "Samsung Galaxy Z Fold2",
        data: {
          price: 689.99,
          color: "Brown"
        }
      });
  });
});

describe('Teste de Erro - Buscar objeto que não existe', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Burcar objeto que não existe, tem que dar NOT_FOUND', async () => {
    await p
      .spec()
      .get(`${baseUrl}/objects/999`)
      .expectStatus(StatusCodes.NOT_FOUND)
      .expectJsonLike({
        error: "Oject with id=999 was not found." //API DEIXOU ERRADO E FICOU COMO "Oject" SE NÃO DA ERRO KK
      });
  });
});

describe('Teste de Erro - Deletar objeto que não existe', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  //Delete
  it('Deletar objeto por um ID que não existe', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/objects/00000000`)
      .expectStatus(StatusCodes.NOT_FOUND)
      .expectJsonLike({
        error: `Object with id = 00000000 doesn't exist.`
      });
  });
});

describe('Teste de Erro - Atualizar objeto que não existe', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Atualizar objeto que não existe', async () => {
    await p
      .spec()
      .patch(`${baseUrl}/objects/00000000`)
      .expectStatus(StatusCodes.NOT_FOUND)
      .expectJsonLike({
        error: `Object with id = 00000000 doesn't exist.`
      });
  });
});

describe('Teste de Erro - Criar objeto inválido', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Tentar criar objeto sem o campo obrigatório "name"', async () => {
    const invalidObject = {
      data: {
        year: 2024,
        color: 'Branco',
        price: 1500
      }
    };

    await p
      .spec()
      .post(`${baseUrl}/objects`)
      .withJson(invalidObject)
      .expectStatus(StatusCodes.BAD_REQUEST)
      .expectJsonLike({
        error: "Missing required field: name"
      });
  });
});
