import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthUserDto, RevalidateUserDto } from './dto';
import {
  badUserResponse,
  okAuthResponse,
  okLogoutResponse,
  okUserResponse,
  okUsersResponse,
} from './api-response';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { okAddToFavoritesResponse } from './api-response/add-to-favorites-response';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @ApiOkResponse(okUserResponse)
  @ApiBadRequestResponse(badUserResponse)
  @Post('/auth/registration')
  createUser(
    @Body() userDto: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.users.createUser(userDto, res);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @ApiOkResponse(okAuthResponse)
  @ApiBadRequestResponse(badUserResponse)
  @Post('/auth/login')
  login(
    @Body() authUserDto: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.users.login(authUserDto, res);
  }

  @HttpCode(200)
  @ApiOkResponse(okAuthResponse)
  @ApiBadRequestResponse(badUserResponse)
  @Post('/auth/validate-user')
  validateSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.users.validateSession(req, res);
  }

  @Post('/auth/logout')
  @ApiOkResponse(okLogoutResponse)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.users.logout(res);
  }

  @HttpCode(200)
  @ApiOkResponse(okAuthResponse)
  @ApiBadRequestResponse(badUserResponse)
  @Post('/auth/refresh')
  refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.users.refreshToken(req, res);
  }

  @HttpCode(200)
  @ApiOkResponse(okAuthResponse)
  @ApiBadRequestResponse(badUserResponse)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.users.deleteUser(id);
  }

  @Auth()
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOkResponse(okAddToFavoritesResponse)
  // @ApiBadRequestResponse(badUserResponse)
  @Post('/favorites/:id')
  addToFavorites(
    @Param('id') deviceId: string,
    @CurrentUser('_id') userId: string,
    @Query('page') page: number,
  ) {
    return this.users.addToFavorites(deviceId, userId, page);
  }

  @Auth()
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOkResponse(okAddToFavoritesResponse)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: '8',
  })
  @Get('favorites')
  getUserFavorites(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @CurrentUser('_id') userId: string,
  ) {
    return this.users.getUserFavorites(page, limit, userId);
  }

  @HttpCode(200)
  @ApiOkResponse(okUsersResponse)
  @Get()
  getAllUsers() {
    return this.users.getAllUsers();
  }

  @HttpCode(200)
  @ApiOkResponse(okUserResponse)
  @ApiBadRequestResponse(badUserResponse)
  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.users.getUserByEmail(email);
  }
}
