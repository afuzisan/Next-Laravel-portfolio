'use client'
import { useAuth } from '@/hooks/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function MainContents() {
  const { user } = useAuth({ middleware: 'guest' })
  const [isClient, setIsClient] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 2 / window.innerHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    })
    renderer.setSize(window.innerWidth / 2, window.innerHeight)

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const material = new THREE.MeshNormalMaterial()
    const torusKnot = new THREE.Mesh(geometry, material)
    scene.add(torusKnot)

    camera.position.z = 30

    const animate = () => {
      requestAnimationFrame(animate)
      torusKnot.rotation.x += 0.01
      torusKnot.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      renderer.dispose()
    }
  }, [isClient])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-col items-center justify-center bg-primary p-8 text-primary-foreground md:w-1/2">
        <div className="flex flex-col items-center gap-4 text-[#4b4b4b]">
          <Image
            src="/note.jpeg"
            alt="incoll vol.2"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <h1 className="text-3xl font-bold">incoll vol.2</h1>
          <p className="max-w-md text-center ">
            投資アイデアを整理し、洞察を深める。
            <br />
            あなたの投資戦略を最適化するメモツール。
          </p>

          <div className="flex gap-2 justify-center">
            <div className="hidden  px-6 py-4 sm:block items-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="ml-4 text-sm text-gray-700 underline">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 underline">
                    ログイン
                  </Link>

                  <Link
                    href="/register"
                    className="ml-4 text-sm text-gray-700 underline">
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative md:w-1/2 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  )
}
