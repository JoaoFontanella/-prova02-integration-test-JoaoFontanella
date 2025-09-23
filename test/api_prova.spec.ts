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

describe('Teste POST de Objetos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Adicionar um novo objeto', async () => {
    const newObject = {
      name: 'Smartphone XYZ',
      data: {
        price: 499.99,
        color: 'Black',
      },
    };

    await p
      .spec()
      .post(`${baseUrl}/objects`)
      .withJson(newObject)
      .expectStatus(StatusCodes.OK)
  });
});
