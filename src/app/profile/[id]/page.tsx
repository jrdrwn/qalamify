import { OtherProfile } from '@/components/profile';

interface Props {
  params: Promise<{
    id: `0x${string}`;
  }>;
}

export default async function Page({ params }: Props) {
  return (
    <>
      <OtherProfile address={(await params).id} />
    </>
  );
}
