import z from 'zod';

export const userSchema = z.object({
    name: z.string({required_error: "name is required"}),
    username:z.string({required_error: "username is required"}),
    email:z.string({required_error: "email is required"}).email({message:'mail is invalid'}),
    password:z.string({required_error: "password is required"})
})

export const bookSchema = z.object({
    title: z.string({required_error: "title is required"}),
    author: z.string({required_error: "author is required"}),
    datePublished: z.string({required_error: "date Published is required"}),
    description: z.string({required_error: "description is required"}),
    pageCount: z.number({required_error: "page count is required"}),
    genre: z.string({required_error: "genre is required"}),
    Publisher: z.string({required_error: "publisher is required"})
})

export const bookUpdateSchema = z.object({
    title: z.string({required_error: "title is required"}),
    author: z.string({required_error: "author is required"}),
    datePublished: z.string({required_error: "date Published is required"}),
    description: z.string({required_error: "description is required"}),
    pageCount: z.number({required_error: "page count is required"}),
    genre: z.string({required_error: "genre is required"}),
    Publisher: z.string({required_error: "publisher is required"}),
    bookId: z.string({required_error: "bookId is required"}),
    createdAt:z.string({required_error: "createdAt is required"}),
    updatedAt:z.string({required_error: "updatedAt is required"})
})

