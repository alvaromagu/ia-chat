import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { useEffect, useState } from 'react'

const model = 'Llama-3-8B-Instruct-q4f32_1-MLC'

type CompatibilityCheck = { compatible: true } | { compatible: false, message: string }

// check compatibility of WebGPU API
async function checkCompatibility(): Promise<CompatibilityCheck>{
  if (navigator.gpu == null) {
    return {
      compatible: false,
      message: 'WebGPU not supported'
    }
  }
  const adapter = await navigator.gpu.requestAdapter()
  if (adapter == null) {
    return {
      compatible: false,
      message: 'No GPU adapter found'
    }
  }
  const device = await adapter.requestDevice()
  if (device == null) {
    return {
      compatible: false,
      message: 'No GPU device found'
    }
  }
  return {
    compatible: true
  }
}

export function useEngine () {
  const [engine, setEngine] = useState<WebWorkerMLCEngine | null>(null)
  const [progress, setProgress] = useState('-')

  useEffect(() => {
    let cleanup = false 
    const worker = new Worker(
      new URL('../worker.ts', import.meta.url),
      {
        type: 'module'
      }
    )
    let engine: WebWorkerMLCEngine | null = null;
    (async function () {
      const compatibility = await checkCompatibility()
      if (!compatibility.compatible) {
        setProgress(compatibility.message)
        worker.terminate()
        return alert(compatibility.message)
      }
      if (cleanup) {
        return
      }
      engine = await CreateWebWorkerMLCEngine(
        worker,
        model,
        {
          initProgressCallback: (initProgress) => {
            setProgress(initProgress.text)
          }
        }
      )
      if (cleanup) {
        engine.unload()
        return
      }
      setEngine(engine)
    })()
    return () => {
      cleanup = true
      worker.terminate()
      engine?.unload()
      setEngine(null)
    }
  }, [])

  return {
    engine,
    progress
  }
}