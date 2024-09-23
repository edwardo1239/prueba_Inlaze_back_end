import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get() // GET /user
    async findAll() {
        return await this.userService.findAllUsers();
    }

    @Get(':id') // GET /users/:id
    findOne(@Param('id') id: string) {
        return this.userService.findUser(id);
    }

    @Post() // POST /user
    async create(@Body() user: {
        username: string;
        password: string;
        email: string;
    }) {

        return await this.userService.createUser(user); // Llama al método createUser en UsersService
    }

    @Post('login')
    async login(
        @Body() userData: { username: string; password: string }, 
        @Res() res: Response // Recibe el objeto Response
    ) {
        return this.userService.login(userData, res); // Pasa el objeto Response al servicio
    }

    @Patch(':id') // PATCH /users/:id
    async update(@Param('id') id: string, @Body() userUpdate: {
        email?: string;
    }) {
        return await this.userService.updateUser(id, userUpdate)
    }

    @Delete(':id') // Delete /user
    async delete(@Param('id') id: string) {
        return await this.userService.softDelete(id)
    }

}
