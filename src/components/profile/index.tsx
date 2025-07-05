'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { NFT_ABI } from '@/app/abis/nft';
import { useAppKitAccount, UseAppKitAccountReturn } from '@reown/appkit/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Address } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';
import z from 'zod';

import { editProfileFormSchema } from './edit-form';
import Profile from './profile-card';

export const OtherProfile = ({ address }: { address: Address }) => {
  const { data: profile, refetch: refetchProfile } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getUserProfile',
    args: [address],
    account: address,
  });

  const { data: userStatisticsData, refetch: userStatisticsRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
      abi: MARKETPLACE_NFT,
      functionName: 'getUserStatistics',
      args: [address],
      account: address,
    });

  const { data: tokensOwnedByMeData, refetch: tokensOwnedByMeRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getTokensOwnedByMe',
      account: address,
    });
  const { data: tokensCreatedByMeData, refetch: tokensCreatedByMeRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getTokensCreatedByMe',
      account: address,
    });
  const { data: favoritesData, refetch: favoritesRefetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getFavorites',
    account: address,
  });

  const { data: fetchItemsBySellerData, refetch: fetchItemsBySellerRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
      abi: MARKETPLACE_NFT,
      functionName: 'fetchItemsBySeller',
      args: [address],
      account: address,
    });

  const refetchAllData = async () => {
    await Promise.all([
      userStatisticsRefetch(),
      tokensOwnedByMeRefetch(),
      tokensCreatedByMeRefetch(),
      favoritesRefetch(),
      refetchProfile(),
      fetchItemsBySellerRefetch(),
    ]);
  };

  refetchAllData().catch((error) => {
    console.error('Error refetching data:', error);
    toast.error('Failed to refetch data');
  });

  return (
    <Profile
      address={address}
      profile={profile}
      fetchItemsBySellerData={fetchItemsBySellerData}
      userStatisticsData={userStatisticsData}
      tokensOwnedByMeData={tokensOwnedByMeData}
      tokensCreatedByMeData={tokensCreatedByMeData}
      favoritesData={favoritesData}
    />
  );
};

export const MyProfile = () => {
  const { address } = useAppKitAccount() as {
    address: Address;
  } & UseAppKitAccountReturn;
  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const { data: profile, refetch: refetchProfile } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getUserProfile',
    args: [address],
    account: address,
  });

  const { data: userStatisticsData, refetch: userStatisticsRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
      abi: MARKETPLACE_NFT,
      functionName: 'getUserStatistics',
      args: [address],
      account: address,
    });

  const { data: tokensOwnedByMeData, refetch: tokensOwnedByMeRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getTokensOwnedByMe',
      account: address,
    });
  const { data: tokensCreatedByMeData, refetch: tokensCreatedByMeRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getTokensCreatedByMe',
      account: address,
    });
  const { data: favoritesData, refetch: favoritesRefetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getFavorites',
    account: address,
  });

  const { data: fetchItemsBySellerData, refetch: fetchItemsBySellerRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
      abi: MARKETPLACE_NFT,
      functionName: 'fetchItemsBySeller',
      args: [address],
      account: address,
    });

  const refetchAllData = async () => {
    await Promise.all([
      userStatisticsRefetch(),
      tokensOwnedByMeRefetch(),
      tokensCreatedByMeRefetch(),
      favoritesRefetch(),
      refetchProfile(),
      fetchItemsBySellerRefetch(),
    ]);
  };

  refetchAllData().catch((error) => {
    console.error('Error refetching data:', error);
    toast.error('Failed to refetch data');
  });

  const handleEditProfile = async (
    values: z.infer<typeof editProfileFormSchema>,
  ) => {
    setIsUpdateProfileLoading(true);
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
        abi: NFT_ABI,
        functionName: 'setUserProfile',
        args: [
          values.username,
          values.fullName,
          values.bio,
          values.x,
          values.instagram,
          values.avatarURL,
        ],
        account: address as Address,
      });
      toast.success('Profile updated successfully');
      await refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdateProfileLoading(false);
    }
  };

  return (
    <Profile
      address={address}
      profile={profile}
      userStatisticsData={userStatisticsData}
      tokensOwnedByMeData={tokensOwnedByMeData}
      tokensCreatedByMeData={tokensCreatedByMeData}
      favoritesData={favoritesData}
      fetchItemsBySellerData={fetchItemsBySellerData}
      isEditable
      isUpdateProfileLoading={isUpdateProfileLoading}
      onEditProfile={handleEditProfile}
    />
  );
};
