const request = require('supertest');
const app = require('../app');
const db = require('../db');



beforeAll(async () => {
    await db.query("DELETE FROM companies");
    await db.query("INSERT INTO companies (code, name, description) VALUES ('apple', 'Apple inc.', 'Tech Company')");
});



afterAll(async () => {
    await db.end();
});



// Test GET /companies
it('should return a list of companies.', async () => {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('companies');
    expect(res.body.companies).toHaveLength(1);
});


// Test Get /companies/:code
it('should return details of a company', async () => {
    const res = await request(app).get('/companies/apple');
    expect(res.statusCode).toBe(200);
    expect(res.body.company.code).toBe('apple');
})



//Test Post /companies
it('should create a new company', async () => {
    const res = await request(app).post('/companies').send({
        "code": 'ibm',
        "name": 'IBM corp',
        "description": 'Tech Giant',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.company.code).toBe('ibm-corp');
});


// Run tests with coverage using Jest
// Add the following to your package.json under "scripts":
// "scripts": {
//   "test": "jest --coverage"
// }

// Then run:
// npm test