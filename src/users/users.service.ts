import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Response } from 'express';

@Injectable()
export class UsersService {
    constructor(private readonly dbService: DbService) { }

    async createUser(userData: {
        username: string;
        password: string;
        email: string;
        favoritos?: string[]
    }) {
        return await this.dbService.createUser(userData);
    }
    async findUser(id: string) {
        return await this.dbService.findUser(id);
    }
    async findAllUsers() {
        return await this.dbService.findAllUsers();
    }
    async updateUser(id: string, userUpdate: {
        email?: string;
    }) {
        return await this.dbService.updateUser(id, userUpdate)
    }
    async softDelete(id: string) {
        return await this.dbService.softDelete(id)
    }

    async login(userData: {
        username: string;
        password: string
    }, res: Response) {
        const { username, password } = userData;
        try {

            const user = await this.dbService.findUserByUsername(username)
            const isValid = compareSync(password, user.password);
            if (!isValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const token = sign({
                _id: user._id,
                username: user.username,
                password: user.password
            }, process.env.JWT_SECRET, { expiresIn: '8h' });

            // Guardar el token en las cookies (opcionalmente puedes configurar atributos de seguridad)
            res.cookie('jwt', token, {
                httpOnly: true, // Solo accesible desde HTTP (no JavaScript)
                secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si está en producción
                sameSite: 'strict', // Protege contra CSRF
                maxAge: 8 * 60 * 60 * 1000, // 8 horas de expiración
            });

            // Devolver una respuesta de éxito
            return res.status(200).json({ message: 'Login successful' });
        } catch (err) {
            // Manejo de errores inesperados
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
