import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Devices,
  DevicesDocument,
  DevicesPagination,
} from './schemas/devices.schema';
import { getPageNumber, getTotalPages } from '../../utils/utils';

export type DeviceDetailsResponse = (Devices & { imageUrls: string[] }) | null;

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Devices.name)
    private devicesModel: Model<DevicesDocument>,
  ) {}
  getAllDevices = async (
    q: string,
    category: string,
    sort: string,
    limit: number = 8,
    page: number,
  ): Promise<DevicesPagination> => {
    const manufacturer = 'Apple';
    const normalizedLimit = Math.max(1, Number(limit) || 8);
    const normalizedPage = getPageNumber(page);

    const checkDeviceType = () => {
      if (q) {
        return { name: new RegExp(q, 'i') };
      } else if (category === 'apple') {
        return { manufacturer };
      } else if (category) {
        return { category };
      } else {
        return {};
      }
    };
    const filter = checkDeviceType();

    const totalCount = await this.devicesModel.countDocuments(filter).exec();

    const devices = await this.devicesModel
      .find(filter, { _id: 0 })
      .sort(sort ? { [`${sort}`]: -1 } : 'id')
      .skip((normalizedPage - 1) * normalizedLimit)
      .limit(normalizedLimit)
      .lean()
      .exec();

    return {
      limit: normalizedLimit,
      page: normalizedPage,
      totalCount,
      totalPages: getTotalPages(totalCount, normalizedLimit),
      data: devices,
    };
  };

  getDevice = async (link: string): Promise<DeviceDetailsResponse> => {
    const device = await this.devicesModel
      .findOne({ link }, { _id: 0 })
      .lean()
      .exec();

    if (!device) {
      return null;
    }

    const hasVariantData = Boolean(device.model && device.manufacturer);
    const variantImages = hasVariantData
      ? await this.devicesModel
          .find(
            { model: device.model, manufacturer: device.manufacturer },
            { _id: 0, imageUrl: 1 },
          )
          .lean()
          .exec()
      : [];

    const imageUrls = Array.from(
      new Set(
        [device.imageUrl, ...variantImages.map((variant) => variant?.imageUrl)]
          .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
          .map((imageUrl) => imageUrl.trim()),
      ),
    );

    return {
      ...device,
      imageUrls,
    };
  };

  search = async (name: string) => {
    const searchDevices = await this.devicesModel.find(
      { name: new RegExp(name, 'i') },
      { _id: 0 },
    ).lean().exec();
    return searchDevices;
  };
}
