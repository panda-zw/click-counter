"use client";

import { useState, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Particles, { initParticlesEngine } from "@tsparticles/react";

export default function GameComponent() {
  const [gameState, setGameState] = useState("idle"); // 'idle', 'playing', 'finished'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [leaderboard, setLeaderboard] = useState([
    { name: "Alice", score: 42 },
    { name: "Bob", score: 39 },
    { name: "Charlie", score: 35 },
    { name: "David", score: 31 },
    { name: "Eve", score: 28 },
  ]);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userCountry, setUserCountry] = useState("");

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(60);
  };

  const handleClick = () => {
    if (gameState === "playing") {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const endGame = useCallback(() => {
    setGameState("finished");
    setIsScoreDialogOpen(true);
  }, [score]);

  useEffect(() => {
    let timer: any;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, endGame]);

  return (
    <div className="w-screen flex flex-col items-center justify-center relative">
      {/* <Particles className="absolute inset-0 z-0" params={{
        particles: {
          number: { value: 100 },
          size: { value: 3 },
          move: { speed: 2 },
        },
      }} /> */}
      <div className="z-10 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Clicking Game</h1>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}>
            <div className="bg-secondary p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
              <ScrollArea className="h-[300px]">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span>{entry.name}</span>
                    <span>{entry.score}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle/>
          <ResizablePanel>
            <div className="p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                <Progress
                  value={(timeLeft / 60) * 100}
                  className="w-48 h-48 rounded-full"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
                  {timeLeft}
                </div>
              </div>
              {gameState === "idle" && (
                <Button onClick={startGame} className="mb-4">
                  Start Game
                </Button>
              )}
              {gameState === "playing" && (
                <motion.div
                  className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClick}
                >
                  Click!
                </motion.div>
              )}
              {gameState !== "idle" && (
                <p className="mt-4 text-xl font-semibold">Score: {score}</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Score Dialog */}
      <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over!</DialogTitle>
            <p>Your score: {score}</p>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsScoreDialogOpen(false);
                setIsUserDetailsDialogOpen(true);
              }}
            >
              Save Score
            </Button>
            <Button onClick={() => setIsScoreDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsDialogOpen} onOpenChange={setIsUserDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Your Email"
              />
            </div>
            <div>
              <Label>Country</Label>
              <Select onValueChange={(value) => setUserCountry(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setLeaderboard((prevLeaderboard) => {
                const newLeaderboard = [
                  ...prevLeaderboard,
                  { name: userName, score },
                ];
                return newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 5);
              });
              setIsUserDetailsDialogOpen(false);
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
