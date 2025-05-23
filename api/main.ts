import { Application, Router } from 'jsr:@oak/oak';
import { fakerIT as faker } from 'npm:@faker-js/faker';

const router = new Router();

router.get('/api/data', (ctx) => {
  const fakeName = faker.person.firstName();
  const fakeSurname = faker.person.lastName();

  const fakeData = {
    name: fakeName,
    surname: fakeSurname,
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      province: faker.location.county(),
      zipCode: faker.location.zipCode(),
    },
    contacts: {
      email: faker.internet.email({
        firstName: fakeName,
        lastName: fakeSurname,
      }),
      phone: faker.phone.number(),
    },
    company: faker.company.name(),
    birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  };

  ctx.response.headers.set('Content-Type', 'application/json; charset=utf-8');
  ctx.response.body = fakeData;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
