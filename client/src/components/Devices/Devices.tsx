'use client';

import { useMemo } from 'react';
import { DevicesItem } from './DevicesItem';
import { NoData } from '../NoData/NoData';
import { Pagination } from '../Pagination/Pagination';
import { DevicesDataProps } from '@/store/store.interface';

import './Devices.scss';
import { Loading } from '../Loading/Loading';

interface ComponentDevicesDataProps {
  devices: DevicesDataProps;
  loading?: boolean;
}

export const Devices = ({ devices, loading }: ComponentDevicesDataProps) => {
  const devicesData = useMemo(() => devices?.data, [devices?.data]);

  return (
    <div className="devices">
      {devicesData?.length > 0 && (
        <div className="devices--items">
          {devicesData.map((device) => (
            <DevicesItem key={device.id} device={device} />
          ))}
          <div className="devices--pagination">
            <Pagination
              currentPage={devices.page}
              totalPages={devices.totalPages}
            />
          </div>
        </div>
      )}

      {!devicesData?.length && !loading && <NoData />}

      {loading && <Loading />}
    </div>
  );
};
