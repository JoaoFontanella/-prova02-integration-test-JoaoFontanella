import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Teste GET de Produtos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('GET de todos os produtos', async () => {
    await p
      .spec()
      .get(`${baseUrl}/products`)
      .expectStatus(StatusCodes.OK)
  });
});

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

describe('Teste PUT de Produtos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Dando Update no produto', async () => {
    const updatedProduct = {
      title: 'Caneca Att',
      price: 35.00,
      description: 'Caneca de cerâmica Att',
      image: 'https://teste.com',
      category: 'Cozinha'
    };
    
    await p
      .spec()
      .put(`${baseUrl}/products/1`)
      .withJson(updatedProduct)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        id: 1,
        title: updatedProduct.title,
        price: updatedProduct.price,
        description: updatedProduct.description,
        category: updatedProduct.category,
        image: updatedProduct.image
      });
  });
});
