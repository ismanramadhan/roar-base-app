"use client";

import { useParams } from "next/navigation";
// Change this line:
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useReadContract } from "wagmi";
import { ROAR_CONTRACT_ADDRESS, ROAR_ABI } from "@/constants";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AthleteProfile() {
  const params = useParams();
  const athleteName = decodeURIComponent(params.name as string);
  const [totalFunding, setTotalFunding] = useState<bigint>(0n);
  const [matchIds, setMatchIds] = useState<bigint[]>([]);

  // Get match counter
  const { data: matchCounter } = useReadContract({
    address: ROAR_CONTRACT_ADDRESS,
    abi: ROAR_ABI,
    functionName: "matchCounter",
  });

  // Fetch all matches and calculate funding
  useEffect(() => {
    if (matchCounter !== undefined) {
      const ids: bigint[] = [];
      for (let i = 0; i < Number(matchCounter); i++) {
        ids.push(BigInt(i));
      }
      setMatchIds(ids);
    }
  }, [matchCounter]);

  // Calculate total funding for this athlete
  useEffect(() => {
    const calculateFunding = async () => {
      let total = 0n;
      // This would require multiple contract calls - simplified for now
      // In production, you'd want to index events or use a subgraph
      setTotalFunding(total);
    };
    if (matchIds.length > 0) {
      calculateFunding();
    }
  }, [matchIds, athleteName]);

  return (
    <main className="min-h-screen bg-dark-bg">
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-neon-orange bg-clip-text text-transparent">
              ROAR
            </h1>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-2 text-white">{athleteName}</h1>
            <p className="text-gray-400 mb-8">Athlete Profile</p>

            <div className="space-y-6">
              <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Community Funding</h2>
                <div className="text-3xl font-bold text-electric-blue">
                  {totalFunding ? formatEther(totalFunding) : "0"} IDRX
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Total amount backed by the community across all matches
                </p>
              </div>

              <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Match History</h2>
                <p className="text-gray-400">
                  {matchIds.length === 0
                    ? "No matches found"
                    : `Participated in ${matchIds.length} match(es)`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}