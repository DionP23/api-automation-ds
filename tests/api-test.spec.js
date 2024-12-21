const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');
const ajv = new Ajv();

const headers = {
  Accept: "application/json",
};

test.describe('API Automation Tests', () => {
  test('GET - List Users', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users?page=2');
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    const schema = require('./jsonschema/get-object-schema.json');
    const isValid = ajv.validate(schema, responseBody);

    expect(isValid).toBeTruthy();
  });

  test('POST - Create User', async ({ request }) => {
    const bodyData = {
      name: "morpheus",
      job: "leader",
    };

    const response = await request.post('https://reqres.in/api/users', {
      headers: headers,
      data: bodyData,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();

    // Validasi response
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.name).toBe(bodyData.name);
  });

  test('PUT - Update User', async ({ request }) => {
    const bodyData = {
      name: "morpheus",
      job: "zion resident",
    };

    const response = await request.put('https://reqres.in/api/users/2', {
      headers: headers,
      data: bodyData,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    // Validasi response
    expect(responseBody.name).toBe(bodyData.name);
    expect(responseBody.job).toBe(bodyData.job);
  });

  test('DELETE - Remove User', async ({ request }) => {
    const response = await request.delete('https://reqres.in/api/users/2');
    expect(response.status()).toBe(204);
  });
});
