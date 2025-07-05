import { OtherProfile } from '@/components/profile';
import { Address } from 'viem';

interface Props {
  params: Promise<{
    id: Address;
  }>;
}

export default async function Page({ params }: Props) {
  return (
    <>
      <OtherProfile address={(await params).id} />
    </>
  );
}
