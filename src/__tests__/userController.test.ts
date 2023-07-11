import request from 'supertest';
import app from '../app'; 
import express from 'express'
import { readData, saveData } from '../utilities/helpers';

let token = "";

const userLoginDetails = {
  email: "jayjay@mail.com",
  password: "123456"
}




describe('Test user API endpoints', ()=>{

    it('POST create user - FAIL - should fail for invalid or incomplete fields', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signup').send({
        username:"goku",
        email:"sungoku",
        password:"123456"
      })
      expect(body.ERROR.length).toBeGreaterThan(0)
      expect(statusCode).toBe(400)
    })
  
    it('POST create user - FAIL - should fail if email already exist', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signup').send({
        name:"jamialla",
        username:"Jamal",
        email:"jayjay@mail.com",
        password:"123456"
      })
      expect(body).toEqual({
        status: "error",
        method: "POST",
        message: "user already exist"
      })
      expect(statusCode).toBe(400)
    })
  
    it('POST create user - FAIL - should fail if username already exist', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signup').send({
        name:"jamialla",
        username:"Jamal",
        email:"jamal223@mail.com",
        password:"123456"
      })
      expect(body).toEqual({
        status: "error",
        method: "POST",
        message: "username already exist"
      })
      expect(statusCode).toBe(400)
    })
  
    it('POST create user - SUCCESS - should succeed if all info supplied correctly', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signup').send({
        name:"goku jinchuriki",
        username:"hachibi",
        email:"songoku@mail.com",
        password:"123456"
      })
      expect(body).toEqual({
        status: "success",
        method: "POST",
        message: "user created successfuly",
        newUser: expect.objectContaining({
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          id: expect.any(String),
          createdAt: expect.any(String)
        })
      })
      expect(statusCode).toBe(200)
  
      const allUsers = readData('./src/userDatabase/userDatabase.json')
      allUsers.pop()
      saveData('./src/userDatabase/userDatabase.json',allUsers)
    })
  
  
    it('POST login user - FAIL - should fail if user does not exist ', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signin').send({
        email:"huyga@mail.com",
        password:"123456"
      })
      expect(body).toEqual({
        status: "error",
        method: "POST",
        message: "user not found"
      })
      expect(statusCode).toBe(404)
    })
  
    it('POST login user - FAIL - should fail if email or password is incorrect', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signin').send({
        email:"jayjay@mail.com",
        password:"675534"
      })
      expect(body).toEqual({
        status: "error",
        method: "POST",
        message: "email or password is incorrect"
      })
      expect(statusCode).toBe(401)
    })
  
  
    it('POST login user - SUCCESS - should pass if email & password is correct', async ()=>{
      const {body, statusCode} = await request(app).post('/users/signin').send(userLoginDetails)
      token = body.token
  
      expect(body).toMatchObject({
        status: "success",
        method: "POST",
        message: "Login Successful",
        email: userLoginDetails.email,
      })
      expect(token.length).toBeGreaterThan(0)
      expect(statusCode).toBe(200)
    })
  
  })