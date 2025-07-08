'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { NFT_ABI } from '@/app/abis/nft';
import { useAppKitAccount, UseAppKitAccountReturn } from '@reown/appkit/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Address } from 'viem';
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import z from 'zod';

import { editProfileFormSchema } from './edit-form';
import Profile from './profile-card';

export const OtherProfile = ({ address }: { address: Address }) => {
  const { address: currentAddress } = useAppKitAccount() as {
    address: Address;
  } & UseAppKitAccountReturn;
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

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    eventName: 'UserProfileUpdated',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.user === currentAddress) {
        toast.success('Profile updated successfully!');
        await refetchProfile();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESSS as Address,
    abi: NFT_ABI,
    eventName: 'TokenFavorited',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.user === currentAddress) {
        toast.success('Token favorited successfully!');
        await favoritesRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESSS as Address,
    abi: NFT_ABI,
    eventName: 'TokenUnfavorited',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.user === currentAddress) {
        toast.success('Token unfavorited successfully!');
        await favoritesRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCreated',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAddress) {
        toast.success('Market item created successfully!');
        await fetchItemsBySellerRefetch();
        await tokensOwnedByMeRefetch();
        await tokensCreatedByMeRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    eventName: 'TokenMinted',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.creator === currentAddress) {
        toast.success('Token minted successfully!');
        await tokensCreatedByMeRefetch();
        await tokensOwnedByMeRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCanceled',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAddress) {
        await userStatisticsRefetch();
        await tokensCreatedByMeRefetch();
        await tokensOwnedByMeRefetch();
        await fetchItemsBySellerRefetch();
        toast.success('Market item canceled successfully!');
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemSold',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.buyer === currentAddress) {
        toast.success('Market item purchased successfully!');
        await fetchItemsBySellerRefetch();
        await tokensOwnedByMeRefetch();
        await tokensCreatedByMeRefetch();
        await userStatisticsRefetch();
      }
    },
  });
  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemRelisted',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAddress) {
        await userStatisticsRefetch();
        await tokensCreatedByMeRefetch();
        await tokensOwnedByMeRefetch();
        await fetchItemsBySellerRefetch();
        toast.success('Market item relisted successfully!');
      }
    },
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

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    eventName: 'UserProfileUpdated',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.user === address) {
        toast.success('Profile updated successfully!');
        await refetchProfile();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESSS as Address,
    abi: NFT_ABI,
    eventName: 'TokenFavorited',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.user === address) {
        toast.success('Token favorited successfully!');
        await favoritesRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESSS as Address,
    abi: NFT_ABI,
    eventName: 'TokenUnfavorited',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.user === address) {
        toast.success('Token unfavorited successfully!');
        await favoritesRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCreated',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === address) {
        toast.success('Market item created successfully!');
        await fetchItemsBySellerRefetch();
        await tokensOwnedByMeRefetch();
        await tokensCreatedByMeRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    eventName: 'TokenMinted',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.creator === address) {
        toast.success('Token minted successfully!');
        await tokensCreatedByMeRefetch();
        await tokensOwnedByMeRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCanceled',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === address) {
        toast.success('Market item canceled successfully!');
        await fetchItemsBySellerRefetch();
        await tokensOwnedByMeRefetch();
        await tokensCreatedByMeRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemSold',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.buyer === address) {
        toast.success('Market item purchased successfully!');
        await fetchItemsBySellerRefetch();
        await tokensOwnedByMeRefetch();
        await tokensCreatedByMeRefetch();
        await userStatisticsRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemRelisted',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === address) {
        toast.success('Market item relisted successfully!');
        await fetchItemsBySellerRefetch();
        await tokensOwnedByMeRefetch();
        await tokensCreatedByMeRefetch();
      }
    },
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
      toast.info('Updating profile... Please wait a moment.');
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
