'use client'

import { useState, useEffect, useCallback } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

export default function Component() {
  const [gameState, setGameState] = useState('idle') // 'idle', 'playing', 'finished'
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Alice', score: 42 },
    { name: 'Bob', score: 39 },
    { name: 'Charlie', score: 35 },
    { name: 'David', score: 31 },
    { name: 'Eve', score: 28 },
  ])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(10)
  }

  const handleClick = () => {
    if (gameState === 'playing') {
      setScore(prevScore => prevScore + 1)
    }
  }

  const endGame = useCallback(() => {
    setGameState('finished')
    setLeaderboard(prevLeaderboard => {
      const newLeaderboard = [...prevLeaderboard, { name: 'You', score }]
      return newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 5)
    })
  }, [score])

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer)
            endGame()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState, endGame])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clicking Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
          <ScrollArea className="h-[300px]">
            {leaderboard.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <span>{entry.name}</span>
                <span>{entry.score}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="bg-secondary p-4 rounded-lg flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 mb-4">
            <Progress
              value={timeLeft * 10}
              className="w-48 h-48 rounded-full"
            //   indicatorClassName="rounded-full"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
              {timeLeft}
            </div>
          </div>
          {gameState === 'idle' && (
            <Button onClick={startGame} className="mb-4">Start Game</Button>
          )}
          {gameState === 'playing' && (
            <motion.div
              className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
            >
              Click!
            </motion.div>
          )}
          {gameState === 'finished' && (
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">Game Over!</p>
              <p className="text-xl mb-4">Your score: {score}</p>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
          {gameState !== 'idle' && (
            <p className="mt-4 text-xl font-semibold">Score: {score}</p>
          )}
        </div>
      </div>
    </div>
  )
}