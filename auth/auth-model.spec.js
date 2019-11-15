const db = require('../database/dbConfig');

const { add } = require('./auth-model');

describe('auth model', function() {
    describe('add()', function() {
        beforeEach(async () => {
          await db('users').truncate();
        });
     
        it('should add a user', async function() {
          await add({ username: 'Ian', password: 'abc' })

          const users = await db('users');
          
          expect(users).toHaveLength(1);
    });

    it('should add the provided user', async function() {
        await add({ username: 'Ian', password: 'abc' });
        await add({ username: 'John', password: 'abcd' });

        const users = await db('users');

        expect(users).toHaveLength(2);
        expect(users[0].username).toBe('Ian');
        expect(users[1].username).toBe('John');
    });
  });
});