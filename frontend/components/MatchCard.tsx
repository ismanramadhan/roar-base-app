"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ROAR_CONTRACT_ADDRESS, MOCK_IDRX_ADDRESS, ROAR_ABI, ERC20_ABI } from "@/constants";
import { formatEther, parseEther } from "viem";
import { useState } from "react";

interface MatchCardProps {
  matchId: bigint;
}

export function MatchCard({ matchId }: MatchCardProps) {
  const [amount, setAmount] = useState("");
  const [showBackModal, setShowBackModal] = useState<{ side: 1 | 2 } | null>(null);

  // Read match data
  const { data: matchData } = useReadContract({
    address: ROAR_CONTRACT_ADDRESS,
    abi: ROAR_ABI,
    functionName: "getMatch",
    args: [matchId],
    query: {
      enabled: !!ROAR_CONTRACT_ADDRESS && ROAR_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Read backing amounts
  const { data: backingA } = useReadContract({
    address: ROAR_CONTRACT_ADDRESS,
    abi: ROAR_ABI,
    functionName: "getBackingAmount",
    args: [matchId, 1],
  });

  const { data: backingB } = useReadContract({
    address: ROAR_CONTRACT_ADDRESS,
    abi: ROAR_ABI,
    functionName: "getBackingAmount",
    args: [matchId, 2],
  });

  // Write contract hooks
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeBackAthlete, data: backHash } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isBacking } = useWaitForTransactionReceipt({
    hash: backHash,
    onSuccess: () => {
      setShowBackModal(null);
      setAmount("");
    },
  });

  const handleBack = async (side: 1 | 2) => {
    if (!amount || parseFloat(amount) <= 0) return;

    const amountWei = parseEther(amount);

    // First approve, then back
    writeApprove({
      address: MOCK_IDRX_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ROAR_CONTRACT_ADDRESS, amountWei],
    });

    // After approval, back the athlete
    setTimeout(() => {
      writeBackAthlete({
        address: ROAR_CONTRACT_ADDRESS,
        abi: ROAR_ABI,
        functionName: "backAthlete",
        args: [matchId, side, amountWei],
      });
    }, 1000);
  };

  if (!matchData) return null;

  const [athleteA, athleteB, , , totalPool, status] = matchData;
  const isOpen = status === 0; // MatchStatus.Open = 0

  return (
    <>
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-electric-blue transition-all">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Match #{matchId.toString()}</span>
            <span className={`text-xs px-2 py-1 rounded ${isOpen ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{athleteA}</div>
          <div className="text-center text-gray-400 my-2">VS</div>
          <div className="text-2xl font-bold text-white mb-4">{athleteB}</div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total Pool</span>
            <span className="text-lg font-bold text-electric-blue">
              {totalPool ? formatEther(totalPool as bigint) : "0"} IDRX
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{athleteA} Backing</span>
            <span className="text-sm text-white">
              {backingA ? formatEther(backingA as bigint) : "0"} IDRX
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{athleteB} Backing</span>
            <span className="text-sm text-white">
              {backingB ? formatEther(backingB as bigint) : "0"} IDRX
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowBackModal({ side: 1 })}
              className="flex-1 bg-gradient-to-r from-electric-blue to-electric-blue-dark hover:from-electric-blue-dark hover:to-electric-blue text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Back {athleteA}
            </button>
            <button
              onClick={() => setShowBackModal({ side: 2 })}
              className="flex-1 bg-gradient-to-r from-neon-orange to-neon-orange-dark hover:from-neon-orange-dark hover:to-neon-orange text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Back {athleteB}
            </button>
          </div>
        )}
      </div>

      {/* Back Modal */}
      {showBackModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-white">
              Back {showBackModal.side === 1 ? matchData[0] : matchData[1]}
            </h3>
            <input
              type="number"
              placeholder="Amount in IDRX"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 mb-4 text-white focus:outline-none focus:border-electric-blue"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowBackModal(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBack(showBackModal.side)}
                disabled={isApproving || isBacking || !amount}
                className="flex-1 bg-gradient-to-r from-electric-blue to-neon-orange hover:from-electric-blue-dark hover:to-neon-orange-dark text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                {isApproving || isBacking ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}