import { ApiResponseOptions } from '@nestjs/swagger';

export const getDeviceInfoResponse: ApiResponseOptions = {
  schema: {
    example: {
      id: 1,
      name: 'Xiaomi Redmi Note 9 Pro 6GB 64GB, Gray',
      price: 4399,
      credit: 287,
      cashback: 300,
      model: 'Redmi Note 9 Pro',
      color: 'Gray',
      weight: 209,
      popularity: 90,
      manufacturer: 'Xiaomi',
      imageUrl:
        'https://darwin.md/images/product/2020/06/redmi_note_9_pro_gray_5-200605035405-darwin.webp',
      imageUrls: [
        'https://darwin.md/images/product/2020/06/redmi_note_9_pro_gray_5-200605035405-darwin.webp',
        'https://darwin.md/images/product/2020/06/redmi_note_9_pro_green.webp',
      ],
      type: 'smartphones',
      link: 'redmi-note-9-pro-64-gb-gray',
      colors: ['gray', 'green', 'white'],
      memoryOptions: [64, 128],
      camera: 64,
      frontCamera: 16,
      chipset: 'Qualcomm SM7125 Snapdragon 720G',
      processor: 'Octa Core',
      resolution: '1080 x 2400',
      hardDrive: 64,
      memory: 6
    }
  }
};
