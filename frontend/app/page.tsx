"use client";

import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useReadContract } from "wagmi";
import { ROAR_CONTRACT_ADDRESS, ROAR_ABI } from "@/constants";
import { MatchCard } from "@/components/MatchCard";
import { useState, useEffect } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [matchIds, setMatchIds] = useState<bigint[]>([]);

  // Get match counter
  const { data: matchCounter } = useReadContract({
    address: ROAR_CONTRACT_ADDRESS,
    abi: ROAR_ABI,
    functionName: "matchCounter",
    query: {
      enabled: !!ROAR_CONTRACT_ADDRESS && ROAR_CONTRACT_ADDRESS !== "0x2Fee99435D3eD3A1a17340CD1f1b74E779518328",
    },
  });

  // Fetch all match IDs
  useEffect(() => {
    if (matchCounter !== undefined) {
      const ids: bigint[] = [];
      for (let i = 0; i < Number(matchCounter); i++) {
        ids.push(BigInt(i));
      }
      setMatchIds(ids);
    }
  }, [matchCounter]);

  return (
    <main className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-neon-orange bg-clip-text text-transparent">
              ROAR
            </h1>
            <span className="text-sm text-gray-400">Republik Olahraga</span>
          </div>
          <ConnectWallet />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-white">Active Matches</h2>
          <p className="text-gray-400">Back your favorite athletes and win rewards</p>
        </div>

        {!isConnected && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to view and participate in matches</p>
            <ConnectWallet />
          </div>
        )}

        {isConnected && matchIds.length === 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
            <p className="text-gray-400">No active matches yet. Check back soon!</p>
          </div>
        )}

        {isConnected && matchIds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchIds.map((matchId) => (
              <MatchCard key={matchId.toString()} matchId={matchId} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}