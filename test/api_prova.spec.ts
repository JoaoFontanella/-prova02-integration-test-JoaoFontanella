import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Teste POST de Produtos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('ADD um produto no carrinho', async () => {
    const newProduct = {
      title: 'Caneca',
      price: 29.99,
      description: 'Caneca de cerâmica',
      image: 'https://teste.com',
      category: 'Cozinha'
    };

    await p
      .spec()
      .post(`${baseUrl}/products`)
      .withJson(newProduct)
      .expectStatus(StatusCodes.CREATED)
  });
});