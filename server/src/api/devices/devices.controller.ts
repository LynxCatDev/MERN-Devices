import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { DeviceDetailsResponse, DevicesService } from './devices.service';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getDeviceInfoResponse, getDevicesResponse } from './api-response';

@ApiTags('Devices')
@Controller('/devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @HttpCode(200)
  @ApiResponse(getDevicesResponse)
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    example: 'watch'
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    example: 'smartphones'
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: 'popularity'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: '8'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: '1'
  })
  @Get()
  getAllDevices(
    @Query('q') q: string,
    @Query('category') category: string,
    @Query('sort') sort: string,
    @Query('limit') limit: number,
    @Query('page') page: number
  ) {
    return this.devicesService.getAllDevices(q, category, sort, limit, page);
  }

  @HttpCode(200)
  @ApiResponse(getDeviceInfoResponse)
  @ApiParam({
    name: 'name',
    required: false,
    type: String,
    example: 'iphone'
  })
  @Get('search/:name')
  search(@Param('name') name: string) {
    return this.devicesService.search(name);
  }

  @HttpCode(200)
  @ApiResponse(getDeviceInfoResponse)
  @ApiParam({ name: 'link', example: 'xiaomi-oclean-f1-light-blue' })
  @Get(':link')
  getDevice(@Param('link') link: string): Promise<DeviceDetailsResponse> {
    return this.devicesService.getDevice(link);
  }
}
