import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { AuthUserDto } from './dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Devices, DevicesDocument } from '../devices/schemas/devices.schema';
import { getPageNumber, getTotalPages, paginate } from '../../utils/utils';
import { getCookieConfig } from '../../config/cookie.config';

const errorMessage = {
  userExists: 'user already exist, please login',
  minimumLength: 'minimum length is 6 characters',
  missingPassword: 'password can not be null',
  emailUnique: 'email must be unique for user',
  invalidCredentials: 'Invalid username or password',
  forbidden: 'forbidden',
  invalidEmail: 'User with this email not found',
  invalidPassword: 'Password does not match',
  invalidToken: 'Invalid token',
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private users: Model<UsersDocument>,
    private jwtService: JwtService,
    @InjectModel(Devices.name)
    private devicesModel: Model<DevicesDocument>,
  ) {}

  getAllUsers = async () => {
    const users = await this.users.find();
    return users;
  };

  getById = async (id: string) => {
    const user = await this.users.findOne({ _id: id });
    return user;
  };

  getUserByEmail = async (email: string) => {
    const user = await this.users.findOne({ email });
    return user;
  };

  //Register User
  createUser = async (userDto: AuthUserDto, res: Response) => {
    const { email, password } = userDto;

    // Sanitize email input
    const sanitizedEmail = email?.trim().toLowerCase();

    if (sanitizedEmail) {
      const emailUser = await this.users.findOne({ email: sanitizedEmail });

      if (emailUser) {
        throw new UnprocessableEntityException({
          error: errorMessage.emailUnique,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.users.create({
      ...userDto,
      email: sanitizedEmail,
      created_at: new Date(),
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = this.issueTokens(user._id);

    // Set refresh token as httpOnly cookie - Alternative method
    res.cookie('refreshToken', refreshToken, getCookieConfig());

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      accessToken, // Return access token in response body
      refreshToken, // Return refresh token in response body for client storage
    };
  };

  //Login User
  login = async (authUserDto: AuthUserDto, res: Response) => {
    const { email, password } = authUserDto;

    // Sanitize email input
    const sanitizedEmail = email?.trim().toLowerCase();
    const user = await this.users.findOne({ email: sanitizedEmail });

    if (!user) {
      throw new BadRequestException(errorMessage.invalidEmail);
    }

    const checkPassMatch = await bcrypt.compare(password, user.password);
    if (!checkPassMatch) {
      throw new UnauthorizedException(errorMessage.invalidPassword);
    }

    const { accessToken, refreshToken } = this.issueTokens(user._id);

    // Set refresh token as httpOnly cookie - Alternative method
    res.cookie('refreshToken', refreshToken, getCookieConfig());

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      accessToken, // Return access token in response body
      refreshToken, // Return refresh token in response body for client storage
    };
  };

  //Validate user
  async validateSession(req: any, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const token = await this.jwtService.verify(refreshToken);
      const user = await this.users.findOne({ _id: token.id });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const { accessToken } = this.issueTokens(user._id);

      const profileUser = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user._id,
        role: user.role,
        isLoggedIn: true,
        activeFavoritesIds:
          user?.favorites?.data.map((favorite) => favorite.id) || [],
      };

      return {
        user: profileUser,
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('User is not logged in');
    }
    res.clearCookie('refreshToken', getCookieConfig());
    return { message: 'Successfully logged out' };
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // Verify refresh token and get user data
      const refreshTokenData = await this.jwtService.verifyAsync(refreshToken);
      const userId = refreshTokenData.id;

      // Find user in database
      const user = await this.users.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate NEW access token (30 seconds) and NEW refresh token (7 days)
      const { accessToken, refreshToken: newRefreshToken } =
        this.issueTokens(userId);

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', newRefreshToken, getCookieConfig());

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      return {
        user: {
          ...userWithoutPassword,
          activeFavoritesIds:
            user?.favorites?.data.map((favorite) => favorite.id) || [],
        },
        accessToken, // Return new access token
        // Note: refresh token is set as httpOnly cookie, not returned in body
        message: 'Tokens refreshed successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  //Delete User
  deleteUser = async (id: string) => {
    const user = await this.users.findByIdAndDelete(id);
    return user;
  };

  //Add to favorites
  addToFavorites = async (deviceId: string, userId: string, page) => {
    if (!userId) {
      throw new ForbiddenException(errorMessage.invalidToken);
    }

    const user = await this.users.findOne({ _id: userId });
    const device = await this.devicesModel.findOne({ id: deviceId });
    const userFavorites = user?.favorites?.data || [];

    const checkAddToFavorites = () => {
      if (userFavorites?.find((favorite) => favorite.id === device?.id)) {
        const filteredFavorites = userFavorites.filter(
          (favorite) => favorite.id !== device.id,
        );
        return filteredFavorites;
      } else {
        return [...userFavorites, device];
      }
    };

    await this.users.updateOne(
      { _id: userId },
      {
        favorites: {
          limit: 8,
          page: getPageNumber(1),
          totalCount: checkAddToFavorites()?.length,
          totalPages: getTotalPages(checkAddToFavorites()?.length, 8),
          data: checkAddToFavorites(),
        },
      },
    );

    return device;
  };

  //Get User Favorites
  getUserFavorites = async (
    page: number,
    limit: number = 8,
    userId: string,
  ) => {
    const user = await this.users.findOne({ _id: userId });
    const userFavorites = user?.favorites?.data || [];

    if (!userId) {
      throw new ForbiddenException(errorMessage.invalidToken);
    }

    return {
      favorites: {
        limit: Number(limit),
        page: getPageNumber(page),
        totalCount: userFavorites?.length,
        totalPages: getTotalPages(userFavorites?.length, 8),
        data: paginate(userFavorites, 8, page),
      },
    };
  };

  private issueTokens(userId: Types.ObjectId) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
