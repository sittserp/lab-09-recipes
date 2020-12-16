const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/Log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get(`/api/v1/recipes/${recipes[0].id}`)
      .then(res => {
        expect(res.body).toEqual(recipes[0]);
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('creates a log', () => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: '1',
        dateOfEvent: 'Dec. 15, 2020',
        notes: 'This was a good batch.',
        rating: '5 stars'
      })
      .then(res => {
        expect(res.body).toEqual({
          recipeId: '1',
          dateOfEvent: 'Dec. 15, 2020',
          notes: 'This was a good batch.',
          rating: '5 stars'
        });
      });
  });

  it('gets all logs', async() => {
    await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    const logs = await Promise.all([
      {
        recipeId: 1,
        dateOfEvent: 'Dec. 15, 2020',
        notes: 'This was a good batch.',
        rating: '5 stars',
      },
      {
        recipeId: 1,
        dateOfEvent: 'Dec. 15, 2020',
        notes: 'This was a good batch.',
        rating: '5 stars',
      },
      {
        recipeId: 1,
        dateOfEvent: 'Dec. 15, 2020',
        notes: 'This was a good batch.',
        rating: '5 stars',
      }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('gets a log by recipeId', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    const log = await Log.insert({
      recipeId: '1',
      dateOfEvent: 'Dec. 15, 2020',
      notes: 'This was a good batch.',
      rating: '5 stars'
    });
    return request(app)
      .get(`/api/v1/logs/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual(log);
      });
  });

  it('updates a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    await Log.insert({
      recipeId: 1,
      dateOfEvent: 'Dec. 15, 2020',
      notes: 'This was a good batch.',
      rating: '5 stars'
    });
    return request(app)
      .put(`/api/v1/logs/${recipe.id}`)
      .send({
        recipeId: 1,
        dateOfEvent: 'Dec. 15, 2020',
        notes: 'This was no good.',
        rating: '1 star'
      })
      .then(res => {
        expect(res.body).toEqual({
          recipeId: '1',
          dateOfEvent: 'Dec. 15, 2020',
          notes: 'This was no good.',
          rating: '1 star'
        });
      });
  });

  it('deletes a log by recipeId', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    await Log.insert({
      recipeId: '1',
      dateOfEvent: 'Dec. 15, 2020',
      notes: 'This was a good batch.',
      rating: '5 stars'
    });
    return request(app)
      .delete(`/api/v1/logs/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          recipeId: '1',
          dateOfEvent: 'Dec. 15, 2020',
          notes: 'This was a good batch.',
          rating: '5 stars'
        });
      });
  });

});
