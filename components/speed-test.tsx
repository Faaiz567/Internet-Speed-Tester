'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, RefreshCw, Signal } from 'lucide-react'
import { Speedometer } from './speedometer'
import { measureInternetSpeed } from '@/utils/speed-test'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SpeedTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [speedData, setSpeedData] = useState({
    ping: '0',
    download: '0',
    upload: '0'
  })
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload'>('idle')

  const resetTest = () => {
    setSpeedData({ ping: '0', download: '0', upload: '0' })
    setCurrentSpeed(0)
    setTestPhase('idle')
  }

  const runSpeedTest = async () => {
    setIsLoading(true)
    setTestPhase('ping')
    resetTest()

    try {
      const result = await measureInternetSpeed((type, progress) => {
        if (type === 'download') {
          setTestPhase('download')
          setCurrentSpeed(progress)
        } else if (type === 'upload') {
          setTestPhase('upload')
          setCurrentSpeed(progress)
        }
      })
      
      setSpeedData(result)
      setCurrentSpeed(parseFloat(result.download))
      setTestPhase('idle')
    } catch (error) {
      console.error('Speed test failed:', error)
      setTestPhase('idle')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">Internet Speed Test</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-600 hover:text-purple-400 hover:bg-slate-700/50"
            onClick={resetTest}
            disabled={isLoading}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center my-4 sm:my-8">
            <div className="w-48 h-48 sm:w-64 sm:h-64">
              <Speedometer value={currentSpeed} maxValue={100} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
            <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30 shadow-lg">
              <Signal className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mb-1 sm:mb-2" />
              <span className="text-lg sm:text-2xl font-bold text-white">{speedData.ping}</span>
              <span className="text-xs sm:text-sm text-blue-200">Ms</span>
              <p className='text-xs sm:text-sm text-blue-400'>Speed</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30 shadow-lg">
              <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mb-1 sm:mb-2" />
              <span className="text-lg sm:text-2xl font-bold text-white">{speedData.download}</span>
              <span className="text-xs sm:text-sm text-green-200">MB/s</span>
              <p className='text-xs sm:text-sm text-green-500'>Download</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30 shadow-lg">
              <ArrowUp className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mb-1 sm:mb-2" />
              <span className="text-lg sm:text-2xl font-bold text-white">{speedData.upload}</span>
              <span className="text-xs sm:text-sm text-purple-200">MB/s</span>
              <p className='text-xs sm:text-sm text-purple-500'>Upload</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={runSpeedTest}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-4 sm:px-6 rounded-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
            >
              {isLoading ? `Testing ${testPhase}...` : 'Start Speed Test'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

